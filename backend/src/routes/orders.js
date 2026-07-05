// ============================================================
// Orders routes (server-side, per user)
//   GET  /api/orders         — list user's orders
//   POST /api/orders         — place a new order (snapshot of cart)
//   GET  /api/orders/:num    — single order by order number
// ============================================================
import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const ordersRouter = Router();
ordersRouter.use(requireAuth);

function orderNumber() {
  const n = Math.floor(Date.now() / 1000) % 1000000;
  return '#BS-' + String(n).padStart(6, '0');
}

// GET /api/orders
ordersRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ orders: rows.map(mapOrder) });
});

// POST /api/orders  { shippingMode, paymentMethod, email, address, items }
// NOTE: in production the total is recomputed server-side from cart items,
// never trusted from the client, to prevent tampering.
ordersRouter.post('/', (req, res) => {
  const { shippingMode, paymentMethod, email, address, items } = req.body || {};

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'Le panier est vide' });
  if (!email || !address)
    return res.status(400).json({ error: 'Email et adresse requis' });

  // Recompute the total from the DB to avoid client-side tampering.
  const subtotal = items.reduce((sum, it) => {
    const p = db.prepare('SELECT price FROM products WHERE id = ?').get(it.id);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);
  const shippingFee = shippingMode === 'express' ? 5.90 : 0;
  const total = subtotal + shippingFee;

  const num = orderNumber();
  db.prepare(`
    INSERT INTO orders (order_number, user_id, total, shipping_mode, payment_method, email, address_json, items_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(num, req.user.id, total, shippingMode || 'standard', paymentMethod || 'card',
         email, JSON.stringify(address), JSON.stringify(items));

  // Empty the user's cart now that the order is placed.
  db.prepare('DELETE FROM carts WHERE user_id = ?').run(req.user.id);

  const row = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(num);
  res.status(201).json({ order: mapOrder(row) });
});

// GET /api/orders/:num
ordersRouter.get('/:num', (req, res) => {
  const row = db.prepare('SELECT * FROM orders WHERE order_number = ? AND user_id = ?')
    .get(req.params.num, req.user.id);
  if (!row) return res.status(404).json({ error: 'Commande introuvable' });
  res.json({ order: mapOrder(row) });
});

function mapOrder(row) {
  return {
    id: row.id,
    number: row.order_number,
    total: row.total,
    shippingMode: row.shipping_mode,
    paymentMethod: row.payment_method,
    status: row.status,
    email: row.email,
    address: JSON.parse(row.address_json),
    items: JSON.parse(row.items_json),
    createdAt: row.created_at,
  };
}
