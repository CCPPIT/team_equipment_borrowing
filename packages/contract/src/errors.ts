// أكواد أخطاء العقد المشتركة؛ مطابقة حقلي `code` في مغلف الفشل ورسائل الخادم ولا تُعدّل قيمًا دون رفع إصدار العقد
export type ErrorCode = 'VALIDATION_ERROR' | 'EMPLOYEE_NOT_FOUND' | 'EQUIPMENT_NOT_FOUND' | 'LOAN_NOT_FOUND' | 'ALREADY_BORROWED' | 'OUT_OF_STOCK' | 'ALREADY_RETURNED' | 'TRANSACTION_CONFLICT' | 'INTERNAL_SERVER_ERROR' | 'ROUTE_NOT_FOUND' | 'UNSUPPORTED_MEDIA_TYPE'; // اتحاد الأكواد التي قد تصدرها الخلفية على السلك
// نصوص عربية ثابتة لكل رمز؛ يستخدمها DomainError في منطق المجال ويعيد استخدامها أي عميل يريد اقتراحًا افتراضيًا للرسالة
export const ERROR_MESSAGES: Record<ErrorCode, string> = { // سجل شامل لا يقبل رمزًا مفقودًا عند التوسيع
  VALIDATION_ERROR: 'مدخلات الطلب غير صالحة.', // فشل تحقق المدخلات أو صيغة JSON
  EMPLOYEE_NOT_FOUND: 'الموظف غير موجود.', // المعرف لا يطابق موظفًا في القاعدة
  EQUIPMENT_NOT_FOUND: 'نوع المعدات غير موجود.', // المعرف لا يطابق نوع معدات في القاعدة
  LOAN_NOT_FOUND: 'الاستعارة غير موجودة للموظف المحدد.', // لا توجد استعارة بهذا المعرف لهذا الموظف
  ALREADY_BORROWED: 'توجد استعارة نشطة لهذا النوع.', // قيد الاستعارة النشطة الواحدة لكل نوع لكل موظف
  OUT_OF_STOCK: 'لا توجد وحدات متاحة من هذا النوع.', // الرصيد المتاح صفر وقت القفل
  ALREADY_RETURNED: 'أُرجعت هذه الاستعارة مسبقًا.', // محاولة إرجاع مكررة لسجل مرتجع
  TRANSACTION_CONFLICT: 'تعارضت المعاملة؛ حدّث البيانات قبل المحاولة مجددًا.', // أخطاء عزل/تزاحم (P2034 و40001 و40P01)
  INTERNAL_SERVER_ERROR: 'تعذر إكمال الطلب بسبب خطأ داخلي.', // أي فشل غير مصنف دون كشف تفاصيل داخلية
  ROUTE_NOT_FOUND: 'المسار غير موجود.', // لا يوجد مسار مطابق في الخادم
  UNSUPPORTED_MEDIA_TYPE: 'نوع المحتوى غير مدعوم.', // الطلب لا يحمل Content-Type من نوع application/json
}; // إغلاق السجل بعد إكمال المسؤولية المحددة
