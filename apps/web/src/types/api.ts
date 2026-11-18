export interface Employee { id: string; name: string; } // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
export interface ActiveLoan { id: string; borrowedAt: string; } // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
export interface Equipment { id: string; name: string; description: string | null; totalQuantity: number; availableQuantity: number; activeLoan: ActiveLoan | null; } // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
export interface Loan { id: string; employeeId: string; equipmentId: string; borrowedAt: string; returnedAt: string | null; } // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
export interface EquipmentData { employeeId: string; equipment: Equipment[]; } // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
