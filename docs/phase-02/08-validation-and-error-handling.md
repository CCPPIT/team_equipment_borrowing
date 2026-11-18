# 08 — التحقق ومعالجة الأخطاء

| الطبقة | التحقق | حدود الثقة |
|---|---|---|
| Frontend | اختيار موظف، منع pending، eligibility للعرض فقط | UX؛ يمكن تجاوزها بطلب مباشر |
| Fastify Request Schema | body/query/path، UUID، required، additionalProperties=false؛ منع إزالة unknown properties بصمت | شرط بنيوي قبل الخدمة؛ لا DB داخل validator |
| Service داخل transaction | وجود Employee/Equipment/Loan، مطابقة الموظف، النشط، stock، إعادة التحقق بعد القفل | مرجع قواعد العمل |
| PostgreSQL | PK/FK/NOT NULL/CHECK/partial unique | قيد أخير حتى مع خطأ في التطبيق؛ لا يضمن وحده invariant بين جدولين |

## مسار الأخطاء الموحد
DomainError داخلي يملك code/status آمنين. الخدمة ترمي الخطأ ولا تبتلعه داخل transaction. معالج Fastify مركزي يطبع envelope الوثيقة 06. أي exception غير معروف ينتج 500 برسالة عامة. يصنف NotFound handler والمسارات ورسائل validation ضمن النمط نفسه. لا نقل لرسائل SQL أو Prisma أو connection string إلى العميل.

| الحالة | mapping |
|---|---|
| Invalid Employee / Equipment / Loan صياغيًا | 400 VALIDATION_ERROR |
| Employee غير موجود | 404 EMPLOYEE_NOT_FOUND |
| Equipment غير موجود | 404 EQUIPMENT_NOT_FOUND |
| Loan غائب أو موظف غير مطابق | 404 LOAN_NOT_FOUND |
| Out of Stock | 409 OUT_OF_STOCK |
| Already Borrowed | 409 ALREADY_BORROWED |
| Already Returned | 409 ALREADY_RETURNED |
| unique_active_loan_per_employee_equipment | rollback ثم 409 ALREADY_BORROWED |
| Unique violation آخر غير متوقع | rollback ثم 500؛ ليس كل unique=already borrowed |
| FK/CHECK غير متوقع | rollback ثم 500 مع log آمن؛ لا تحديث تعويضي يدوي خارج المعاملة |
| deadlock أو serialization abort مؤكد | 409 TRANSACTION_CONFLICT بعد rollback |
| Unexpected Server Error / اتصال غامض | 500 عام؛ العميل يعيد الجلب ولا يفترض عدم commit |

## Prisma والأكواد
مع عائلة Prisma v7 قد يظهر unique المعروف كـP2002 وتعارض معاملة كـP2034، لكن raw SQL/driver قد يعيد SQLSTATE مثل 23505 أو 40001 أو 40P01 ضمن cause/meta. يلزم اختبار mapping مع **الإصدار المختار فعليًا** بدل الاعتماد على رسالة نصية أو افتراض أن P2002 يغطي كل استعلام. target/constraint المعروف يجب أن يطابق الفهرس النشط؛ إذا لم يمكن التحديد الموثوق يعامل الخطأ كداخلي بدل رد عمل مضلل. لا كشف هذه التفاصيل للواجهة.

logging يستخدم Fastify logger لتسجيل request id وفئة الخطأ داخليًا دون body حساس أو URL قاعدة أو stack في response. لا إضافة monitoring service. اختيار الموظف ليس auth؛ مطابقة الاستعارة إجراء اتساق. لا RBAC أو تسجيل دخول.

قاعدة الفشل: الخطأ المثبت أنه أجهض transaction لا يترك كتابة جزئية. فقد استجابة commit لا يثبت أن العملية أُجهضت؛ contract لا يعد بـexactly-once عبر الشبكة ولا يضيف بنية idempotency غير مطلوبة.
