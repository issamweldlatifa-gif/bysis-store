// ============================================================
// Database setup (SQLite via better-sqlite3)
// Schema is designed to be portable to PostgreSQL later:
//   - INTEGER PRIMARY KEY AUTOINCREMENT  →  SERIAL
//   - TEXT NOT NULL DEFAULT '...'        →  VARCHAR NOT NULL DEFAULT '...'
// Just swap this file's contents for a Postgres connection pool.
// ============================================================
import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DB_PATH = process.env.DB_PATH || './data/bysis.db';

// Make sure the folder exists
mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL'); // better concurrency

// ----- Schema -----
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar_url    TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      brand       TEXT NOT NULL,
      name        TEXT NOT NULL,
      price       REAL NOT NULL,
      old_price   REAL,
      discount    INTEGER,
      category    TEXT NOT NULL,
      image       TEXT NOT NULL,
      images      TEXT NOT NULL,          -- JSON array string
      rating      REAL NOT NULL DEFAULT 0,
      reviews     INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      colors      TEXT NOT NULL,          -- JSON array string
      sizes       TEXT NOT NULL,          -- JSON array string
      badge       TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS carts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      product_id  INTEGER NOT NULL,
      name        TEXT NOT NULL,
      brand       TEXT NOT NULL,
      price       REAL NOT NULL,
      image       TEXT NOT NULL,
      size        TEXT NOT NULL,
      color       TEXT NOT NULL,
      qty         INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (user_id, product_id, size, color)
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      product_id  INTEGER NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number  TEXT NOT NULL UNIQUE,
      user_id       INTEGER NOT NULL,
      total         REAL NOT NULL,
      shipping_mode TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status        TEXT NOT NULL DEFAULT 'confirmed',
      email         TEXT NOT NULL,
      address_json  TEXT NOT NULL,          -- JSON: firstname, lastname, address, zip, city
      items_json    TEXT NOT NULL,          -- JSON array of cart items snapshot
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  console.log('[db] schema ready at', DB_PATH);
}
