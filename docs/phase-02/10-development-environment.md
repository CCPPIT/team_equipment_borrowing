# 10 — تصميم البيئة والبيانات الأولية

## خط الأساس الفعلي مقابل المخطط
تدقيق Phase 01: Node v20.20.2 وnpm 10.8.2 وGit 2.47.3 متاحة؛ pnpm/Docker/PostgreSQL tools غير ظاهرة؛ لا Next/React/Fastify/TypeScript/Prisma/Vitest مثبتة بالمشروع. لم نعد فحص الإصدارات أو ندّع تحديثها في Phase 02. لا database connection أو توافق dependencies مثبت.

npm Workspaces مقترح لتجنب مدير غير متاح. قبل أي تثبيت مصرح به تُراجع requirements وengines للنسخ المختارة؛ لا نفترض صلاحية Node الحالي لكل إصدار. Next/React زوج متوافق، Prisma/client/adapter متطابقة حسب التوثيق، وTypeScript/Fastify/Vitest مختبرة مع runtime. exact versions وقرار توفير runtime متوافق عند الحاجة **OPEN-VERSION**؛ لا تغيير لأي إصدار الآن. أمثلة المعاملات تستند إلى وثائق Prisma ORM v7 صراحة؛ لا اعتماد تلقائي لأحدث major أو syntax من major آخر.

## تصميم متغيرات .env.example — جدول وليس ملفًا منفذًا
| المفتاح | قيمة توضيحية بلا سر حقيقي | المستهلك وطريقة الاستخدام |
|---|---|---|
| DATABASE_URL | postgresql://DEV_USER:CHANGE_ME@127.0.0.1:5432/team_equipment?schema=public | API وPrisma فقط؛ placeholders تُستبدل محليًا |
| TEST_DATABASE_URL | postgresql://TEST_USER:CHANGE_ME@127.0.0.1:5432/team_equipment_test?schema=public | اختبار مع تحقق اسم القاعدة؛ لا fallback إلى قاعدة الاستخدام |
| API_PORT | 3001 | Fastify listen على 0.0.0.0 إذا عُرض في preview |
| WEB_PORT | 3000 | يُمرر إلى أمر Next.js كـport، لا يُفترض أنه متغير Next مدمج |
| API_BASE_URL | http://127.0.0.1:3001 | Next server-side rewrite فقط؛ ليس NEXT_PUBLIC ولا عنوان fetch في المتصفح |

المتصفح يستخدم /api/* على نفس origin. API_BASE_URL لا يتضمن /api، والـrewrite يمرر /api/:path* كما هو إلى Fastify. لا double /api. لا CORS plugin طالما هذا المسار المستخدم؛ لا proxy يخزن credentials أو يطبق قواعد العمل. لا تعريض DATABASE_URL أو نسخ root env إلى bundle.

في التنفيذ اللاحق يُحمّل ملف env الجذري صراحة إلى العمليات وفق وسيلة runtime/CLI المتوافقة المختارة؛ لا افتراض أن Prisma أو Next يقرأان root env من cwd مختلف. .env غير متعقب و.example بلا أسرار. compose اختياري لـPostgreSQL فقط إن توفرت Docker؛ بديله PostgreSQL محلي أو متاح للتطوير. schema migrations وseed أعمال Phase 03 بعد الاعتماد، لا أوامر تغيّر قاعدة في هذه المرحلة.

## Seed قابل لإعادة التشغيل دون فساد الرصيد
بيانات عرض مقترحة: ثلاثة موظفين بمعرفات UUID ثابتة وأسماء عربية؛ ثلاثة أنواع: شاشة total=2، جهاز عرض total=1، محول total=0. عند الإنشاء الأول available=total ولا loans أولية؛ الصفر fixture نفاد صحيح. الشاشة لدورات الاستعارة، جهاز العرض لتنافس آخر وحدة. بيانات اختبار rollback/history تُنشأ كfixtures معزولة، لا تعتمد على ترتيب عمليات العرض.

يستخدم seed upsert بالمفاتيح الثابتة، وupdate فارغ للصف الموجود؛ لا reset للمتاح أو total ولا حذف Loans ولا إعادة تنشيطها. تشغيل seed ثانية بعد استعارة **يحافظ على الرصيد والتاريخ** ولا يزيد الموجود إلى قيمته الأصلية. لا الاعتماد على name كـunique. أي اختلاف إعداد عن بيانات موجودة يُبلغ كحاجة مراجعة لا overwrite خفي. seed يجرى خارج تشغيل التطبيقات، ومعاملة واحدة لترابط الدفعة؛ لا fixtures للإنتاج أو إدارة مخزون.

اختبار seed لاحقًا: تشغيلان على قاعدة نظيفة لا يضاعفان الصفوف؛ Borrow ثم seed يحافظ على available والنشط؛ Return ثم seed يحافظ على التاريخ؛ كل ذلك في قاعدة اختبار فقط قبل قبول الآلية.

## سياسة التعليقات
لا كود تطبيق الآن. عند التنفيذ تضاف تعليقات عربية لكل سطر قابل للتعليق، بما فيه التعريفات والإغلاقات وفق صيغة الملف. JSON/lockfiles لا تدعم comments؛ تُشرح خارجها في docs ولا تُكسر syntax أو الملفات المولدة. هذا تفسير تقني مقترح يحتاج قبول المالك قبل كتابة الكود؛ لا نضيف تعليقات إلى ملفات مولدة أو أسرار في الأمثلة.
