import type { NextRequest } from 'next/server'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import type { FastifyInstance } from 'fastify'; // نوع المثيل المعاد من بناء تطبيق الخادم
import { buildApp } from '../../../../../api/src/app'; // إعادة استخدام منطق الـ API نفسه دون نسخه أو الانحراف عنه
export const runtime = 'nodejs'; // قفل تشغيل Node لأن Prisma يحتاج TCP وليس بيئة حافة
export const dynamic = 'force-dynamic'; // منع أي تخزين ثابت لمسارات القراءة والكتابة الحية
const notReadyStatus = 500; // رمز خطأ آمن عند غياب إعداد قاعدة البيانات في الدالة
const hopByHop = new Set(['connection', 'keep-alive', 'transfer-encoding', 'content-length', 'upgrade', 'host']); // رؤوس لا تنقل بين طبقتي البيئة
let appPromise: Promise<FastifyInstance> | undefined; // تخزين المثيل بين الاستدعاءات الدافئة لنفس الدالة
function getApp(): Promise<FastifyInstance> { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  if (!appPromise) { // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
    const databaseUrl = process.env.DATABASE_URL; // قراءة رابط قاعدة البيانات من بيئة الدالة فقط
    if (!databaseUrl) return Promise.reject(new Error('DATABASE_URL مطلوب')); // إيقاف المسار الفاشل دون تحويله إلى نتيجة نجاح
    appPromise = buildApp({ nodeEnv: 'production', apiPort: 3001, databaseUrl }).catch((error) => { appPromise = undefined; throw error; }); // عدم تخزين فشل الاتصال لإعادة المحاولة في الاستدعاء التالي
  } // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  return appPromise; // إرجاع النتيجة بعد اكتمال التحقق المطلوب
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
function safeBody(injected: { rawPayload: Buffer | string }): BodyInit { // تحويل حمولة fastify إلى جسم Response دون فقدان بايتات
  const raw = injected.rawPayload; // قراءة البايتات الخام كما أعادها الخادم
  if (Buffer.isBuffer(raw)) return new Uint8Array(raw); // إرجاع نتيجة محسوبة مع دعم جميع أنواع المحتوى
  return String(raw); // إرجاع نتيجة محسوبة مع دعم النصوص الصريحة
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
async function handle(request: NextRequest): Promise<Response> { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  let app: FastifyInstance; // تعريف قيمة محلية واضحة النوع لهذا المسار
  try { app = await getApp(); } catch { return Response.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'تعذر إكمال الطلب بسبب خطأ داخلي.' } }, { status: notReadyStatus }); } // إرجاع خطأ آمن دون كشف تفاصيل الاتصال
  const url = new URL(request.url); // تعريف قيمة محلية واضحة النوع لهذا المسار
  const headers: Record<string, string> = {}; // تعريف قيمة محلية واضحة النوع لهذا المسار
  request.headers.forEach((value, key) => { const name = key.toLowerCase(); if (!hopByHop.has(name)) headers[name] = value; }); // تمرير الرؤوس الآمنة فقط
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD'; // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  const body = hasBody ? await request.text() : ''; // تعريف قيمة محلية واضحة النوع لهذا المسار
  const injected = await app.inject({ method: request.method, url: `${url.pathname}${url.search}`, headers, ...(body ? { payload: body } : {}) }); // تنفيذ الطلب داخل الخادم دون شبكة خارجية
  const responseHeaders = new Headers(); // تعريف قيمة محلية واضحة النوع لهذا المسار
  for (const [key, value] of Object.entries(injected.headers)) { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    const name = key.toLowerCase(); // تعريف قيمة محلية واضحة النوع لهذا المسار
    if (hopByHop.has(name)) continue; // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
    if (typeof value === 'string') responseHeaders.set(name, value); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
    else if (Array.isArray(value)) responseHeaders.set(name, value.join(', ')); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  } // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  return new Response(safeBody(injected), { status: injected.statusCode, headers: responseHeaders }); // إرجاع نتيجة محسوبة مع الحفاظ على رمز الحالة والحمولة
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE, handle as HEAD }; // إتاحة بقية الطرق عبر نفس المسار
