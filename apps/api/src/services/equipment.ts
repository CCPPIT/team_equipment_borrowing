import { Prisma, type PrismaClient } from '@prisma/client'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { DomainError } from '../lib/errors.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
export async function listEmployees(db: PrismaClient) { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  return db.employee.findMany({ select: { id: true, name: true }, orderBy: [{ name: 'asc' }, { id: 'asc' }] }); // إرجاع النتيجة بعد اكتمال التحقق المطلوب
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
export async function listEquipment(db: PrismaClient, employeeId: string) { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  return db.$transaction(async (tx) => { // إرجاع النتيجة بعد اكتمال التحقق المطلوب
    if (!await tx.employee.findUnique({ where: { id: employeeId }, select: { id: true } })) throw new DomainError('EMPLOYEE_NOT_FOUND', 404); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
    const equipment = await tx.equipment.findMany({ orderBy: [{ name: 'asc' }, { id: 'asc' }], include: { loans: { where: { employeeId, returnedAt: null }, select: { id: true, borrowedAt: true } } } }); // تعريف قيمة محلية واضحة النوع لهذا المسار
    return { employeeId, equipment: equipment.map(({ loans, createdAt: _createdAt, ...item }) => ({ ...item, activeLoan: loans[0] ?? null })) }; // إرجاع النتيجة بعد اكتمال التحقق المطلوب
  }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }); // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
