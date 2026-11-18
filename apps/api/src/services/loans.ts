import { randomUUID } from 'node:crypto'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { Prisma, type PrismaClient, type Equipment } from '@prisma/client'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { DomainError } from '../lib/errors.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
export interface TransactionHooks { beforeLock?: () => Promise<void>; afterLock?: () => Promise<void>; afterBorrowStock?: () => Promise<void>; afterReturnLoan?: () => Promise<void>; } // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
async function employeeExists(tx: Prisma.TransactionClient, employeeId: string): Promise<void> { // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  if (!await tx.employee.findUnique({ where: { id: employeeId }, select: { id: true } })) throw new DomainError('EMPLOYEE_NOT_FOUND', 404); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
async function lockEquipment(tx: Prisma.TransactionClient, equipmentId: string, hooks: TransactionHooks, requiredByLoan = false): Promise<Equipment> { // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  await hooks.beforeLock?.(); // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
  const rows = await tx.$queryRaw<Equipment[]>`SELECT * FROM "Equipment" WHERE "id" = ${equipmentId}::uuid FOR UPDATE`; // قفل صف النوع بقيم مربوطة لمنع تنافس الاستعارة والإرجاع على المخزون
  const equipment = rows[0]; // تعريف قيمة محلية واضحة النوع لهذا المسار
  if (!equipment) throw new DomainError(requiredByLoan ? 'INTERNAL_SERVER_ERROR' : 'EQUIPMENT_NOT_FOUND', requiredByLoan ? 500 : 404); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  await hooks.afterLock?.(); // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
  return equipment; // إرجاع النتيجة بعد اكتمال التحقق المطلوب
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
export async function borrow(db: PrismaClient, employeeId: string, equipmentId: string, hooks: TransactionHooks = {}) { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  return db.$transaction(async (tx) => { // إرجاع النتيجة بعد اكتمال التحقق المطلوب
    await employeeExists(tx, employeeId); // التحقق من الموظف داخل المعاملة قبل الوصول إلى حالة الاستعارة
    const equipment = await lockEquipment(tx, equipmentId, hooks); // تعريف قيمة محلية واضحة النوع لهذا المسار
    if (await tx.loan.findFirst({ where: { employeeId, equipmentId, returnedAt: null } })) throw new DomainError('ALREADY_BORROWED', 409); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
    if (equipment.availableQuantity === 0) throw new DomainError('OUT_OF_STOCK', 409); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
    await tx.equipment.update({ where: { id: equipmentId }, data: { availableQuantity: { decrement: 1 } } }); // خصم وحدة واحدة تحت القفل وإرجاع الخصم تلقائيًا إذا فشل إنشاء السجل
    await hooks.afterBorrowStock?.(); // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
    return tx.loan.create({ data: { id: randomUUID(), employeeId, equipmentId, borrowedAt: new Date() } }); // إرجاع النتيجة بعد اكتمال التحقق المطلوب
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, timeout: 10000 }); // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
export async function returnLoan(db: PrismaClient, employeeId: string, loanId: string, hooks: TransactionHooks = {}) { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  return db.$transaction(async (tx) => { // إرجاع النتيجة بعد اكتمال التحقق المطلوب
    await employeeExists(tx, employeeId); // التحقق من الموظف داخل المعاملة قبل الوصول إلى حالة الاستعارة
    const initial = await tx.loan.findUnique({ where: { id: loanId } }); // تعريف قيمة محلية واضحة النوع لهذا المسار
    if (!initial || initial.employeeId !== employeeId) throw new DomainError('LOAN_NOT_FOUND', 404); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
    await lockEquipment(tx, initial.equipmentId, hooks, true); // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
    const current = await tx.loan.findUnique({ where: { id: loanId } }); // تعريف قيمة محلية واضحة النوع لهذا المسار
    if (!current || current.employeeId !== employeeId) throw new DomainError('LOAN_NOT_FOUND', 404); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
    if (current.returnedAt !== null) throw new DomainError('ALREADY_RETURNED', 409); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
    const changed = await tx.loan.updateMany({ where: { id: loanId, employeeId, returnedAt: null }, data: { returnedAt: new Date() } }); // تعريف قيمة محلية واضحة النوع لهذا المسار
    if (changed.count !== 1) throw new DomainError('ALREADY_RETURNED', 409); // منع زيادة المخزون إن لم يتغير سجل نشط واحد بالضبط
    await hooks.afterReturnLoan?.(); // تنفيذ العملية وانتظار نتيجتها قبل متابعة الخطوات
    await tx.equipment.update({ where: { id: current.equipmentId }, data: { availableQuantity: { increment: 1 } } }); // إعادة وحدة واحدة في المعاملة نفسها بعد الانتقال الناجح من نشط إلى مرتجع
    return tx.loan.findUniqueOrThrow({ where: { id: loanId } }); // إرجاع النتيجة بعد اكتمال التحقق المطلوب
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, timeout: 10000 }); // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
