from fastapi.testclient import TestClient
from src.main import app


client = TestClient(app)


def test_products_cart_orders_flow():
    r1 = client.get("/products")
    assert r1.status_code == 200

    r2 = client.post("/cart/items", json={"productId": "p1", "quantity": 2})
    assert r2.status_code == 200

    r3 = client.post("/orders")
    assert r3.status_code == 201
    assert r3.json()["data"]["total"] > 0
