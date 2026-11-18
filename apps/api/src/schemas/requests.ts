export interface EmployeeQuery { employeeId: string; } // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
export interface BorrowBody { employeeId: string; equipmentId: string; } // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
export interface ReturnParams { loanId: string; } // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
const id = { type: 'string', format: 'uuid', pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' } as const; // تعريف قيمة محلية واضحة النوع لهذا المسار
export const employeeQuery = { type: 'object', required: ['employeeId'], additionalProperties: false, properties: { employeeId: id } } as const; // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
export const borrowBody = { type: 'object', required: ['employeeId', 'equipmentId'], additionalProperties: false, properties: { employeeId: id, equipmentId: id } } as const; // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
export const returnParams = { type: 'object', required: ['loanId'], additionalProperties: false, properties: { loanId: id } } as const; // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
export const emptyQuery = { type: 'object', additionalProperties: false, properties: {} } as const; // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
