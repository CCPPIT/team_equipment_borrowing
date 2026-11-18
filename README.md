# Team Equipment Borrowing — استعارة معدات الفريق

تطبيق عربي باتجاه RTL يتيح اختيار موظف مُدخل مسبقًا، عرض أنواع المعدات والمتاح منها، استعارة **وحدة واحدة**، ثم إرجاعها وإعادة استعارة النوع نفسه. تُحفظ الاستعارات المكتملة ولا تُحذف عند الإرجاع.

**جاهزية التسليم المحلي: PASS WITH LIMITATIONS.** الجولة النهائية: **118 حالة ناجحة** (48 Backend +45 Frontend +19 System +6 Browser). فحص اعتماديات التشغيل:0 نتائج؛ الفحص الكامل: **FAIL،16 high في أدوات التطوير واعتمادياتها،0 critical**. لا نشر أو إرسال للشركة ضمن هذا العمل. [التقرير النهائي والقيود](docs/phase-06/10-PHASE-06-FINAL-REPORT.md).

## القدرات والنطاق
- اختيار موظف وجلب المعدات من API الحقيقي، مع إجمالي المخزون والمتاح والاستعارة النشطة.
- Borrow وReturn وReborrow، مع منع النشط المكرر والنفاد والإرجاع المتكرر في الخادم وقاعدة البيانات.
- Loading وEmpty وPending وRetry ورسائل عربية؛ لا خصم متفائل ولا تكرار POST تلقائي عند غموض الشبكة.
- منع النقر المكرر وعزل استجابات الموظفين المتأخرة، واستعادة تركيز زر الإجراء بعد انتهاء العملية دون سرقته من عنصر آخر.
- لا مصادقة أو RBAC أو إدارة موظفين/معدات أو حجوزات أو مواعيد/غرامات أو تنبيهات أو لوحة إدارة. اختيار الموظف ليس تسجيل دخول أو تحقق هوية.

## التقنيات والمعمارية
| المجال | التنفيذ الفعلي |
|---|---|
| Frontend | Next16.4.6 App Router، React19.3.1، TypeScript5.9.3 |
| Backend | Fastify5.12.8، TypeScript strict |
| Database | PostgreSQL17.12 مختبرة، Prisma/client/adapter-pg7.10.1 |
| Testing | Vitest4.1.12، Testing Library، Playwright1.65.1، axe4.14.0 |
| Workspace | **npm Workspaces** وpackage-lock.json جذري واحد |

**pnpm غير مستخدم ولا توجد نسخة pnpm معتمدة أو pnpm-lock.yaml.** اختير npm في Phase02 واعتمده المالك؛ لم نبدل مدير الحزم في مرحلة التسليم أو نضف ملفات pnpm غير مطابقة. مدير الحزم المثبت والمختبر هو npm10.8.2، وpackageManager يسجل ذلك.

```text
Team Equipment Borrowing/
├── apps/api/          Fastify + Prisma + migrations + seed + backend tests
├── apps/web/          Next App Router + API client + components + frontend/browser tests
├── tests/system/      HTTP/browser/PostgreSQL integration harness (test only)
├── scripts/           local PostgreSQL helper
├── docs/phase-00/ … docs/phase-06/
├── package.json
├── package-lock.json
├── .env.example
└── .gitignore
```
المتصفح → `/api` على Next → HTTP rewrite خادمي → Fastify → Prisma → PostgreSQL. لا وصول DB من المتصفح ولا Prisma types في مصدر عميل الويب. لا shared package أو طبقات عامة غير لازمة؛ DTO صغيرة يطابقها اختبار العقد.

## المتطلبات السابقة
- Node **^22.22.2 أو ^24.15.0 أو >=26.0.0**؛ النسخة المنفذة في QA هي22.22.2، وnpm10.8.2. فروع Node الأخرى المسموح بها بالـengines لم تُختبر كلها.
- PostgreSQL17.12 مختبرة؛ يلزم خادم متصل وصلاحية إنشاء قواعد تطوير/اختبار وتطبيق الترحيل. لا ادعاء اختبار majors أخرى.
- Bash وأدوات PostgreSQL (`pg_config`, `initdb`, `pg_ctl`, `psql`, `createdb`) لمسار المساعد المحلي. شغّله بحساب عادي وليس root.
- لا Docker أو خدمات خارجية مطلوبة. المتصفح ومكتبات نظامه مطلوبان لاختبارات E2E فقط.

## التثبيت وإعداد البيئة
من جذر المشروع، لا من apps/web أو apps/api:
```sh
npm ci # تثبيت النسخ المقفلة دون تحديث رئيسي أو audit fix قسري
[ -f .env ] || cp .env.example .env # إنشاء إعداد الخلفية محليًا دون استبدال إعداد قائم
[ -f apps/web/.env.local ] || cp apps/web/.env.local.example apps/web/.env.local # إنشاء إعداد الواجهة الآمن المستقل
npm run prisma:generate # توليد Prisma Client من النموذج الحالي
```

| المتغير | مكانه | المعنى |
|---|---|---|
| NODE_ENV | root .env | development/test/production؛ لا يجعل إعداد trust مناسبًا للإنتاج |
| API_PORT | root .env | منفذ Fastify، الافتراضي3001 |
| DATABASE_URL | root .env | اتصال قاعدة التطوير فقط؛ لا تنقله إلى web |
| TEST_DATABASE_URL | root .env | قاعدة backend معزولة تنتهي بـ_test وتختلف عن التطوير |
| SYSTEM_DATABASE_URL | root .env أو بيئة الاختبار | قاعدة النظام المعزولة تنتهي بـ_phase05_test؛ مستقلة عن القاعدتين السابقتين |
| API_BASE_URL | apps/web/.env.local | origin الخلفية من خادم Next، الافتراضي http://127.0.0.1:3001؛ ليس NEXT_PUBLIC |
| WEB_PORT | apps/web/.env.local | منفذ Next، الافتراضي3000 |

قِيَم WEB_PORT/API_BASE_URL في مثال الجذر مرجع فقط؛ Next وسكربته يقرآن الملف داخل apps/web. لا تنسخ ملف الجذر بأسراره إلى الواجهة. .env الحقيقي مستبعد من التسليم. لا تضع كلمات مرور حقيقية في README أو Git.

**مهم:** rewrite يتثبت عند **البناء**؛ تغيير API_BASE_URL عند `web:start` وحده لا يغيّر بناءً قديمًا. أعد البناء بالعنوان المقصود، ولا تشغّل بناءين مختلفين بالتوازي على `.next` المشتركة.

## إعداد قاعدة البيانات
### المسار المحلي المعزول المختبر
```sh
npm run db:setup # تشغيل عنقود محلي عند الحاجة وإنشاء team_equipment وteam_equipment_test دون حذف قاعدة موجودة
npm run db:migrate # تطبيق SQL migrations على DATABASE_URL
npm run db:test:migrate # تطبيقها على TEST_DATABASE_URL بعد حارس العزل
npm run db:seed # إدخال ثلاثة موظفين وثلاثة أنواع بأرصدة2/1/0 دون تصفير التاريخ أو الرصيد الموجود
```
مساعد `db:setup` يستخدم **trust على loopback للتطوير المعزول فقط** ويحفظ البيانات في `$HOME/.local/team-equipment-pg`. ليس إعداد إنتاج أو خادم مشترك. لا تستخدم `db:stop` بينما يعتمد تطبيق آخر على هذا العنقود.

### عند استخدام PostgreSQL موجودة
اختر role بصلاحيات مناسبة وأنشئ قاعدتين منفصلتين؛ عدّل أسماء المستخدم/المضيف في المثال ومتغيرات الاتصال محليًا. لا تنفذ createdb ثانية إذا كانت القاعدة موجودة، ولا تستخدم reset/drop لتجاوز تعارض.
```sh
createdb -h 127.0.0.1 -U team_equipment team_equipment # مثال إنشاء قاعدة التطوير إن كانت غير موجودة ولديك هذا الدور
createdb -h 127.0.0.1 -U team_equipment team_equipment_test # إنشاء قاعدة اختبار مستقلة فقط
npm run prisma:generate # توليد العميل المحلي
npm run db:migrate # تطبيق التاريخ المعتمد بعد ضبط DATABASE_URL
npm run db:test:migrate # تجهيز قاعدة الاختبار بعد ضبط TEST_DATABASE_URL
npm run db:seed # إدخال البيانات الأولية القابلة للتكرار
```
لا `db push` أو حذف لتاريخ migration. القيود SQL المخصصة جزء إلزامي من migration؛ لا يكفي schema.prisma وحده لإعادة إنشائها.

## تشغيل التطبيق
### التطوير الكامل للمستودع
افتح **طرفيتين من الجذر**؛ لا حاجة لمكتبة تشغيل متوازٍ:
```sh
npm run api:dev # الطرفية1: Fastify مع watch على3001 افتراضيًا
```
```sh
npm run web:dev # الطرفية2: Next مع reload على3000 افتراضيًا
```
افتح `http://localhost:3000`. البيئة المعروضة في Arena معاينة محلية وليست نشرًا للشركة.

### بناء وتشغيل محلي بإعداد إنتاج
```sh
npm run build:all # بناء backend ثم web باستخدام API_BASE_URL الموثق للواجهة
```
وفي طرفيتين:
```sh
npm run api:start # تشغيل JavaScript المبني للخلفية
```
```sh
npm run web:start # تشغيل بناء Next الموجود؛ لا يعيد البناء تلقائيًا
```

## الاختبارات والفحوص
```sh
npm run typecheck:all # TypeScript strict للخلفية والواجهة
npm run lint:all # ESLint للخلفية والواجهة وأدوات النظام مع max-warnings=0
npm run test:unit # اختبارات الخلفية الصرفة
npm run test:integration # اختبارات PostgreSQL للخلفية؛ تنظف قاعدة TEST_DATABASE_URL فقط
npm test # جميع اختبارات Backend، وليس اختبار المستودع كله
npm run web:test # عميل API ومكونات وحالة React
npm run test:all # Backend ثم Frontend دون اعتبار إعادة تشغيلها حالات جديدة
npm run build:all # البناء الإنتاجي للطرفين
npm run prisma:validate # فحص صحة Prisma schema
npm audit --omit=dev # فحص شجرة التشغيل؛ أعاد0 في الجولة النهائية
npm audit # فحص كامل؛ أعادexit1 مع16high، لا تخفِ هذه النتيجة
```
لا تشغل اختبارات تنظف القاعدة مع مستخدم حقيقي على القاعدة نفسها. فحوص backend تتحقق من suffix وهوية القاعدة قبل fixtures. لا استثناء يسمح باستخدام التطوير.

### E2E النظام الحقيقي
قاعدة النظام اسمها الاختباري يحتفظ بلاحقة Phase05 لأن هذا اسم حارس أداة التكامل المعاد استخدامها في QA، وليس مرحلة غير مصرح بها. يمكن إنشاء قاعدة مثل `team_equipment_final_phase05_test` كما فُعل في Phase06:
```sh
createdb -h 127.0.0.1 -U team_equipment team_equipment_final_phase05_test # مرة واحدة لقاعدة اختبار جديدة منفصلة
export SYSTEM_DATABASE_URL='postgresql://team_equipment@127.0.0.1:5432/team_equipment_final_phase05_test?schema=public' # مثالtrust محلي، استبدله محليًا وفق بيئتك ولا تشارك أسرارًا
npm run system:migrate # حارس هدف قاعدة فعلي ثم migrate deploy
npm run build # بناء الخلفية التي ستستخدمها أداة الاختبار
API_BASE_URL=http://127.0.0.1:3011 npm run web:build # بناء الواجهة باتجاه API الاختباري
npm exec -w @team/web -- playwright install --with-deps chromium # تثبيت المتصفح ومكتبات النظام إذا لم تتوفر
npm run system:test # يبدأ ويغلق Next3010 وFastify3011 ووكيلDB5545 والتحكم3016 تلقائيًا
```
19حالة فعلية تشمل ثلاث دورات إعادة استعارة، ورفض التكرار والنفاد والإرجاع الثاني، وثلاث جولات آخر وحدة مع رصد انتظار أقفال PostgreSQL، وفشل معاملات وشبكة وتعاف. يجري تنظيف **قاعدة النظام الاختبارية فقط** بين الحالات. التحكم3016 ووكيل5545 أدوات اختبار loopback خارج API المنتج، لا تعرضهما أو تنشرهما.

### اختبارات المتصفح الستة: لوحة المفاتيح وRTL وaxe
بعد system:test قد تبقى حالة اختبار نشطة، لذا جهّز fixtures المعزولة قبل مجموعة المتصفح المنفصلة:
```sh
node --input-type=module -e "const {reset,db}=await import('./tests/system/database.mjs'); await reset(); await db.end();" # يتطلبSYSTEM_DATABASE_URL المعزول نفسه؛ يمسح fixtures الاختبارية فقط
node tests/system/server.mjs # الطرفية1: بيئة النظام الاختبارية بعد البناء؛ أوقفها بـCtrl+C بعد الفحص
```
وفي طرفية ثانية مع SYSTEM_DATABASE_URL نفسه عند الحاجة إلى أدوات المراقبة:
```sh
WEB_TEST_URL=http://127.0.0.1:3010 RUN_LIVE_API=1 npm run web:test:browser # الطرفية2: Chromium حقيقي؛6حالات تشمل لوحة المفاتيح وعروض320/360/768/1440
```
بدون RUN_LIVE_API=1 تتخطى هذه المجموعة الحالات عمدًا؛ **SKIP ليس PASS**. بعد إنهاء البيئة الاختبارية أعد البناء المعتاد قبل المعاينة:
```sh
API_BASE_URL=http://127.0.0.1:3001 npm run web:build # استعادة rewrite الخادم الأساسي؛ ثمweb:start
```

## REST API الفعلي
الطلبات عبر HTTP/JSON تحت `/api`. الأمثلة التالية توضيحية لا سجل تشغيل؛ استخدم id الاستعارة المعاد فعليًا بدل id المثال. employeeId وequipmentId في الطلب الأول يطابقان بيانات seed.

### الموظفون — GET /api/employees
200:
```json
{"success":true,"data":{"employees":[{"id":"11111111-1111-4111-8111-111111111111","name":"أحمد"}]}}
```
### المعدات — GET /api/equipment?employeeId=UUID
200؛ activeLoan يخص الموظف المختار فقط:
```json
{"success":true,"data":{"employeeId":"11111111-1111-4111-8111-111111111111","equipment":[{"id":"22222222-2222-4222-8222-111111111111","name":"شاشة","description":null,"totalQuantity":2,"availableQuantity":1,"activeLoan":{"id":"33333333-3333-4333-8333-333333333333","borrowedAt":"2026-11-18T08:00:00.000Z"}}]}}
```
### الاستعارة — POST /api/loans
Content-Type: application/json، الجسم بالضبط:
```json
{"employeeId":"11111111-1111-4111-8111-111111111111","equipmentId":"22222222-2222-4222-8222-111111111111"}
```
201 بعد commit:
```json
{"success":true,"data":{"loan":{"id":"33333333-3333-4333-8333-333333333333","employeeId":"11111111-1111-4111-8111-111111111111","equipmentId":"22222222-2222-4222-8222-111111111111","borrowedAt":"2026-11-18T08:00:00.000Z","returnedAt":null}}}
```
### الإرجاع — POST /api/loans/{loanId}/return
الجسم employeeId فقط؛ لا quantity:
```json
{"employeeId":"11111111-1111-4111-8111-111111111111"}
```
200:
```json
{"success":true,"data":{"loan":{"id":"33333333-3333-4333-8333-333333333333","employeeId":"11111111-1111-4111-8111-111111111111","equipmentId":"22222222-2222-4222-8222-111111111111","borrowedAt":"2026-11-18T08:00:00.000Z","returnedAt":"2026-11-18T09:00:00.000Z"}}}
```
### الأخطاء
```json
{"success":false,"error":{"code":"OUT_OF_STOCK","message":"لا توجد وحدات متاحة من هذا النوع."}}
```
400 VALIDATION_ERROR للـUUID/JSON/الحقول الزائدة/quantity؛404 EMPLOYEE_NOT_FOUND أو EQUIPMENT_NOT_FOUND أو LOAN_NOT_FOUND (بما فيه عدم مطابقة الموظف)؛409 ALREADY_BORROWED أو OUT_OF_STOCK أو ALREADY_RETURNED أو TRANSACTION_CONFLICT؛500 INTERNAL_SERVER_ERROR دون SQL/stack. fields اختيارية في أخطاء التحقق، والقوائم الفارغة نجاح200. المسار GET /api/health يعيد حيوية HTTP فقط، وليس اختبار جاهزية DB لكل طلب. [تفصيل العقد الفعلي](docs/phase-03/02-api-documentation.md).

## قرارات هندسية مطبقة
- الموظفون seed لأن إدارة الحسابات والموظفين والمصادقة خارج التكليف، لا لأن اختيار الاسم يثبت الهوية.
- Loan سجل لوحدة واحدة؛ returnedAt=null نشط. Return يعدّل السجل ولا يحذفه، وReborrow ينشئ UUID جديدًا.
- partial unique على employeeId/equipmentId حين returnedAt IS NULL يمنع نشطين ويحافظ على التاريخ.
- Borrow وReturn داخل معاملات ReadCommitted مع قفل صف Equipment أولًا. الفحص والخصم/الزيادة والسجل ضمن transaction واحدة؛ فشل أي كتابة يرجع الجميع.
- آخر وحدة: الطلب الثاني ينتظر القفل ويقرأ الحالة المثبتة الجديدة؛ CHECK يمنع السالب أو تجاوز الإجمالي. لا mutex في الذاكرة أو retry mutation أعمى.
- قراءة المعدات RepeatableRead لدمج المخزون والنشط في snapshot واحدة؛ بعد mutation تعيد الواجهة GET ولا تعدّل المخزون تفاؤليًا.
- Fastify للفصل بين routes والتحقق والخدمات، وPrisma للعميل والمعاملات والترحيلات؛ SQL مربوط المعلمات لقفل الصف، وSQL migration للقيود المخصصة.

[إجابات المقابلة الهندسية](docs/phase-06/07-ENGINEERING-EXPLANATIONS.md) — [شفافية استخدام AI](docs/phase-06/08-AI-USAGE-REPORT.md).

## القيود الصريحة
- audit الكامل16high في أدوات التطوير واعتمادياتها، منها picomatch ReDoS؛0critical و0runtime وقت الفحص، لا ضمان أمان شامل. ESLint9 يصدر تنبيه انتهاء الدعم؛ لم نطبق تخفيضات audit fix --force أو upgrade major غير متوافق.
- Chromium فقط، وقواعد axe مختارة؛ لا أجهزة فعلية أو قارئ شاشة بشري أو اختراق أو حمل/إجهاد أو failover أو نشر.
- لا .git في النسخة المتاحة؛ أمكن فحص الملفات والحزمة، لا تاريخ Git غير الموجود. لا ندعي أن كل اقتراح AI خضع لمراجعة بشرية مستقلة.
- available+active=total يحميه بروتوكول التطبيق والمعاملات مع فحص المصالحة؛ ليس CHECK عابر جداول يحمي من SQL إداري خارجي.
- فقد رد بعد commit لا يثبت rollback أو exactly-once؛ الواجهة تصالح الواقع بـGET قبل إتاحة إجراء جديد.
- node_modules وحزم النظام وChromium وبيانات PostgreSQL ليست داخل ZIP؛ يلزم إعدادها من جديد.

## التوثيق والتسليم
وثائق Phase00–05 محفوظة تاريخيًا، وحالات BLOCKED القديمة تعكس وقتها. نتائج Phase06 الحالية في [فهرس التسليم والتقرير](docs/phase-06/10-PHASE-06-FINAL-REPORT.md)، و[قائمة التحقق](docs/phase-06/09-SUBMISSION-CHECKLIST.md).

التوثيق والتعليقات بالعربية. JSON وpackage-lock وملفات الأدوات المولدة لا تقبل تعليقات داخلية وتبقى صالحة؛ migration_lock.toml يستخدم تعليقًا عربيًا سابقًا لسطرprovider لأن التعليق الطرفي فيه كسر Prisma سابقًا وأُصلح بموافقة المالك. لا أسرار أو build artifacts مطلوبة داخل حزمة التسليم.

**التوقف بعد Phase06؛ لا إرسال للشركة أو عمل إضافي دون موافقة المالك الصريحة.**
#   t e a m _ e q u i p m e n t _ b o r r o w i n g  
 