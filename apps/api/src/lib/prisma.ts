import { PrismaClient } from '@prisma/client'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { PrismaPg } from '@prisma/adapter-pg'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
export function createPrisma(databaseUrl: string): PrismaClient { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl, max: 8 }) }); // إرجاع النتيجة بعد اكتمال التحقق المطلوب
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
