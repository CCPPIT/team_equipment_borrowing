import type { PrismaClient } from '@prisma/client'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { SEED_EMPLOYEE_IDS, SEED_EQUIPMENT_IDS } from '@team/contract'; // معرّفات البذر الثابتة من العقد بدل تكرارها يدويًا
export const employeeIds = SEED_EMPLOYEE_IDS; // إعادة تصدير المعرفات للحفاظ على توافق المستهلكين (البذر والاختبارات)
export const equipmentIds = SEED_EQUIPMENT_IDS; // إعادة تصدير المعرفات للحفاظ على توافق المستهلكين (البذر والاختبارات)
export async function seedData(db: PrismaClient): Promise<void> { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  const employees = employeeIds.map((id, i) => ({ id, name: ['أحمد', 'ليلى', 'سالم'][i] ?? 'موظف' })); // تعريف قيمة محلية واضحة النوع لهذا المسار
  const equipment = equipmentIds.map((id, i) => ({ id, name: ['شاشة', 'جهاز عرض', 'محول'][i] ?? 'معدات', totalQuantity: [2, 1, 0][i] ?? 0, availableQuantity: [2, 1, 0][i] ?? 0 })); // تعريف قيمة محلية واضحة النوع لهذا المسار
  await db.$transaction(async (tx) => { // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
    for (const item of employees) await tx.employee.upsert({ where: { id: item.id }, create: item, update: {} }); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
    for (const item of equipment) { // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
      const existing = await tx.equipment.findUnique({ where: { id: item.id } }); // تعريف قيمة محلية واضحة النوع لهذا المسار
      if (existing && existing.totalQuantity !== item.totalQuantity) throw new Error('بيانات المعدات الأولية لا تطابق الإجمالي الموجود؛ لا تعديل تلقائي'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
      await tx.equipment.upsert({ where: { id: item.id }, create: item, update: {} }); // تنفيذ العملية وانتظار نتيجته قبل متابعة الخطوات
    } // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  }); // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
