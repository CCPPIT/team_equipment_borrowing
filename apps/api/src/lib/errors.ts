export type ErrorCode = 'VALIDATION_ERROR' | 'EMPLOYEE_NOT_FOUND' | 'EQUIPMENT_NOT_FOUND' | 'LOAN_NOT_FOUND' | 'ALREADY_BORROWED' | 'OUT_OF_STOCK' | 'ALREADY_RETURNED' | 'TRANSACTION_CONFLICT' | 'INTERNAL_SERVER_ERROR' | 'ROUTE_NOT_FOUND'; // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
const messages: Record<ErrorCode, string> = { // تعريف قيمة محلية واضحة النوع لهذا المسار
  VALIDATION_ERROR: 'مدخلات الطلب غير صالحة.', EMPLOYEE_NOT_FOUND: 'الموظف غير موجود.', EQUIPMENT_NOT_FOUND: 'نوع المعدات غير موجود.', // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  LOAN_NOT_FOUND: 'الاستعارة غير موجودة للموظف المحدد.', ALREADY_BORROWED: 'توجد استعارة نشطة لهذا النوع.', OUT_OF_STOCK: 'لا توجد وحدات متاحة من هذا النوع.', // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  ALREADY_RETURNED: 'أُرجعت هذه الاستعارة مسبقًا.', TRANSACTION_CONFLICT: 'تعارضت المعاملة؛ حدّث البيانات قبل المحاولة مجددًا.', // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  INTERNAL_SERVER_ERROR: 'تعذر إكمال الطلب بسبب خطأ داخلي.', ROUTE_NOT_FOUND: 'المسار غير موجود.', // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
}; // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
export class DomainError extends Error { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  constructor(public readonly code: ErrorCode, public readonly status: number) { super(messages[code]); this.name = 'DomainError'; } // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
function record(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; } // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
export function classifyError(error: unknown, depth = 0): DomainError { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  if (error instanceof DomainError) return error; // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  if (depth > 6 || !record(error)) return new DomainError('INTERNAL_SERVER_ERROR', 500); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  if (error.code === 'P2034' || error.code === '40001' || error.code === '40P01' || error.sqlState === '40001' || error.sqlState === '40P01') return new DomainError('TRANSACTION_CONFLICT', 409); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  const meta = record(error.meta) ? error.meta : {}; // تعريف قيمة محلية واضحة النوع لهذا المسار
  const target = meta.target; // تعريف قيمة محلية واضحة النوع لهذا المسار
  const knownTarget = target === 'unique_active_loan_per_employee_equipment' || (Array.isArray(target) && target.length === 2 && target.includes('employeeId') && target.includes('equipmentId')); // تعريف قيمة محلية واضحة النوع لهذا المسار
  if ((error.code === 'P2002' && knownTarget) || (error.code === '23505' && error.constraint === 'unique_active_loan_per_employee_equipment')) return new DomainError('ALREADY_BORROWED', 409); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  for (const value of [error.cause, meta.driverAdapterError, error.originalCause]) { // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
    const nested = classifyError(value, depth + 1); // تعريف قيمة محلية واضحة النوع لهذا المسار
    if (nested.status !== 500) return nested; // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  } // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
  if (record(error.constraint) && error.constraint.index === 'unique_active_loan_per_employee_equipment') return new DomainError('ALREADY_BORROWED', 409); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  return new DomainError('INTERNAL_SERVER_ERROR', 500); // إرجاع النتيجة بعد اكتمال التحقق المطلوب
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
