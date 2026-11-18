#!/usr/bin/env bash
set -euo pipefail # إيقاف إعداد قاعدة التطوير عند أول فشل دون إخفائه
PG_BINDIR="$(pg_config --bindir)" # اكتشاف ملفات PostgreSQL المثبتة دون تثبيت تلقائي
PGDATA="${TEAM_PGDATA:-$HOME/.local/team-equipment-pg}" # اختيار مسار محلي معزول خارج ملفات المشروع
ACTION="${1:-start}" # تحديد الإجراء المطلوب صراحة
if [ "$ACTION" = 'stop' ]; then # إيقاف العنقود الخاص بالمشروع فقط
  "$PG_BINDIR/pg_ctl" -D "$PGDATA" stop -m fast # إغلاق الاتصالات والتراجع عن المعاملات المفتوحة
  exit 0 # إنهاء إجراء الإيقاف
fi # نهاية شرط الإيقاف
if [ "$ACTION" != 'start' ] && [ "$ACTION" != 'setup' ]; then echo 'استخدم start أو setup أو stop' >&2; exit 1; fi # رفض إجراءات غير معروفة
mkdir -p "$PGDATA" # تجهيز مكان البيانات دون حذف شيء موجود
if [ ! -f "$PGDATA/PG_VERSION" ]; then # تهيئة العنقود فقط إذا لم يكن قد أُنشئ
  "$PG_BINDIR/initdb" -D "$PGDATA" -U team_equipment --auth-local=trust --auth-host=trust --encoding=UTF8 --no-locale # مصادقة محلية للتطوير المعزول فقط وليست إعداد إنتاج
fi # نهاية التهيئة الأولى
if ! "$PG_BINDIR/pg_ctl" -D "$PGDATA" status >/dev/null 2>&1; then # عدم بدء نسخة ثانية من العنقود
  "$PG_BINDIR/pg_ctl" -D "$PGDATA" -l "$PGDATA/server.log" -o "-h 127.0.0.1 -p 5432 -k $PGDATA" start # الاستماع إلى loopback فقط وعدم تعريض قاعدة البيانات للشبكة
fi # نهاية شرط التشغيل
if [ "$ACTION" = 'setup' ]; then # إنشاء القاعدتين المقصودتين دون حذف أو إعادة تهيئة
  for database in team_equipment team_equipment_test; do # أسماء ثابتة تمنع توجيه التنظيف إلى قاعدة عشوائية
    if ! "$PG_BINDIR/psql" -h 127.0.0.1 -U team_equipment -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$database'" | grep -qx 1; then # فحص الوجود باستعلام محلي آمن للأسماء الثابتة
      "$PG_BINDIR/createdb" -h 127.0.0.1 -U team_equipment "$database" # إنشاء القاعدة الغائبة فقط
    fi # نهاية شرط وجود القاعدة
  done # نهاية القاعدتين المعزولتين
fi # نهاية الإعداد
