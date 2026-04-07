from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

products = [
    {"id": "p1", "name": "Keyboard", "price": 49.9},
    {"id": "p2", "name": "Mouse", "price": 19.9},
]
cart = {"items": []}
orders = []


class CartItem(BaseModel):
    productId: str
    quantity: int = 1


@app.get("/products")
def get_products():
    return {"data": products}


@app.post("/cart/items")
def add_cart_item(item: CartItem):
    p = next((x for x in products if x["id"] == item.productId), None)
    if not p:
        raise HTTPException(status_code=404, detail="product not found")
    cart["items"].append(
        {"productId": p["id"], "quantity": item.quantity, "price": p["price"]}
    )
    return {"data": cart}


@app.post("/orders", status_code=201)
def create_order():
    if not cart["items"]:
        raise HTTPException(status_code=400, detail="cart is empty")
    total = sum(i["price"] * i["quantity"] for i in cart["items"])
    order = {"id": f"o{len(orders) + 1}", "items": list(cart["items"]), "total": total}
    orders.append(order)
    cart["items"] = []
    return {"data": order}
