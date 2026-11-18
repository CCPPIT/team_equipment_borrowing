import { spawnSync } from 'node:child_process'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import pg from 'pg'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import { connectionString, root } from './environment.mjs'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
const client = new pg.Client({ connectionString }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
try { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await client.connect(); const result = await client.query('SELECT current_database() AS name'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  if (!result.rows[0].name.endsWith('_phase05_test')) throw new Error('رفض ترحيل قاعدة غير مخصصة لـPhase05'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} finally { await client.end(); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
const result = spawnSync('npm', ['run', 'db:migrate'], { cwd: root, env: { ...process.env, DATABASE_URL: connectionString }, stdio: 'inherit' }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
if (result.error) throw result.error; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
process.exitCode = result.status ?? 1; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
