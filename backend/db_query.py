#!/usr/bin/env python3
# ============================================================
# أداة استعلام قاعدة بيانات Bysis (Python)
# لا تحتاج تثبيت أي شيء — sqlite3 مدمج في Python
#
# الاستخدام:
#   python3 db_query.py "SELECT * FROM products LIMIT 5"
#   python3 db_query.py --table users        (عرض جدول كامل)
#   python3 db_query.py --stats              (إحصائيات)
#   python3 db_query.py --schema             (هيكل الجداول)
#   python3 db_query.py                      (قائمة الأوامر)
# ============================================================
import sqlite3, sys, os

DB = os.path.join(os.path.dirname(__file__), 'data', 'bysis.db')

def main():
    if len(sys.argv) < 2:
        print("\n📖 الاستخدام:")
        print("   python3 db_query.py \"SELECT * FROM products LIMIT 5\"")
        print("\n💡 أوامر جاهزة:")
        print("   python3 db_query.py --schema   (هيكل كل الجداول)")
        print("   python3 db_query.py --stats    (إحصائيات)")
        print("   python3 db_query.py --table products   (عرض جدول)")
        print("")
        return

    arg = sys.argv[1]
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    try:
        if arg == "--schema":
            # عرض هيكل كل جدول
            tables = cur.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
            ).fetchall()
            for t in tables:
                cols = cur.execute(f"PRAGMA table_info({t['name']})").fetchall()
                print(f"\n📋 {t['name']}:")
                for c in cols:
                    key = "🔑 " if c['pk'] else "   "
                    print(f"{key}{c['name']:<20} {c['type'] or 'TEXT':<20}" +
                          (" NOT NULL" if c['notnull'] else ""))

        elif arg == "--stats":
            tables = cur.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
            ).fetchall()
            print("\n📊 إحصائيات قاعدة البيانات:\n")
            for t in tables:
                n = cur.execute(f"SELECT COUNT(*) FROM {t['name']}").fetchone()[0]
                print(f"   {t['name']:<15} → {n} صفّ")
            # قيمة إجمالية
            total_sales = cur.execute(
                "SELECT COALESCE(SUM(total),0) FROM orders"
            ).fetchone()[0]
            print(f"\n   💰 إجمالي المبيعات: {total_sales:.2f} €")

        elif arg == "--table":
            if len(sys.argv) < 3:
                print("حدّد اسم الجدول: python3 db_query.py --table products")
                return
            tbl = sys.argv[2]
            rows = cur.execute(f"SELECT * FROM {tbl}").fetchall()
            print(f"\n📋 {tbl} ({len(rows)} صفّ):\n")
            if rows:
                cols = [d[0] for d in cur.description]
                print(" | ".join(c[:15].ljust(15) for c in cols))
                print("-" * (18 * len(cols)))
                for r in rows:
                    vals = []
                    for c in cols:
                        v = str(r[c])
                        if len(v) > 15: v = v[:12] + "..."
                        vals.append(v.ljust(15))
                    print(" | ".join(vals))

        else:
            # استعلام SQL خام
            cur.execute(arg)
            if arg.strip().upper().startswith("SELECT"):
                rows = cur.fetchall()
                print(f"\n✅ {len(rows)} صفّ:\n")
                if rows:
                    cols = [d[0] for d in cur.description]
                    print(" | ".join(c[:15].ljust(15) for c in cols))
                    print("-" * (18 * len(cols)))
                    for r in rows:
                        vals = []
                        for c in cols:
                            v = str(r[c])
                            if len(v) > 15: v = v[:12] + "..."
                            vals.append(v.ljust(15))
                        print(" | ".join(vals))
            else:
                conn.commit()
                print(f"\n✅ تم التنفيذ: {cur.rowcount} صفّ متأثّر")
        print("")
    except Exception as e:
        print(f"\n❌ خطأ: {e}\n", file=sys.stderr)
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    main()
