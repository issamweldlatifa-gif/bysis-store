// ============================================================
// Auth routes: POST /register, POST /login, GET /me
// ============================================================
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// POST /api/auth/register
authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || name.trim().length < 2)
    return res.status(400).json({ error: 'Nom invalide (min. 2 caractères)' });
  if (!isEmail(email))
    return res.status(400).json({ error: 'Email invalide' });
  if (!password || password.length < 6)
    return res.status(400).json({ error: 'Mot de passe trop court (min. 6 caractères)' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing)
    return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
  ).run(name.trim(), email.toLowerCase(), hash);

  const user = { id: info.lastInsertRowid, name: name.trim(), email: email.toLowerCase() };
  const token = signToken(user);
  res.status(201).json({ token, user });
});

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!isEmail(email) || !password)
    return res.status(400).json({ error: 'Email et mot de passe requis' });

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!row)
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  if (!bcrypt.compareSync(password, row.password_hash))
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  const user = { id: row.id, name: row.name, email: row.email };
  const token = signToken(user);
  res.json({ token, user });
});

// GET /api/auth/me — returns the current user from the token
authRouter.get('/me', requireAuth, (req, res) => {
  const row = db.prepare('SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ?')
    .get(req.user.id);
  if (!row) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json({ user: row });
});
