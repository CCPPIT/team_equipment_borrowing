import { config } from 'dotenv'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { fileURLToPath } from 'node:url'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
config({ path: fileURLToPath(new URL('../../../../.env', import.meta.url)), quiet: true }); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
export interface Env { nodeEnv: 'development' | 'test' | 'production'; apiPort: number; databaseUrl: string; } // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
export function parseEnv(input: NodeJS.ProcessEnv): Env { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  const nodeEnv = input.NODE_ENV ?? 'development'; // تعريف قيمة محلية واضحة النوع لهذا المسار
  if (nodeEnv !== 'development' && nodeEnv !== 'test' && nodeEnv !== 'production') throw new Error('NODE_ENV غير صالح'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  const rawPort = input.API_PORT ?? '3001'; // تعريف قيمة محلية واضحة النوع لهذا المسار
  if (!/^\d+$/.test(rawPort)) throw new Error('API_PORT يجب أن يكون عددًا صحيحًا'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  const apiPort = Number(rawPort); // تعريف قيمة محلية واضحة النوع لهذا المسار
  if (apiPort < 1 || apiPort > 65535) throw new Error('API_PORT خارج النطاق'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  const databaseUrl = input.DATABASE_URL; // تعريف قيمة محلية واضحة النوع لهذا المسار
  if (!databaseUrl) throw new Error('DATABASE_URL مطلوب'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  let url: URL; // تعريف قيمة محلية واضحة النوع لهذا المسار
  try { url = new URL(databaseUrl); } catch { throw new Error('DATABASE_URL غير صالح'); } // إيقاف المسار الفاشل دون تحويله إلى نتيجة نجاح
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || url.pathname === '/') throw new Error('اتصال PostgreSQL غير صالح'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  return { nodeEnv, apiPort, databaseUrl }; // إرجاع النتيجة بعد اكتمال التحقق المطلوب
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
export function loadEnv(): Env { return parseEnv(process.env); } // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
export function loadTestEnv(): Env { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  const databaseUrl = process.env.TEST_DATABASE_URL; // تعريف قيمة محلية واضحة النوع لهذا المسار
  if (!databaseUrl) throw new Error('TEST_DATABASE_URL مطلوب دون بديل تلقائي'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  const parsed = parseEnv({ ...process.env, NODE_ENV: 'test', DATABASE_URL: databaseUrl }); // تعريف قيمة محلية واضحة النوع لهذا المسار
  const url = new URL(databaseUrl); // تعريف قيمة محلية واضحة النوع لهذا المسار
  const dev = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : null; // تعريف قيمة محلية واضحة النوع لهذا المسار
  if (!decodeURIComponent(url.pathname).endsWith('_test') || (url.searchParams.get('schema') ?? 'public') !== 'public') throw new Error('قاعدة الاختبار يجب أن تنتهي بـ _test وتستخدم public'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  if (dev && dev.hostname === url.hostname && (dev.port || '5432') === (url.port || '5432') && dev.pathname === url.pathname) throw new Error('قاعدة الاختبار يجب أن تختلف عن قاعدة التطوير'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  return parsed; // إرجاع النتيجة بعد اكتمال التحقق المطلوب
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
