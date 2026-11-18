# التقرير النهائي — Phase 03 Backend Engineering

## القرار: PASS WITH LIMITATIONS
Backend حقيقي يعمل ومختبر على PostgreSQL. تحققت الوظائف وقواعد العمل والمعاملات والتزامن. التقييد المتبقي البارز هو **خمس نتائج high في شجرة اعتماديات الاختبار**؛ npm audit الكامل أعاد exit 1 ولم يُعتبر PASS. لا ثغرات مُبلّغ عنها في npm audit --omit=dev وقت التشغيل؛ هذا فحص registry لا ضمان أمان شاملًا. لا Frontend ولا بدء Phase 04.

## التفويض والقرارات
اعتمد المالك Phase 00 وPhase 01 في المحادثة، ثم اختار صراحة «أعتمد Phase 02 وأصرّح بـPhase 03»، بما فيه حسم إصدارات Backend وتوثيقها قبل التثبيت. نُفذ التصميم المعتمد لا الهيكل المطول المقترح في تكليف التنفيذ: routes رقيقة تقوم بدور controller، وservices للقواعد، وschemas للتحقق، وplugins لدورة Prisma والأخطاء. لا طبقات عامة إضافية.

القرارات المغلقة: npm Workspaces، قفل Equipment داخل ReadCommitted transaction، partial unique SQL، Return شرطي تحت القفل وعدد متأثر واحد، snapshots القراءة RepeatableRead، وتاريخ Loan مستقل لكل دورة. لا تغيير استراتيجي استلزم موافقة معمارية جديدة.

## ما نُفذ
- app.ts يبني Fastify دون منفذ للاختبارات؛ server.ts يستمع من environment ويعالج SIGINT/SIGTERM. Prisma plugin يربط/يغلق العميل، مع ownership مختلف للعميل المُمرر للاختبار.
- Environment مركزي: تحميل root .env والتحقق من mode/port/URL؛ قاعدة اختبار إلزامية ومعزولة ومتحقق من اسمها الفعلي قبل cleanup.
- Employee وEquipment وLoan بالأنواع والعلاقات المعتمدة؛ UUID يولده التطبيق وTIMESTAMPTZ(3). لم نضف updatedAt/status/quantity غير موجودة بالتصميم.
- migration واحدة 202611180001_initial؛ PK/FK Restrict وNOT NULL وeq_total_nonnegative وeq_available_bounds وunique_active_loan_per_employee_equipment WHERE returnedAt IS NULL وidx_loan_equipment.
- Seed غير مدمر بثلاثة موظفين وثلاثة أنواع 2/1/0؛ يتكرر ويحفظ الرصيد والتاريخ بعد Borrow/Return.
- APIs: GET /api/health و/employees و/equipment?employeeId، POST /api/loans و/api/loans/:loanId/return، بعقد Phase 02 مع data.equipment لا array مباشرة.
- validation للـquery/path/body وUUID وunknown fields دون coercion أو حذف صامت، وأخطاء موحدة برسائل عربية وتفاصيل حقول آمنة.
- لا auth/RBAC/إدارة/queues/workers/Frontend/production deployment/CI. لا deps خاصة بالويب.

## الثوابت والمعاملات
Borrow يتحقق من الموظف ثم يقفل النوع ويعيد فحص النشط قبل المتاح؛ ينقص واحدًا ثم ينشئ Loan في tx نفسها. فشل insert يرد الخصم تلقائيًا. Return يقرأ السجل لتحديد النوع، يقفل Equipment أولًا ثم يعيد فحص Loan، ويطبق updateMany بشرط returnedAt=null وعدد=1 قبل زيادة واحدة. فشل الزيادة يعيد returnedAt إلى حالته السابقة. لا تعديل تعويضي خارج tx.

partial unique يحمي النشط دون منع التاريخ، وCHECK يمنع السالب أو تجاوز الإجمالي. available+active=total يُحفظ بالبروتوكول والمعاملات وتفحصه الاختبارات؛ ليس CHECK عابر جداول ولا حماية من SQL إداري خارجي. لا process mutex أو optimistic retry يخفي تعارضًا. unique المعروف 409 ALREADY_BORROWED؛ تعارض tx المثبت 409 TRANSACTION_CONFLICT؛ أخطاء غير متوقعة 500 بلا SQL/stack/secrets. فقد استجابة commit لا يثبت rollback؛ العميل المستقبلي يعيد الجلب قبل التكرار.

## النتائج التشغيلية الفعلية
- **48 اختبارًا نجح:** 15 وحدة و33 تكامل، لا failed أو skipped.
- I09–I12 تنسق اتصالين حقيقيين وتتحقق من pg_stat_activity أن طلبًا ينتظر row lock قبل تحرير الأول. لا mock يزعم إثبات التزامن.
- I06/I08 يحقنان فشلًا بين الكتابتين؛ I07 يفشل insert فعليًا بـFK بعد الخصم، وI24 يفشل تحديث المخزون بtrigger اختباري مؤقت ويثبت rollback و500 آمنًا. trigger يُحذف في finally ولا يوجد في migration أو التطوير.
- I14 يقرأ الفهرس الحقيقي ويرفض insert نشط مكرر ويختبر تصنيف Prisma الفعلي؛ I15/I16 يختبران CHECK/FK/NOT NULL وعدم حذف التاريخ.
- I17 يكرر seed قبل الاستعارة وبعدها وبعد الإرجاع. بقيت بيانات التطوير 3 موظفين و3 أنواع وصفر Loans بعد الاختبارات؛ كل mutations الاختبارية في قواعد _test.
- migration طُبقت أولًا على قاعدتين فارغتين، ثم على team_equipment_replay_test جديدة، وأعيدت الاختبارات كلها عليها بنجاح. لا ادعاء upgrade من بيانات شركة قائمة؛ لم يكن هناك مخطط سابق.
- نجح TypeScript وbuild وPrisma validate/generate. انطلق JavaScript المبني فعليًا، وأعادت قراءات HTTP live أكواد 200. تجربة منفصلة أرسلت SIGTERM وخرج الخادم طبيعيًا بـ0.

انظر [نتيجة كل اختبار منفرد](04-test-results.md) و[evidence/test-results.json](evidence/test-results.json). اختبارات خدمات القواعد المتغيرة كلها على DB حقيقية؛ Unit تقتصر على المنطق الصرف للبيئة وتصنيف الأخطاء بدل محاكاة معاملات تدّعي الصحة.

## سجل أوامر التحقق المنفذة
كل صف أدناه شُغل فعلًا؛ exit غير الصفر لا يُعد نجاحًا.
| الأمر | شُغل؟ | exit | النتيجة | الدليل |
|---|---|---|---|---|
| `node --version` | نعم | 0 | PASS | [node-version](evidence/node-version.txt) |
| `npm --version` | نعم | 0 | PASS | [npm-version](evidence/npm-version.txt) |
| `psql --version` | نعم | 0 | PASS | [postgres-version](evidence/postgres-version.txt) |
| `npm run db:start` | نعم | 0 | PASS | [db-start](evidence/db-start.txt) |
| `npm run db:setup` | نعم | 0 | PASS | [db-setup](evidence/db-setup.txt) |
| `npm run prisma:generate` | نعم | 0 | PASS | [prisma-generate](evidence/prisma-generate.txt) |
| `npm run prisma:validate` | نعم | 0 | PASS | [prisma-validate](evidence/prisma-validate.txt) |
| `npm run db:migrate` | نعم | 0 | PASS | [migration-status](evidence/migration-status.txt) |
| `npm run db:test:migrate` | نعم | 0 | PASS | [test-migrate](evidence/test-migrate.txt) |
| `npm run db:seed` | نعم | 0 | PASS | [seed-first](evidence/seed-first.txt) |
| `npm run db:seed` | نعم | 0 | PASS | [seed-second](evidence/seed-second.txt) |
| `npm run typecheck` | نعم | 0 | PASS | [typecheck](evidence/typecheck.txt) |
| `npm run build` | نعم | 0 | PASS | [build](evidence/build.txt) |
| `npm run test:unit` | نعم | 0 | PASS | [unit-tests](evidence/unit-tests.txt) |
| `npm run test:integration` | نعم | 0 | PASS | [integration-tests](evidence/integration-tests.txt) |
| `npm run test -w @team/api -- --reporter=json --outputFile=../../docs/phase-03/evidence/test-results.json` | نعم | 0 | PASS | [all-tests](evidence/all-tests.txt) |
| `npm audit --omit=dev --json` | نعم | 0 | PASS | [runtime-audit](evidence/runtime-audit.txt) |
| `npm audit --json` | نعم | 1 | FAIL / تحذيرات أمنية قائمة | [full-audit](evidence/full-audit.txt) |

فحوص إضافية فعلية: npm ci (نجح، [سجل التثبيت](evidence/npm-ci.txt))؛ ترحيل قاعدة جديدة ([الدليل](evidence/fresh-replay-migration.txt))؛ الاختبارات عليها ([الدليل](evidence/fresh-replay-tests.txt))؛ خادم فعلي وGETs ([الدليل](evidence/live-http-smoke.json))؛ SIGTERM/exit0 ([الدليل](evidence/graceful-shutdown.txt))؛ pg_catalog ومصالحة بيانات التطوير ([الدليل](evidence/database-catalog.txt))؛ فحص التعليقات وعدم any/raw unsafe ([الدليل](evidence/source-review.txt)).

الأوامر التوضيحية cp/curl في الأدلة ليست ادعاء أنها نُفذت حرفيًا؛ استخدمت عمليات إعداد وقراءات HTTP موثقة مكافئة. db:stop متاح لكنه لم يُشغّل لأن API المعروض يستخدم PostgreSQL. شُغل npm run api:dev فعليًا على المنفذ3003 وأعاد health 200، ثم أوقفت جلسة التطوير؛ التحقق الأساسي استخدم أيضًا api:start المبني. راجع [الدليل](evidence/development-server.txt).

## أخطاء ظهرت أثناء العمل وكيف عولجت
| المسألة | النتيجة/المعالجة |
|---|---|
| typecheck الأولي: error مجهول في error-handler | فشل فعلي TS18046؛ ضُبط generic FastifyError دون any، ثم نجح typecheck |
| التحذير من engines في اعتماديات التطوير على Node20 | وفرت Node22.22.2 تحت /usr/local وأعدت npm ci بنجاح دون تلك التحذيرات؛ لم أستبدل /usr/bin/node |
| محاولة npm install -g node في prefix /usr | فشلت EEXIST لوجود /usr/bin/node؛ لم أستخدم --force، نجح التثبيت في /usr/local |
| audit الأول: نتائج critical في Vitest3 | رُفعت النسخة إلى 4.1.12 بعد فحص engines وإعادة الاختبارات؛ اختفت critical لكن بقيت high بالشجرة |
| scan التعليقات الأول | وجد سطر provider في TOML دون تعليق على السطر؛ أضيف التعليق وأعيد الفحص بنجاح |
| مسار start الافتراضي قبل التشغيل | راجعت مخرجات tsc وأصلحت المسار إلى build/server.js ثم تحققت بالتشغيل الفعلي |
| npm test -- --reporter=verbose على root wrapper | لم يمرر reporter إلى Vitest كما قصد؛ استخدم الأمر workspace المباشر لإخراج JSON الفعلي دون ادعاء إخراج verbose |

## الإصدارات والتغييرات عن الأمثلة
Node22 وVitest4 حسم OPEN-VERSION ضمن الإذن الحالي، لا تغيير stack. Prisma/client/adapter 7.10.1 وFastify5.12.8 وTS5.9.3. منفذ 3001 محفوظ من التصميم بدل مثال4000. غلاف data.equipment وTRANSACTION_CONFLICT محفوظان بدل أمثلة Phase03 المختلفة. لا تغيير معمارية خفي أو updatedAt إضافي. مصدر القيود SQL migration دون preview؛ فحص replay يثبت التطبيق الفعلي، ولا نعتمد db push كبديل.

## ما بقي والقيود
1. خمس نتائج high بالـdev dependency tree؛ الفحص الكامل **FAIL**. لا إصلاح قسري؛ مصدر advisory يشمل أعلى picomatch متاح حين الفحص، والـsuggested downgrade لا يُطبق لأنه يعيد مشكلات أخرى. يلزم متابعة upstream. أدوات Vitest تعمل run محليًا فقط ولا UI/خادم mock معرض، لكن الخطر لم يعلن محلولًا.
2. إعداد قاعدة محلية trust على loopback خاص ببيئة معزولة وليس توصية إنتاج أو multi-user host. البديل اتصال PostgreSQL ببيانات اعتماد محلية غير متعقبة؛ لا أسرار حقيقية في ZIP.
3. بيئة sandbox والعمليات والحزم النظامية وبيانات PostgreSQL ليست مضمونة الاستمرار عند نقل الحزمة. مصدر المشروع والـlock والمigrations والـseed والأوامر قابلة لإعادة الإعداد؛ لا تضمين قاعدة ثنائية أو node_modules.
4. لا load/stress أو production deployment أو اختبار شبكات موزعة أو اختبار failover؛ خارج النطاق. لا ادعاء أمان شامل أو exactly-once لنتيجة شبكة غامضة.
5. Native partial-index representation يظل خيارًا لاحقًا، لا migration ثانية هنا. أي تحديث Prisma يتطلب إعادة فحص diff/replay حتى لا يُسقط القيد المخصص.

## مراجعة شروط الاكتمال
Fastify/Prisma/PostgreSQL والـmodels والمigration النظيفة والقيود والفهرس والـseed والـAPIs والمعاملات والتزامن وdouble-return وvalidation/errors وunit/integration وtypecheck والتوثيق: تحقق محليًا كما بالأدلة. لا Frontend غير مصرح به. لا يُخفى فشل audit الكامل داخل هذه القائمة؛ لذلك الحالة PASS WITH LIMITATIONS لا PASS غير مشروط.

## الهيكل النهائي والمسؤوليات
app/server وconfig/env وplugins/prisma/error-handler وroutes/index وschemas/requests وservices/equipment/loans/seed-data وlib/errors/prisma، ثم prisma/schema/migration/seed وtests/unit/integration/helpers وscripts/migrate-test؛ إعداد workspace وscripts/db-local في الجذر. [دليل الإعداد](01-backend-setup.md) و[توثيق كل endpoint](02-api-documentation.md).

## الملفات المعدلة والجديدة
- الملف السابق المعدل الوحيد: README.md لتوجيه المراجع إلى Backend وأوامره بدل حالة Phase00 القديمة.
- مستندات Phase00–02 وعددها37 محفوظة ببصماتها بلا تعديل؛ لا أرشيف سابق استُبدل.
- الملفات الجديدة مفهرسة أدناه؛ build وnode_modules و.env المحلية ملفات تشغيل/توليد مستثناة من تسليم ZIP، وليست تغييرات Frontend.

- `.env.example`
- `.gitignore`
- `apps/api/package.json`
- `apps/api/prisma/migrations/202611180001_initial/migration.sql`
- `apps/api/prisma/migrations/migration_lock.toml`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/seed.ts`
- `apps/api/prisma.config.ts`
- `apps/api/scripts/migrate-test.ts`
- `apps/api/src/app.ts`
- `apps/api/src/config/env.ts`
- `apps/api/src/lib/errors.ts`
- `apps/api/src/lib/prisma.ts`
- `apps/api/src/plugins/error-handler.ts`
- `apps/api/src/plugins/prisma.ts`
- `apps/api/src/routes/index.ts`
- `apps/api/src/schemas/requests.ts`
- `apps/api/src/server.ts`
- `apps/api/src/services/equipment.ts`
- `apps/api/src/services/loans.ts`
- `apps/api/src/services/seed-data.ts`
- `apps/api/tests/helpers/database.ts`
- `apps/api/tests/integration/backend.test.ts`
- `apps/api/tests/unit/env-errors.test.ts`
- `apps/api/tsconfig.build.json`
- `apps/api/tsconfig.json`
- `apps/api/vitest.config.ts`
- `docs/phase-03/01-backend-setup.md`
- `docs/phase-03/02-api-documentation.md`
- `docs/phase-03/04-test-results.md`
- `docs/phase-03/evidence/all-tests.txt`
- `docs/phase-03/evidence/build.txt`
- `docs/phase-03/evidence/command-results.json`
- `docs/phase-03/evidence/database-catalog.txt`
- `docs/phase-03/evidence/db-setup.txt`
- `docs/phase-03/evidence/db-start.txt`
- `docs/phase-03/evidence/fresh-replay-migration.txt`
- `docs/phase-03/evidence/fresh-replay-tests.txt`
- `docs/phase-03/evidence/full-audit.txt`
- `docs/phase-03/evidence/graceful-shutdown.txt`
- `docs/phase-03/evidence/integration-tests.txt`
- `docs/phase-03/evidence/live-http-smoke.json`
- `docs/phase-03/evidence/migration-status.txt`
- `docs/phase-03/evidence/node-version.txt`
- `docs/phase-03/evidence/npm-ci.txt`
- `docs/phase-03/evidence/npm-version.txt`
- `docs/phase-03/evidence/postgres-version.txt`
- `docs/phase-03/evidence/prisma-generate.txt`
- `docs/phase-03/evidence/prisma-validate.txt`
- `docs/phase-03/evidence/runtime-audit.txt`
- `docs/phase-03/evidence/seed-first.txt`
- `docs/phase-03/evidence/seed-second.txt`
- `docs/phase-03/evidence/source-review.txt`
- `docs/phase-03/evidence/test-migrate.txt`
- `docs/phase-03/evidence/test-results.json`
- `docs/phase-03/evidence/typecheck.txt`
- `docs/phase-03/evidence/unit-tests.txt`
- `package-lock.json`
- `package.json`
- `scripts/db-local.sh`
- `docs/phase-03/03-phase-03-final-report.md`

## مراجعة التسليم الأخيرة
أُعيد تشغيل 48 اختبارًا بعد آخر تعديل للخدمات، ونجح typecheck وbuild. تأكدت بصمات37 وثيقة تاريخية مع تعديل README فقط. فُحصت الروابط والأمثلة والتعليقات وعدم إنشاء Frontend، وأعاد الخادم المبني الأحدث health 200. [نتيجة المراجعة](evidence/final-review.txt)، [النسخ المثبتة](evidence/installed-versions.txt)، [تشغيل التطوير](evidence/development-server.txt).

## بوابة التوقف
انتهى العمل في Backend. **لا Frontend Engineering ولا انتقال إلى Phase 04 دون موافقة مالك المشروع الصريحة.** يُرجى مراجعة النتائج والقيود الأمنية قبل اعتماد المرحلة. لا نعتبر اعتماد Phase02 السابق اعتمادًا مسبقًا لPhase03 أو04.
