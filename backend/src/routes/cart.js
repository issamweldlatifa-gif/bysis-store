// ============================================================
// Cart routes (server-side, per user)
//   GET    /api/cart              — list items
//   POST   /api/cart              — add item
//   PUT    /api/cart/:id          — update qty
//   DELETE /api/cart/:id          — remove item
//   DELETE /api/cart              — clear
// ============================================================
import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const cartRouter = Router();
cartRouter.use(requireAuth); // all cart ops require auth

function mapItem(row) {
  return {
    cartId: row.id,
    id: row.product_id,
    name: row.name,
    brand: row.brand,
    price: row.price,
    image: row.image,
    size: row.size,
    color: row.color,
    qty: row.qty,
  };
}

// GET /api/cart
cartRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM carts WHERE user_id = ? ORDER BY id').all(req.user.id);
  res.json({ items: rows.map(mapItem) });
});

// POST /api/cart  { productId, size, color, qty }
cartRouter.post('/', (req, res) => {
  const { productId, size, color, qty = 1 } = req.body || {};
  if (!productId || !size || !color)
    return res.status(400).json({ error: 'productId, size et color sont requis' });

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });

  try {
    const info = db.prepare(`
      INSERT INTO carts (user_id, product_id, name, brand, price, image, size, color, qty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, product_id, size, color) DO UPDATE SET qty = carts.qty + excluded.qty
    `).run(req.user.id, productId, product.name, product.brand, product.price,
           product.image, size, color, Math.max(1, parseInt(qty, 10) || 1));
    const row = db.prepare('SELECT * FROM carts WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ item: mapItem(row) });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/cart/:id  { qty }
cartRouter.put('/:id', (req, res) => {
  const qty = Math.max(1, parseInt(req.body?.qty, 10) || 1);
  const row = db.prepare('SELECT * FROM carts WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Article introuvable' });
  db.prepare('UPDATE carts SET qty = ? WHERE id = ?').run(qty, row.id);
  res.json({ item: mapItem({ ...row, qty }) });
});

// DELETE /api/cart/:id
cartRouter.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM carts WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Article introuvable' });
  db.prepare('DELETE FROM carts WHERE id = ?').run(row.id);
  res.json({ success: true });
});

// DELETE /api/cart  — clear all
cartRouter.delete('/', (req, res) => {
  db.prepare('DELETE FROM carts WHERE user_id = ?').run(req.user.id);
  res.json({ success: true });
});
