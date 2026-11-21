// أنواع DTO المشتركة في كلٍّ من الخادم وواجهة العرض؛ حقول التواريخ كلها نصوص ISO بصيغة JSON ولا تحمل كائنات Date
export interface Employee { id: string; name: string; } // موظف قابل للاختيار من القائمة دون أي بيانات اعتماد
export interface ActiveLoan { id: string; borrowedAt: string; } // استعارة نشطة مضمّنة داخل عنصر المعدات لموظف بعينه
export interface Equipment { id: string; name: string; description: string | null; totalQuantity: number; availableQuantity: number; activeLoan: ActiveLoan | null; } // نوع معدات بإجماليه وتصريف المتاح واستعارة الموظف النشطة
export interface EquipmentData { employeeId: string; equipment: Equipment[]; } // حمولة استجابة قائمة المعدات لموظف محدد
export interface Loan { id: string; employeeId: string; equipmentId: string; borrowedAt: string; returnedAt: string | null; } // سجل استعارة كامل يبقى محفوظًا بعد الإرجاع
