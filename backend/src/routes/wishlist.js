// ============================================================
// Wishlist routes (server-side, per user)
//   GET    /api/wishlist              — list product ids
//   POST   /api/wishlist              — add product id
//   DELETE /api/wishlist/:productId   — remove product id
// ============================================================
import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const wishlistRouter = Router();
wishlistRouter.use(requireAuth);

// GET /api/wishlist
wishlistRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT product_id FROM wishlists WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  res.json({ productIds: rows.map(r => r.product_id) });
});

// POST /api/wishlist  { productId }
wishlistRouter.post('/', (req, res) => {
  const productId = req.body?.productId;
  if (!productId) return res.status(400).json({ error: 'productId requis' });
  const exists = db.prepare('SELECT 1 FROM products WHERE id = ?').get(productId);
  if (!exists) return res.status(404).json({ error: 'Produit introuvable' });
  try {
    db.prepare('INSERT OR IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)').run(req.user.id, productId);
  } catch (e) { /* ignore duplicate */ }
  res.status(201).json({ success: true });
});

// DELETE /api/wishlist/:productId
wishlistRouter.delete('/:productId', (req, res) => {
  db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?')
    .run(req.user.id, req.params.productId);
  res.json({ success: true });
});
