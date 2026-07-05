# 🗄️ كيف تدخل إلى قاعدة بيانات Bysis

قاعدة البيانات من نوع **SQLite** — موجودة في ملف واحد فقط:

```
bysis-backend/data/bysis.db   (56 KB)
```

> على عكس MySQL/PostgreSQL، لا حاجة لخادم قاعدة بيانات يعمل. الملف نفسه **هو** القاعدة. تفتحه مباشرة بأي أداة.

لديك **4 طرق** للدخول إليها:

---

## 1️⃣ أداة الاستعلام الجاهزة (الأسرع — لا تحتاج تثبيت)

داخل مجلد `bysis-backend/` أنشأت لك أداتين:

### Node (ملف `query.js`):
```bash
cd bysis-backend

# استعلام SQL خام
node query.js "SELECT id, brand, name, price FROM products LIMIT 5"

# عرض المستخدمين
node query.js "SELECT id, name, email FROM users"

# البحث عن منتجات مخفّضة
node query.js "SELECT name, price, old_price FROM products WHERE old_price IS NOT NULL"

# عدّ المنتجات حسب الفئة
node query.js "SELECT category, COUNT(*) as n FROM products GROUP BY category"
```

### Python (ملف `db_query.py`) — أوامر جاهزة:
```bash
python3 db_query.py --schema              # هيكل كل الجداول (الأعمدة + الأنواع)
python3 db_query.py --stats               # إحصائيات + إجمالي المبيعات 💰
python3 db_query.py --table products      # عرض جدول كامل بشكل منسّق
python3 db_query.py --table users
python3 db_query.py --table orders
python3 db_query.py "SELECT * FROM carts" # استعلام خام
```

---

## 2️⃣ واجهة رسومية DB Browser (الأفضل للاستكشاف البصري) 👁️

برنامج مجاني بواجهة رسومية يفتح الملف `.db` مثل Excel:

### التثبيت:

| النظام | الأمر / الطريقة |
|---|---|
| **Ubuntu / Debian / Linux** | `sudo apt install sqlitebrowser` |
| **macOS** (مع Homebrew) | `brew install --cask db-browser-for-sqlite` |
| **Windows** | حمّل من [sqlitebrowser.org](https://sqlitebrowser.org/dl/) (ملف `.exe`) |

### الاستخدام:
1. افتح البرنامج → **File → Open Database**
2. اختر الملف: `bysis-backend/data/bysis.db`
3. سترى كل الجداول، انقر عليها لعرض البيانات في جدول
4. تبويب **Execute SQL** لكتابة استعلامات

> 🔒 **مهم:** أوقف الخادم أولاً قبل التعديل المباشر (أو استخدم نسخة من الملف):
> ```bash
> cp data/bysis.db data/bysis-backup.db   # نسخة احتياطية
> ```

---

## 3️⃣ سطر أوامر `sqlite3` (الكلاسيكية)

### التثبيت:
```bash
# Ubuntu/Debian
sudo apt install sqlite3

# macOS
brew install sqlite

# Windows: حمّل من sqlite.org/download.html (أداة sqlite-tools)
```

### الاستخدام التفاعلي:
```bash
cd bysis-backend
sqlite3 data/bysis.db

# سيدخلك في وضع تفاعلي sqlite>. جرّب:
.tables                              # قائمة الجداول
.schema products                     # هيكل جدول
SELECT id, name, price FROM products;-- عرض البيانات
.headers on                          # إظهار أسماء الأعمدة
.mode column                         # عرض أعمدة منسّقة
SELECT * FROM users;                 # عرض كامل
.quit                                # خروج
```

### استعلام مباشر من سطر واحد:
```bash
sqlite3 data/bysis.db "SELECT COUNT(*) FROM products;"
sqlite3 data/bysis.db "SELECT name, email FROM users;"
```

---

## 4️⃣ VS Code (إذا كنت تستخدمه)

ركّب إضافة **"SQLite Viewer"** أو **"SQLite"** (من alexcvzz):
1. افتح VS Code → Extensions → ابحث عن `SQLite`
2. ثبّتها
3. انقر مزدوجاً على `data/bysis.db` → سيعرض الجداول بصرياً داخل المحرّر

---

## 📋 الجداول الموجودة (5)

| الجدول | المحتوى | العدد الحالي |
|---|---|---|
| `users` | الحسابات (كلمة المرور مُشفّرة) | 2 |
| `products` | المنتجات (الـ20) | 20 |
| `carts` | السلاّت الحالية لكل مستخدم | 0 |
| `wishlists` | المفضّلات | 3 |
| `orders` | الطلبات المُنَفَّذة | 2 |

---

## 💡 استعلامات مفيدة جاهزة

```sql
-- كل المنتجات بسعرها
SELECT id, brand, name, price FROM products;

-- المنتجات المخفّضة فقط
SELECT name, price, old_price, discount FROM products WHERE old_price IS NOT NULL;

-- المنتجات حسب الفئة (مع المعدّل)
SELECT category, COUNT(*) as nombre, ROUND(AVG(price),2) as prix_moyen
FROM products GROUP BY category;

-- آخر 5 طلبات
SELECT order_number, total, status, created_at FROM orders ORDER BY id DESC LIMIT 5;

-- أعلى 5 منتجات تقييماً
SELECT name, brand, rating, reviews FROM products ORDER BY rating DESC LIMIT 5;

-- بحث عن مستخدم بالبريد
SELECT * FROM users WHERE email = 'test@bysis.com';
```

---

## ⚠️ تحذيرات

- **لا تفتح** الملف بأداتين في نفس وقت التعديل (قد يتعطّل)
- **أوقف الخادم** قبل التعديل المباشر عبر DB Browser
- **خذ نسخة احتياطية** دائماً قبل التجارب:
  ```bash
  cp data/bysis.db data/bysis-backup-$(date +%F).db
  ```
- لإعادة التهيئة الكاملة (حذف كل البيانات):
  ```bash
  rm data/bysis.db && npm run seed
  ```
