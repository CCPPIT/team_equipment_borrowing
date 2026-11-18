# 03 — دمج API والعقد الفعلي
| العملية | الطلب | النجاح والغلاف | رفض متحقق |
|---|---|---|---|
| GET /api/employees | بلا body |200 data.employees|قوائم فارغة صحيحة، فشل DB آمن |
| GET /api/equipment |employeeId query UUID|200 data.employeeId وdata.equipment|400/404؛ snapshot متسق |
| POST /api/loans |employeeId وequipmentId فقط|201 data.loan وreturnedAt=null|400 validation،404 موارد،409 duplicate/stock |
| POST /api/loans/:loanId/return |employeeId فقط|200 data.loan وreturnedAt timestamp|400 ID،404 سجل/موظف،409 already returned |

success=true/data للنجاح؛ success=false/error/code/message للخطأ، وfields اختياري للتحقق. الأوقات ISO وهوية Loan مستقلة لكل دورة. لا quantity أو endpoints جديدة. API health حيوية HTTP وليس readiness مضمونًا لقاعدة البيانات في كل طلب.

العميل الموجود يرسل Content-Type JSON ويستخدم `/api` النسبي، ويتحقق runtime من DTO وهوية الرد. اختبارات A–C فحصت أجسام الطلبات الفعلية والمخرجات وأكواد201/200. H01 تحقق من400 للـIDs/quantity وJSON المشوه،404 للموارد؛ D/E/F وG تثبت409. H04/H05 فشل500 فعلي آمن دون Prisma/SQL/رسالة trigger الخاصة. H10 خطأ مورد حقيقي يظهر عربيًا ورمزه في الواجهة ثم يختفي النوع بعد GET.

## تمثيل حالة الخادم في الواجهة
لا reload للصفحة عند borrow/return؛ A–C قاس طلب document واحد فقط عبر3 دورات. counts في البطاقة تطابق DB بعد كل خطوة. نشط محفوظ قبل فتح الصفحة يظهر لصاحبه، ولا يظهر لموظف آخر H09. loading عبر قراءة متأخرة حقيقية فيH12، pending عبر بوابة تأخير HTTP فيH07، وفراغ بيانات حقيقي فيH08. اختبارات المكونات44 تكمل حالات التحقق والنفاد وRetry.

## منع التكرار والردود القديمة
ref guard متزامن يمنع نقرتين في التكة نفسها. action pending يقفل الموظف والإجراءات حتى mutation+GET، ولا خصم محلي متفائل. Abort/version/employee identity يمنعون وصول ردA إلى سياقB؛ H12 استخدم response من API الحقيقي مع تأخير وصوله، لا payload مخترع.

## الفشل والتعافي المثبتان
| الحالة | الاختبار الفعلي | النتيجة |
|---|---|---|
| Backend غير متاح |H02 أغلق Fastify الاختباري وأعاده|رسالة مفهومة؛ لا تعديل DB؛ cleared pending وGET Retry بلا POST ثانٍ |
| DB غير متاحة للـAPI |H03 قطع sockets ووكيلTCP فقط|500 وفشل قراءة؛ DB المستقلة ثابتة؛ استعادة ثم Retry ناجح |
| insert بعد decrement يفشل |H04 trigger فعلي في DB الاختبار|rollback كامل و500 آمن، ثم نجاح بعد إزالة trigger |
| increment بعد returnedAt يفشل |H05 trigger فعلي|النشط والرصيد ثابتان ولا نجاح إرجاع كاذب |
| فقد الرد بعد commit |H06 route.fetch ينفذ POST الحقيقي ثم يسقط الرد|GET يكشف النشط؛ رسالة غموض بلا نجاح مصطنع أو إعادة POST |
| نجاح مع GET فاشل |H11 يُسقط GET وحده بعد201|يبقى نجاح العملية واضحًا مع warning، والإجراءات معطلة حتى قراءة مؤكدة |

وكيل الاختبار لا يوقف عنقود PostgreSQL المشترك، بل يجعل اتصال API الاختباري به غير متاح فعليًا. اختبارات routing لا تستبدل backend بردود نجاح mock؛ تستخدم التأخير أو الإلغاء فقط، والعمليات الناجحة في PostgreSQL حقيقية. فقد الرد المختبر ليس فصل شبكة مادية عشوائيًا ولا إثبات exactly-once في كل بيئة.
