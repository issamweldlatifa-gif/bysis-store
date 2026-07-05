// ============================================================
// Bysis API client (frontend)
// Talks to the backend when available, falls back to the built-in
// demo data when offline / running from file://.
// ============================================================

// Change this to your deployed backend URL in production.
// When empty or unreachable, the app falls back to local demo data.
const API_BASE = window.BYSIS_API_BASE || 'http://localhost:3001/api';

let _token = localStorage.getItem('bysis_token') || null;
let _online = true; // assumed online until a request fails

const api = {
  setToken(t) { _token = t; if (t) localStorage.setItem('bysis_token', t); else localStorage.removeItem('bysis_token'); },
  getToken() { return _token; },
  isOnline() { return _online; },

  async _fetch(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (_token) headers['Authorization'] = 'Bearer ' + _token;
    try {
      const res = await fetch(API_BASE + path, { ...options, headers });
      _online = true;
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (e) {
      _online = false;
      throw e;
    }
  },

  // ---- Auth ----
  async register(name, email, password) {
    const d = await this._fetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    this.setToken(d.token);
    return d.user;
  },
  async login(email, password) {
    const d = await this._fetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    this.setToken(d.token);
    return d.user;
  },
  async me() {
    if (!_token) return null;
    try { return (await this._fetch('/auth/me')).user; } catch { return null; }
  },
  logout() { this.setToken(null); },

  // ---- Products ----
  async getProducts(filters = {}) {
    const qs = new URLSearchParams(filters).toString();
    return (await this._fetch('/products' + (qs ? '?' + qs : ''))).products;
  },
  async getProduct(id) { return (await this._fetch('/products/' + id)).product; },

  // ---- Cart ----
  async getCart() { return (await this._fetch('/cart')).items; },
  async addToCart(productId, size, color, qty = 1) {
    return (await this._fetch('/cart', { method: 'POST', body: JSON.stringify({ productId, size, color, qty }) })).item;
  },
  async updateCartItem(cartId, qty) {
    return (await this._fetch('/cart/' + cartId, { method: 'PUT', body: JSON.stringify({ qty }) })).item;
  },
  async removeFromCart(cartId) {
    return (await this._fetch('/cart/' + cartId, { method: 'DELETE' }));
  },
  async clearCart() { return (await this._fetch('/cart', { method: 'DELETE' })); },

  // ---- Wishlist ----
  async getWishlist() { return (await this._fetch('/wishlist')).productIds; },
  async addWishlist(productId) {
    return (await this._fetch('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }));
  },
  async removeWishlist(productId) {
    return (await this._fetch('/wishlist/' + productId, { method: 'DELETE' }));
  },

  // ---- Orders ----
  async getOrders() { return (await this._fetch('/orders')).orders; },
  async placeOrder(payload) {
    return (await this._fetch('/orders', { method: 'POST', body: JSON.stringify(payload) })).order;
  },
};

// Expose globally
window.api = api;
