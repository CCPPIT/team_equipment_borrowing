import { buildApp } from './app.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { loadEnv } from './config/env.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
try { // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
  const env = loadEnv(); // تعريف قيمة محلية واضحة النوع لهذا المسار
  const app = await buildApp(env); // تعريف قيمة محلية واضحة النوع لهذا المسار
  let stopping = false; // تعريف قيمة محلية واضحة النوع لهذا المسار
  const shutdown = async (): Promise<void> => { // تعريف قيمة محلية واضحة النوع لهذا المسار
    if (stopping) return; // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
    stopping = true; // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
    await app.close(); // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
  }; // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
  process.once('SIGINT', () => { void shutdown().catch(() => { process.exitCode = 1; }); }); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  process.once('SIGTERM', () => { void shutdown().catch(() => { process.exitCode = 1; }); }); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  try { await app.listen({ host: '0.0.0.0', port: env.apiPort }); } catch { await app.close(); throw new Error('تعذر الاستماع لمنفذ الخادم'); } // إيقاف المسار الفاشل دون تحويله إلى نتيجة نجاح
} catch { console.error('تعذر بدء الخادم؛ تحقق من إعداد البيئة وقاعدة البيانات دون مشاركة أسرار الاتصال.'); process.exitCode = 1; } // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
