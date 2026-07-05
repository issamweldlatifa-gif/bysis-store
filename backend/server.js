// ============================================================
// Bysis API server
// Entry point. Mounts routers under /api and starts Express.
// ============================================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './src/db.js';
import { authRouter } from './src/routes/auth.js';
import { productsRouter } from './src/routes/products.js';
import { cartRouter } from './src/routes/cart.js';
import { wishlistRouter } from './src/routes/wishlist.js';
import { ordersRouter } from './src/routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: allow the configured origins (frontend dev servers in dev, the
// production domain in prod).
const origins = (process.env.CORS_ORIGIN || 'http://localhost:8000')
  .split(',')
  .map(o => o.trim());

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Request logger (tiny)
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'bysis-api', time: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', ordersRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route introuvable: ${req.method} ${req.url}` });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Initialize DB then start
initDb();
app.listen(PORT, () => {
  console.log(`\n🚀 Bysis API running at http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health`);
  console.log(`   Products: http://localhost:${PORT}/api/products`);
  console.log(`   CORS: ${origins.join(', ')}\n`);
});
