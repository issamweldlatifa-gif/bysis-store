// ============================================================
// أداة استعلام قاعدة البيانات
// الاستخدام:
//   node query.js "SELECT * FROM products LIMIT 5"
//   node query.js "SELECT email, name FROM users"
//   node query.js "SELECT order_number, total, status FROM orders"
// ============================================================
import { db, initDb } from './src/db.js';

initDb();

const sql = process.argv[2];
if (!sql) {
    console.log('\n📖 الاستخدام:');
    console.log('   node query.js "SELECT * FROM products LIMIT 5"\n');
    console.log('💡 أمثلة مفيدة:');
    console.log('   node query.js "SELECT id, brand, name, price FROM products"');
    console.log('   node query.js "SELECT * FROM users"');
    console.log('   node query.js "SELECT order_number, total FROM orders"');
    console.log('   node query.js "SELECT COUNT(*) as total FROM products"');
    console.log('   node query.js "SELECT name, price, old_price FROM products WHERE old_price IS NOT NULL"');
    console.log('');
    process.exit(0);
}

try {
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('WITH')) {
        const rows = db.prepare(sql).all();
        console.log(`\n✅ ${rows.length} صفّ:\n`);
        if (rows.length === 0) { console.log('   (لا توجد نتائج)'); }
        else { console.table(rows); }
    } else {
        // INSERT / UPDATE / DELETE
        const info = db.prepare(sql).run();
        console.log(`\n✅ تم التنفيذ: ${info.changes} صفّ متأثّر (آخر معرّف: ${info.lastInsertRowid})`);
    }
    console.log('');
} catch (e) {
    console.log('\n❌ خطأ:', e.message, '\n');
    process.exit(1);
}
