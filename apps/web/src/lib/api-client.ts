import type { Employee, Equipment, EquipmentData, Loan, ActiveLoan, ErrorCode } from '@team/contract'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
type ClientErrorCode = ErrorCode | 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'INVALID_RESPONSE' | 'ABORTED'; // أكواد إضافية يولّدها العميل فوق رموز العقد المشتركة
const messages: Record<ClientErrorCode, string> = { // سجل شامل لكل رمز؛ التوسعة دون رسالة تُفشل الترجمة مباشرة
  OUT_OF_STOCK: 'لم تعد هناك وحدات متاحة. تم طلب تحديث المخزون.', ALREADY_BORROWED: 'لديك استعارة نشطة من هذا النوع. راجع الحالة المحدّثة.', // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  ALREADY_RETURNED: 'أُرجعت هذه الاستعارة من قبل. راجع الحالة المحدّثة.', LOAN_NOT_FOUND: 'لم تعد هذه الاستعارة متاحة للموظف المحدد.', // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  EMPLOYEE_NOT_FOUND: 'الموظف المحدد غير موجود. حدّث قائمة الموظفين واختر من جديد.', EQUIPMENT_NOT_FOUND: 'نوع المعدات لم يعد موجودًا. حدّث القائمة.', // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  VALIDATION_ERROR: 'تعذر قبول الطلب. تحقق من الموظف والمعدات المحددة.', INTERNAL_SERVER_ERROR: 'تعذر تأكيد العملية بسبب خطأ في الخادم.', // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  TRANSACTION_CONFLICT: 'تعارض الطلب مع عملية أخرى. راجع الحالة قبل المحاولة مجددًا.', NETWORK_ERROR: 'تعذر الاتصال بالخادم. تحقق من الاتصال وأعد تحميل الحالة.', // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  TIMEOUT_ERROR: 'استغرق الاتصال وقتًا أطول من المتوقع. حدّث الحالة قبل المحاولة مجددًا.', INVALID_RESPONSE: 'وصلت استجابة غير متوقعة. حدّث الحالة للتحقق من النتيجة.', // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  ABORTED: 'أُلغي تحميل البيانات.', ROUTE_NOT_FOUND: 'المسار غير موجود على خادم المعدات.', UNSUPPORTED_MEDIA_TYPE: 'نوع المحتوى غير مدعوم.', // إكمال رموز العقد المشتركة حتى يبقى السجل مطابقًا تمامًا
}; // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export class ApiError extends Error { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  constructor(public readonly code: string, public readonly status = 0) { super((messages as Record<string, string>)[code] ?? 'تعذر إكمال الطلب. يرجى تحديث البيانات والمحاولة مجددًا.'); this.name = 'ApiError'; } // قراءة آمنة لرمز قادم من السلك غير الموثوق مع بقاء اكتمال السجل مفروضًا بالترجمة
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
function record(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); } // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
export function uuid(value: unknown): value is string { return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value); } // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
function date(value: unknown): value is string { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value)); } // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
function employee(value: unknown): value is Employee { return record(value) && uuid(value.id) && typeof value.name === 'string'; } // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
function active(value: unknown): value is ActiveLoan { return record(value) && uuid(value.id) && date(value.borrowedAt); } // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
function equipment(value: unknown): value is Equipment { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  if (!record(value) || !uuid(value.id) || typeof value.name !== 'string' || !(value.description === null || typeof value.description === 'string')) return false; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
  if (typeof value.totalQuantity !== 'number' || typeof value.availableQuantity !== 'number' || !Number.isInteger(value.totalQuantity) || !Number.isInteger(value.availableQuantity)) return false; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
  return value.totalQuantity >= 0 && value.availableQuantity >= 0 && value.availableQuantity <= value.totalQuantity && (value.activeLoan === null || active(value.activeLoan)); // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
function loan(value: unknown): value is Loan { return record(value) && uuid(value.id) && uuid(value.employeeId) && uuid(value.equipmentId) && date(value.borrowedAt) && (value.returnedAt === null || date(value.returnedAt)); } // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
function invalid(): never { throw new ApiError('INVALID_RESPONSE'); } // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
async function request<T>(path: string, decode: (data: unknown) => T, init: RequestInit = {}, timeoutMs = 15000): Promise<T> { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const controller = new AbortController(); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  let timedOut = false; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const cancel = () => controller.abort(); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  init.signal?.addEventListener('abort', cancel, { once: true }); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  if (init.signal?.aborted) controller.abort(); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  try { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    const response = await fetch(`/api${path}`, { ...init, signal: controller.signal, cache: 'no-store' }); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    let payload: unknown; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    try { payload = await response.json(); } catch { throw new ApiError(response.status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'INVALID_RESPONSE', response.status); } // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    if (!record(payload)) return invalid(); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    if (!response.ok) { // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
      const code = record(payload.error) && typeof payload.error.code === 'string' ? payload.error.code : response.status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'INVALID_RESPONSE'; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      throw new ApiError(code, response.status); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    } // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
    if (payload.success !== true || !('data' in payload)) return invalid(); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    return decode(payload.data); // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
  } catch (error) { // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
    if (error instanceof ApiError) throw error; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    throw new ApiError(timedOut ? 'TIMEOUT_ERROR' : init.signal?.aborted ? 'ABORTED' : 'NETWORK_ERROR'); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  } finally { // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
    clearTimeout(timer); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    init.signal?.removeEventListener('abort', cancel); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  } // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export const api = { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  employees(signal?: AbortSignal): Promise<Employee[]> { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    return request('/employees', (data) => { if (!record(data) || !Array.isArray(data.employees) || !data.employees.every(employee)) return invalid(); return data.employees; }, { signal }); // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
  }, // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  equipment(employeeId: string, signal?: AbortSignal): Promise<EquipmentData> { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    if (!uuid(employeeId)) return Promise.reject(new ApiError('VALIDATION_ERROR', 400)); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    return request(`/equipment?employeeId=${encodeURIComponent(employeeId)}`, (data) => { // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
      if (!record(data) || data.employeeId !== employeeId || !Array.isArray(data.equipment) || !data.equipment.every(equipment)) return invalid(); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
      return { employeeId, equipment: data.equipment }; // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
    }, { signal }); // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  }, // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  borrow(employeeId: string, equipmentId: string): Promise<Loan> { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    if (!uuid(employeeId) || !uuid(equipmentId)) return Promise.reject(new ApiError('VALIDATION_ERROR', 400)); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    return request('/loans', (data) => { if (!record(data) || !loan(data.loan) || data.loan.employeeId !== employeeId || data.loan.equipmentId !== equipmentId || data.loan.returnedAt !== null) return invalid(); return data.loan; }, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeId, equipmentId }) }); // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
  }, // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  returnLoan(employeeId: string, loanId: string): Promise<Loan> { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    if (!uuid(employeeId) || !uuid(loanId)) return Promise.reject(new ApiError('VALIDATION_ERROR', 400)); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    return request(`/loans/${encodeURIComponent(loanId)}/return`, (data) => { if (!record(data) || !loan(data.loan) || data.loan.id !== loanId || data.loan.employeeId !== employeeId || data.loan.returnedAt === null) return invalid(); return data.loan; }, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeId }) }); // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
  }, // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
}; // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export function asApiError(error: unknown): ApiError { return error instanceof ApiError ? error : new ApiError('NETWORK_ERROR'); } // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
export function uncertain(error: ApiError): boolean { return error.status >= 500 || ['NETWORK_ERROR', 'TIMEOUT_ERROR', 'INVALID_RESPONSE', 'INTERNAL_SERVER_ERROR'].includes(error.code); } // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
