import type { PrismaClient } from '@prisma/client'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
export const employeeIds = ['11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-222222222222', '11111111-1111-4111-8111-333333333333'] as const; // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
export const equipmentIds = ['22222222-2222-4222-8222-111111111111', '22222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-333333333333'] as const; // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
export async function seedData(db: PrismaClient): Promise<void> { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  const employees = employeeIds.map((id, i) => ({ id, name: ['أحمد', 'ليلى', 'سالم'][i] ?? 'موظف' })); // تعريف قيمة محلية واضحة النوع لهذا المسار
  const equipment = equipmentIds.map((id, i) => ({ id, name: ['شاشة', 'جهاز عرض', 'محول'][i] ?? 'معدات', totalQuantity: [2, 1, 0][i] ?? 0, availableQuantity: [2, 1, 0][i] ?? 0 })); // تعريف قيمة محلية واضحة النوع لهذا المسار
  await db.$transaction(async (tx) => { // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
    for (const item of employees) await tx.employee.upsert({ where: { id: item.id }, create: item, update: {} }); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
    for (const item of equipment) { // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
      const existing = await tx.equipment.findUnique({ where: { id: item.id } }); // تعريف قيمة محلية واضحة النوع لهذا المسار
      if (existing && existing.totalQuantity !== item.totalQuantity) throw new Error('بيانات المعدات الأولية لا تطابق الإجمالي الموجود؛ لا تعديل تلقائي'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
      await tx.equipment.upsert({ where: { id: item.id }, create: item, update: {} }); // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
    } // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
  }); // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
