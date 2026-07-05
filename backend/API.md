# Bysis Backend API

REST API server for the Bysis e-commerce app.
Built with **Node.js + Express + SQLite (better-sqlite3)**, using **JWT** for auth
and **bcrypt** for password hashing.

---

## 🚀 Quick Start

```bash
cd bysis-backend
cp .env.example .env        # then edit JWT_SECRET
npm install
npm run seed                # loads 20 demo products
npm start                   # http://localhost:3001
```

Requires Node.js 18+.

---

## 🔑 Authentication

All cart/wishlist/order endpoints require a JWT in the header:
```
Authorization: Bearer <token>
```

Tokens are obtained from `/api/auth/register` or `/api/auth/login`, and last 7 days
(configurable via `JWT_EXPIRES_IN`).

---

## 📡 Endpoints

### Auth
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/api/auth/register` | ❌ | `{name,email,password}` | `{token, user}` |
| POST | `/api/auth/login` | ❌ | `{email,password}` | `{token, user}` |
| GET | `/api/auth/me` | ✅ | — | `{user}` |

### Products
| Method | Path | Auth | Query | Returns |
|---|---|---|---|---|
| GET | `/api/products` | ❌ | `category,brand,size,color,min,max,q,page,limit` | `{total,page,limit,products[]}` |
| GET | `/api/products/:id` | ❌ | — | `{product}` |
| GET | `/api/products/categories/list` | ❌ | — | `{categories[]}` |

**Example filters:**
```
GET /api/products?brand=Nike&max=130
GET /api/products?q=robe
GET /api/products?category=Chaussures&size=42&page=1&limit=10
```

### Cart  *(all require auth)*
| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/cart` | — | `{items[]}` |
| POST | `/api/cart` | `{productId,size,color,qty}` | `{item}` *(merges duplicates)* |
| PUT | `/api/cart/:id` | `{qty}` | `{item}` |
| DELETE | `/api/cart/:id` | — | `{success}` |
| DELETE | `/api/cart` | — | `{success}` *(clear all)* |

### Wishlist  *(all require auth)*
| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/wishlist` | — | `{productIds[]}` |
| POST | `/api/wishlist` | `{productId}` | `{success}` |
| DELETE | `/api/wishlist/:productId` | — | `{success}` |

### Orders  *(all require auth)*
| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/orders` | — | `{orders[]}` |
| POST | `/api/orders` | `{shippingMode,paymentMethod,email,address,items[]}` | `{order}` |
| GET | `/api/orders/:num` | — | `{order}` |

> ⚠️ **The order total is recomputed server-side** from the product prices in the
> database — the client cannot tamper with it. The cart is emptied automatically
> once the order is placed.

---

## 🔒 Security notes

- Passwords hashed with bcrypt (10 rounds), never stored in plaintext.
- JWT signed with `JWT_SECRET` — **change it in production**.
- CORS restricted to `CORS_ORIGIN`.
- All user-scoped queries filter by `user_id` from the token, so a user can
  only access their own cart/orders/wishlist.

---

## 🔄 Migrating to PostgreSQL

The schema in `src/db.js` is portable. To switch to Postgres:
1. `npm install pg`
2. Replace `src/db.js` with a `pg.Pool` connection.
3. Map `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL`, `TEXT` → `VARCHAR`.
4. Move the JSON-array filters (size/color) to `jsonb` columns with GIN indexes.

The route handlers stay the same shape.
