import { config } from 'dotenv'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import { fileURLToPath } from 'node:url'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export const root = fileURLToPath(new URL('../../', import.meta.url)); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export const connectionString = process.env.SYSTEM_DATABASE_URL; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
if (!connectionString) throw new Error('SYSTEM_DATABASE_URL مطلوب صراحة لقاعدة Phase05 المعزولة'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
const url = new URL(connectionString); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
if (!['postgres:', 'postgresql:'].includes(url.protocol) || !decodeURIComponent(url.pathname).endsWith('_phase05_test') || (url.searchParams.get('schema') ?? 'public') !== 'public') throw new Error('يلزم اسم قاعدة ينتهي بـ _phase05_test ومخطط public'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
for (const protectedUrl of [process.env.DATABASE_URL, process.env.TEST_DATABASE_URL]) { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  if (!protectedUrl) continue; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const other = new URL(protectedUrl); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  if (other.hostname === url.hostname && (other.port || '5432') === (url.port || '5432') && other.pathname === url.pathname) throw new Error('رفض استخدام قاعدة التطوير أو اختبار المراحل السابقة'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export const target = { hostname: url.hostname, port: Number(url.port || 5432) }; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
const proxied = new URL(url); proxied.hostname = '127.0.0.1'; proxied.port = '5545'; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export const proxyDatabaseUrl = proxied.toString(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
