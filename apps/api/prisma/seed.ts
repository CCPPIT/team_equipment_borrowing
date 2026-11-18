import { createPrisma } from '../src/lib/prisma.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { loadEnv } from '../src/config/env.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { seedData } from '../src/services/seed-data.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
const db = createPrisma(loadEnv().databaseUrl); // تعريف قيمة محلية واضحة النوع لهذا المسار
try { await seedData(db); console.log('اكتملت البيانات الأولية دون إعادة ضبط المخزون أو التاريخ.'); } // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
catch { console.error('تعذر إدخال البيانات الأولية؛ تحقق من الإعداد والتوافق دون مشاركة الأسرار.'); process.exitCode = 1; } // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
finally { await db.$disconnect(); } // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
