import fp from 'fastify-plugin'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import type { PrismaClient } from '@prisma/client'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { createPrisma } from '../lib/prisma.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
interface Options { databaseUrl: string; client?: PrismaClient; } // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
declare module 'fastify' { interface FastifyInstance { prisma: PrismaClient; } } // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
export default fp<Options>(async (app, options) => { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  const client = options.client ?? createPrisma(options.databaseUrl); // تعريف قيمة محلية واضحة النوع لهذا المسار
  try { await client.$connect(); } catch (error) { if (!options.client) await client.$disconnect(); throw error; } // تحرير العميل المملوك للتطبيق حتى عند فشل الاتصال الأولي
  app.decorate('prisma', client); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  app.addHook('onClose', async () => { if (!options.client) await client.$disconnect(); }); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
}, { name: 'prisma' }); // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
