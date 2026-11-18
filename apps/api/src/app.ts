import Fastify from 'fastify'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import type { PrismaClient } from '@prisma/client'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import type { Env } from './config/env.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import prismaPlugin from './plugins/prisma.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { registerErrorHandler } from './plugins/error-handler.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { registerRoutes } from './routes/index.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
export async function buildApp(env: Env, client?: PrismaClient) { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  const app = Fastify({ logger: env.nodeEnv !== 'test', ajv: { customOptions: { removeAdditional: false, coerceTypes: false, useDefaults: false } } }); // تعريف قيمة محلية واضحة النوع لهذا المسار
  registerErrorHandler(app); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  try { // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
    await app.register(prismaPlugin, { databaseUrl: env.databaseUrl, ...(client ? { client } : {}) }); // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
    await registerRoutes(app); // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
    await app.ready(); // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
    return app; // إرجاع النتيجة بعد اكتمال التحقق المطلوب
  } catch (error) { await app.close(); throw error; } // إيقاف المسار الفاشل دون تحويله إلى نتيجة نجاح
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
