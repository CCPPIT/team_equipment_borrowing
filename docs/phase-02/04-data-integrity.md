# 04 — سلامة البيانات والقيود

## القيود المخططة
| القيد | أين وكيف | ما يمنعه |
|---|---|---|
| Primary keys | UUID لكل كيان، NOT NULL وunique | غياب/تكرار الهوية |
| Foreign keys | Loan.employeeId → Employee.id وLoan.equipmentId → Equipment.id؛ Restrict للحذف والتحديث | orphan records وفقد التاريخ بالحذف المتسلسل |
| NOT NULL | جميع الحقول عدا description وreturnedAt | سجلات ناقصة |
| eq_total_nonnegative | CHECK totalQuantity >= 0 | إجمالي سالب |
| eq_available_bounds | CHECK availableQuantity >= 0 AND availableQuantity <= totalQuantity | رصيد سالب أو أكبر من الإجمالي |
| unique_active_loan_per_employee_equipment | UNIQUE(employeeId,equipmentId) WHERE returnedAt IS NULL | نشط مكرر مع السماح بمكتملين كثيرين |
| idx_loan_equipment | index Loan(equipmentId) | قراءة وفحص العلاقات حسب النوع |
| PK employeeId lookup / active pair index | PK Employee وindex الزوج النشط | التحقق والبحث عن نشط للموظف؛ لا فهارس تخمينية إضافية |

لا unique على name أو employeeId وحده، ولا unique عام على الزوج. لا نضيف trigger أو check عبر جداول لحساب المتاح؛ CHECK الصف لا يثبت تطابق العدد مع count loans. قاعدة «available + active = total» تضمنها الخدمات بمعاملة موحدة ومنع مسارات تعديل إضافية، وتُختبر بالمصالحة؛ لا ادعاء أن CHECK وحده يحميها من SQL إداري خارج النظام.

## مثال SQL تصميمي فقط — لم يُنفذ
كل سطر SQL يحمل شرحًا عربيًا؛ القيود لا تُنشأ فعليًا هنا.
```sql
ALTER TABLE "Equipment" ADD CONSTRAINT eq_total_nonnegative CHECK ("totalQuantity" >= 0); -- منع الإجمالي السالب
ALTER TABLE "Equipment" ADD CONSTRAINT eq_available_bounds CHECK ("availableQuantity" >= 0 AND "availableQuantity" <= "totalQuantity"); -- حصر المتاح بين الصفر والإجمالي
CREATE UNIQUE INDEX unique_active_loan_per_employee_equipment ON "Loan" ("employeeId", "equipmentId") WHERE "returnedAt" IS NULL; -- فرض فرادة النشط دون منع التاريخ
CREATE INDEX idx_loan_equipment ON "Loan" ("equipmentId"); -- دعم القراءة حسب نوع المعدات
```

## توافق Prisma Migrate وخطة إدارة القيود
لا إصدار Prisma مثبت في المشروع. المراجع الرسمية المفحوصة تميز Prisma ORM v7 عن مسار ORM الأحدث؛ وثائق v7 الحالية تذكر دعم partial indexes في Schema Language عبر where، لذلك **ليس صحيحًا افتراض أنها دائمًا غير مدعومة**. المرجع: [وثائق ميزات قاعدة البيانات وترحيلاتها](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/unsupported-database-features).

قرارنا تصميم قاعدة PostgreSQL ثابت، وتمثيله في Prisma مرتبط بالإصدار المعتمد:
1. في المرحلة المصرح بها لاحقًا تُثبت نسخة Prisma/client متطابقة ويُراجع توثيقها المحدد. إن دعمت partial unique مباشرة ومستقرًا يُمثل مرة واحدة في schema مع الاسم نفسه.
2. عند عدم الدعم أو الحاجة لتخصيص، يُنشأ draft migration بطريقة create-only، ويُراجع migration.sql وتضاف القيود الناقصة قبل تطبيقه. لا يضاف الفهرس مرتين عبر schema وSQL.
3. CHECKs التي لا يمثلها الإصدار تُحفظ في SQL migration المخصص. ملفات migrations هي مصدر إعادة إنشاء القاعدة كاملة، وتدخل shadow database عند التطوير. لا db push بديلًا عن التاريخ، ولا حذف migration مطبق أو التلاعب به.
4. يُختبر replay على قاعدة اختبار نظيفة، وتُقرأ pg_indexes/pg_constraint للتحقق من predicate والأسماء والـFK/CHECK الفعلية. يُراجع أي diff لاحق حتى لا يسقط قيدًا مخصصًا دون قصد.
5. لا اعتماد نهائي لتوافق syntax أو drift أو introspection قبل هذا التحقق. دعم PostgreSQL النظري ليس إثباتًا لتوافق Prisma مثبت غير موجود.

قيد الفرادة المفعل يعيد تعارضًا؛ معالج الأخطاء يميز القيد المعروف من أخطاء غير متوقعة (الوثيقة 08). لا unique مركب مع returnedAt nullable بديلًا عن partial index؛ NULL behavior لن يفرض القاعدة المطلوبة.
