import http from 'node:http'

const products = [
  { id: 'p1', name: 'Keyboard', price: 49.9 },
  { id: 'p2', name: 'Mouse', price: 19.9 }
]
const cart = { items: [] }
const orders = []

const send = (res, code, data) => {
  res.writeHead(code, { 'content-type': 'application/json' })
  res.end(JSON.stringify(data))
}

const parseBody = async (req) => {
  const chunks = []
  for await (const c of req) chunks.push(c)
  if (!chunks.length) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/products') {
    return send(res, 200, { data: products })
  }

  if (req.method === 'POST' && req.url === '/cart/items') {
    const body = await parseBody(req)
    const p = products.find((x) => x.id === body.productId)
    if (!p) return send(res, 404, { error: 'product not found' })
    cart.items.push({ productId: p.id, quantity: body.quantity ?? 1, price: p.price })
    return send(res, 200, { data: cart })
  }

  if (req.method === 'POST' && req.url === '/orders') {
    if (!cart.items.length) return send(res, 400, { error: 'cart is empty' })
    const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0)
    const order = { id: `o${orders.length + 1}`, items: [...cart.items], total }
    orders.push(order)
    cart.items = []
    return send(res, 201, { data: order })
  }

  return send(res, 404, { error: 'not found' })
})

export { server }
