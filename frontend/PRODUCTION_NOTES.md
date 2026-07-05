# Bysis — ملاحظات الإنتاج (Production Notes)

هذا الملف يوثّق المقترحات التي **لا يمكن إنجازها** في النموذج الحالي (ملف HTML ثابت واحد) لأنها تتطلّب بنية تحتية (backend/خوادم). مطلوبة قبل الانتقال للإنتاج الحقيقي.

---

## 🔴 1. طبقة البيانات الحقيقية (Backend API)

**الواقع الحالي:** كل المنتجات والأسعار hardcoded في JS (`const products = [...]`). لا يمكن إضافة/تعديل منتجات دون إعادة نشر، ولا مزامنة السلة بين الأجهزة.

**المطلوب بناؤه:**

### نقاط API المقترحة
```
GET    /api/products?category=&brand=&min=&max=    → قائمة منتجات بفلترة
GET    /api/products/:id                            → تفاصيل منتج
POST   /api/cart/sync                               → مزامنة السلة (مستخدم مسجّل)
GET    /api/orders                                  → طلبات المستخدم
POST   /api/orders                                  → إنشاء طلب
POST   /api/auth/login                              → تسجيل دخول حقيقي (JWT)
POST   /api/auth/register                           → إنشاء حساب
GET    /api/wishlist                                → المفضّلة (سحابية)
```

### في الواجهة الأمامية
استبدال القراءة المباشرة من `products[]` بـ `fetch('/api/products')` مع:
- عرض skeleton أثناء التحميل (موجود الآن ✅)
- معالجة الأخطاء + إعادة المحاولة
- تقسيم الصفحات (pagination) لأن المنتجات ستكون آلاف

### التقنيات المقترحة
- **Backend:** Node.js (Express) أو Python (FastAPI) أو Supabase/Firebase
- **قاعدة البيانات:** PostgreSQL (منتجات/طلبات) + Redis (جلسات/سلة)
- **الدفع الحقيقي:** Stripe / PayPal SDK (بدل المحاكاة الحالية)

---

## 🔴 2. استضافة الصور (Image Hosting)

**الواقع الحالي:** 71 صورة معتمدة كلياً على `images.unsplash.com` — بطيئة، تتطلّب اتصالاً بالإنترنت، ويمكن لـ Unsplash إيقافها.

**المطلوب:**

### خطوات الترحيل
1. تنزيل الـ 71 صورة
2. تحويلها إلى **WebP/AVIF** (حجم أقل بـ 30-50%)
3. توليد أحجام متعددة (thumbnail, medium, large)
4. رفعها لـ **CDN** (Cloudflare, AWS CloudFront, Vercel)
5. استبدال روابط Unsplash بروابط CDN

### استخدام `srcset` لتسليم الحجم المناسب
```html
<img
  srcset="product-480.webp 480w, product-800.webp 800w, product-1200.webp 1200w"
  sizes="(max-width: 430px) 50vw, 25vw"
  src="product-800.webp"
  loading="lazy"
  width="400" height="500"
  alt="..."
>
```

### الأثر المتوقّع
- ⚡ تحميل أسرع بـ 40-60%
- 📉 تقليل Layout Shift (CLS) عبر `width/height`
- 🔒 استقلال عن طرف ثالث

---

## 🟡 3. تحسينات إضافية للإنتاج

| الميزة | الوصف |
|---|---|
| **Environment variables** | فصل مفاتيح API عن الكود |
| **Rate limiting** | حماية نقاط API من الإساءة |
| **CSRF/XSS protection** | للنماذج (خاصة الدفع) |
| **Image optimization pipeline** | CI/CD يحوّل الصور تلقائياً |
| **Analytics** | تتبّع النقرات، السلة المتروكة، التحويلات |
| **A/B testing** | لتجربة التخطيطات/الألوان |
| **SEO** | meta tags ديناميكية، sitemap، structured data |
| **Accessibility audit** | WCAG 2.1 AA (تباين، قارئ شاشة، تنقّل بلوحة المفاتيح) |

---

## ✅ ما تم إنجازه (مرجع سريع)

| # | الميزة | الحالة |
|---|---|---|
| 1-8 | إصلاحات الأخطاء الأولية | ✅ |
| التحقق من الحقول + الدفع + الفلاتر | ✅ |
| تسجيل الدخول/التسجيل | ✅ |
| سجل الطلبات | ✅ |
| i18n (FR/EN/AR + RTL) | ✅ |
| Skeletons | ✅ |
| Onboarding replay | ✅ |
| PWA (manifest + SW + أيقونات) | ✅ |
| نظام أيقونات sprite | ✅ |

---

**الخلاصة:** الواجهة الأمامية جاهزة كنموذج عرض متكامل. الانتقال للإنتاج يتطلّب بناء الـ Backend (#1) وترحيل الصور (#2) أولاً.
