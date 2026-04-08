# E-commerce MVP (Python / FastAPI)

## Directory Structure

```text
examples/ecommerce-mini-python/
  src/
  tests/
  openspec/
```

## API

- `GET /products`
- `POST /cart/items`
- `POST /orders`

## Run

```bash
cd examples/ecommerce-mini-python
pip install -r requirements.txt
pytest
uvicorn src.main:app --reload
```