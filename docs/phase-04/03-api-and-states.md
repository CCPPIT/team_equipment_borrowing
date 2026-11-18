# API والحالات ومنع السباقات
| الطلب | العقد الفعلي |
|---|---|
| GET /api/employees | data.employees |
| GET /api/equipment?employeeId=UUID | data.employeeId وdata.equipment |
| POST /api/loans | body: employeeId وequipmentId؛ data.loan |
| POST /api/loans/:loanId/return | body: employeeId فقط؛ data.loan |

يتحقق العميل من success وUUID والأعداد الصحيحة وحدود المتاح والتواريخ وبنية activeLoan وهوية الموظف/المعدة/الاستعارة في الرد. مهلة 15 ثانية، no-store، رسائل عربية آمنة؛ لا يعرض رسائل backend الخام أو HTML الوكيل.

## انتقالات
1. تحميل الموظفين، ثم انتظار الاختيار؛ لا جلب معدات قبله.
2. اختيار صالح ← تحميل المعدات ← ready/empty/error مع Retry.
3. لا مخزون ← زر استعارة معطل. activeLoan ← إرجاع مسموح ولو المتاح صفر.
4. نقرة ← قفل ref متزامن + pending؛ تعطيل المحدد وجميع mutations حتى انتهاء refresh. لا optimistic inventory.
5. نجاح POST ← رسالة نجاح وGET إلزامي. فشل GET لا يتحول إلى ادعاء فشل العملية: رسالة نجاح مع تعذر تحديث وحظر الإجراءات حتى قراءة سليمة.
6. تعارض أو خطأ ← إظهار رمز آمن ثم GET. انقطاع/timeout/500/رد غير صالح يعني نتيجة غير مؤكدة، وليس rollback مثبتًا. لا إعادة POST تلقائية ولا نصيحة تكراره عميانيًا.
7. فشل المصالحة يبقي mutations معطلة؛ إعادة تحميل المعدات تعيد الأهلية بعد GET مطابق فقط.

AbortController + عداد إصدار + هوية الموظف + mounted يمنعون تأثير رد الموظف القديم. snapshotEmployee يبطل أهلية الإجراءات فور تغيير الاختيار أو بدء القراءة، حتى قبل إعادة رسم React. لا تختار موظفًا تلقائيًا. تحديث قائمة الموظفين أداة قراءة فقط؛ إذا اختفى المختار يسقط سياقه والمعدات القديمة ويطلب اختيارًا جديدًا.

الأخطاء المعروفة: VALIDATION_ERROR، EMPLOYEE_NOT_FOUND، EQUIPMENT_NOT_FOUND، LOAN_NOT_FOUND، OUT_OF_STOCK، ALREADY_BORROWED، ALREADY_RETURNED، TRANSACTION_CONFLICT، INTERNAL_SERVER_ERROR؛ العميل يضيف NETWORK_ERROR وTIMEOUT_ERROR وINVALID_RESPONSE. تحديث معدات/موظفين يدوي متاح، دون polling أو إدارة كيانات.
