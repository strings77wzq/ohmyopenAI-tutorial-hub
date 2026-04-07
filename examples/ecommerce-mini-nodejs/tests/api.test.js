import test from 'node:test'
import assert from 'node:assert/strict'
import { server } from '../src/server.js'

const base = 'http://127.0.0.1:3456'

test.before(async () => {
  await new Promise((resolve) => server.listen(3456, resolve))
})

test.after(async () => {
  await new Promise((resolve) => server.close(resolve))
})

test('products/cart/orders flow', async () => {
  const p = await fetch(`${base}/products`)
  assert.equal(p.status, 200)

  const c = await fetch(`${base}/cart/items`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ productId: 'p1', quantity: 2 })
  })
  assert.equal(c.status, 200)

  const o = await fetch(`${base}/orders`, { method: 'POST' })
  assert.equal(o.status, 201)
  const payload = await o.json()
  assert.ok(payload.data.total > 0)
})
