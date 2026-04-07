# 电商 MVP（Python / FastAPI）

## 目录结构

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

## 运行

```bash
cd examples/ecommerce-mini-python
pip install -r requirements.txt
pytest
uvicorn src.main:app --reload
```
