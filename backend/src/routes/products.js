// ============================================================
// Products routes
//   GET /api/products            — list (with filters + pagination)
//   GET /api/products/:id        — single product
//   GET /api/products/categories/list  — distinct categories
// ============================================================
import { Router } from 'express';
import { db } from '../db.js';

export const productsRouter = Router();

// Map a raw DB row to the JSON shape the frontend expects.
function mapProduct(row) {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    price: row.price,
    oldPrice: row.old_price,
    discount: row.discount,
    category: row.category,
    image: row.image,
    images: JSON.parse(row.images),
    rating: row.rating,
    reviews: row.reviews,
    desc: row.description,
    colors: JSON.parse(row.colors),
    sizes: JSON.parse(row.sizes),
    badge: row.badge,
  };
}

// GET /api/products?category=&brand=&size=&color=&min=&max=&q=&page=&limit=
productsRouter.get('/', (req, res) => {
  const { category, brand, size, color, min, max, q, page = '1', limit = '50' } = req.query;

  const where = [];
  const params = {};

  if (category && category !== 'all') { where.push('category = @category'); params.category = category; }
  if (brand && brand !== 'all')       { where.push('brand = @brand');       params.brand = brand; }
  if (q) {
    where.push('(name LIKE @q OR brand LIKE @q)');
    params.q = `%${q}%`;
  }
  if (min) { where.push('price >= @min'); params.min = parseFloat(min); }
  if (max) { where.push('price <= @max'); params.max = parseFloat(max); }

  let sql = 'SELECT * FROM products';
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY id ASC';

  // Note: size & color are JSON arrays stored as text, so we filter in JS
  // (SQLite has no native JSON array search). For large catalogs this would
  // move to Postgres with jsonb columns + GIN indexes.
  let rows = db.prepare(sql).all(params);
  if (size) rows = rows.filter(r => JSON.parse(r.sizes).includes(size));
  if (color) rows = rows.filter(r => JSON.parse(r.colors).map(c => c.toLowerCase()).includes(color.toLowerCase()));

  const total = rows.length;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const start = (pageNum - 1) * limitNum;
  const paged = rows.slice(start, start + limitNum).map(mapProduct);

  res.json({ total, page: pageNum, limit: limitNum, products: paged });
});

// GET /api/products/categories/list
productsRouter.get('/categories/list', (_req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();
  res.json({ categories: rows.map(r => r.category) });
});

// GET /api/products/:id
productsRouter.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Produit introuvable' });
  res.json({ product: mapProduct(row) });
});
