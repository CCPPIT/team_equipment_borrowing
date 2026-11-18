# إعداد Backend وتشغيله

## النطاق والاعتماد
اعتمد المالك Phase 02 صراحة باختيار «أعتمد Phase 02 وأصرّح بـPhase 03» في سؤال بوابة التنفيذ، بما فيه npm Workspaces وسياسة التعليقات وحسم الإصدارات المتوافقة قبل التثبيت. التنفيذ Backend فقط؛ لا apps/web أو Next.js أو Components. مستندات Phase 00–02 محفوظة بلا تعديل، وحالة تقاريرها القديمة تعكس وقت كتابتها لا الاعتمادات اللاحقة.

## الإصدارات الفعلية المقفلة
| التقنية | الإصدار المستخدم | المبرر |
|---|---|---|
| Node.js | 22.22.2 | أعلى من متطلبات Prisma v7 والاعتماديات التي تحتاج >=22؛ أضيف تحت /usr/local دون استبدال /usr/bin/node 20 |
| npm | 10.8.2 | npm Workspaces المعتمدة؛ lockfile جذري واحد |
| PostgreSQL | 17.12 | قاعدة علائقية حقيقية؛ لا محاكاة أو SQLite |
| Prisma / Client / adapter-pg | 7.10.1 | نسخة واحدة للأسرة؛ PostgreSQL driver adapter المطلوب لـv7 |
| Fastify | 5.12.8 | validation وlogging وinject مدمجة |
| TypeScript | 5.9.3 | strict وnoUncheckedIndexedAccess وexactOptionalPropertyTypes |
| Vitest | 4.1.12 | تحديث من 3.2.7 بعد فحص الثغرات؛ اختبار TypeScript موحد |
| tsx | 4.20.6 | تشغيل التطوير والseed والبرامج TypeScript دون بناء مسبق |
| pg | 8.23.1 | تثبيت إصدار driver المستخدم بواسطة Prisma adapter |
| dotenv | 17.2.3 | تحميل root .env صراحة دون الاعتماد على cwd |
| fastify-plugin | 5.1.0 | مشاركة Prisma decorator بين routes وإدارة دورة حياته |

الإصدارات مثبتة في package.json وpackage-lock.json. نتائج الاختبارات والتشغيل لا تعني ضمانًا لكل runtime مسموح؛ النسخة التي اختُبرت Node 22.22.2. PostgreSQL وحالة العمليات وnode_modules والملفات المولدة ليست جزءًا من ZIP؛ أعد الإعداد عند نقل المشروع إلى بيئة جديدة.

## المتطلبات المحلية
Node 22.12+ ضمن engines المعتمدة، npm، PostgreSQL مثبت وpg_config وinitdb وpg_ctl وpsql متاحة، وBash لمسار الإعداد المحلي. في بيئة Debian الاختبارية شُغل فعليًا تثبيت postgresql وpostgresql-client عبر apt-get. لا تثبيت تلقائي في سكربت المشروع، ولا Docker مطلوب.

> سكربت db المحلي يهيئ عنقودًا جديدًا في `$HOME/.local/team-equipment-pg` بمصادقة trust وعلى **127.0.0.1 فقط** للتطوير المعزول. هذا ليس إعداد إنتاج ولا يصلح لمضيف متعدد المستخدمين غير الموثوقين. عند استخدام PostgreSQL خارجي/مشترك استخدم حسابًا محدودًا وكلمة مرور محلية في .env واتبع إعداد الخادم بدل db:start/setup. لا تنسخ إعداد trust إلى خادم متاح للشبكة.

## أوامر التشغيل الفعلية من الجذر
تتوافق الأوامر التالية مع scripts الموجودة فعلًا. الاقتباس مهم لأن اسم المجلد يحوي مسافات.
```bash
cd '/home/user/Team Equipment Borrowing' # الانتقال إلى جذر المشروع الحالي؛ غيّر المسار عند نقل الحزمة
node --version # التأكد من نسخة Node المتوافقة قبل التثبيت
npm ci # تثبيت النسخ المقفلة في lockfile
cp .env.example .env # إنشاء الإعداد المحلي مرة واحدة فقط؛ لا تنفذه فوق إعدادك الموجود
npm run db:setup # تشغيل العنقود المحلي وإنشاء قاعدتي التطوير والاختبار الغائبتين دون reset
npm run prisma:generate # توليد Prisma Client بعد تثبيت الحزم
npm run prisma:validate # التحقق من صياغة النموذج والإعداد
npm run db:migrate # تطبيق تاريخ migrations على قاعدة التطوير المحددة
npm run db:test:migrate # تطبيق التاريخ على TEST_DATABASE_URL بعد التحقق من عزلها
npm run db:seed # إدخال البيانات الثابتة دون مسح التاريخ أو إعادة الرصيد
npm run api:dev # تشغيل Fastify في وضع التطوير مع مراقبة TypeScript
```

cp أمر إعداد يدوي مشروط بغياب .env، وليس جزءًا من اختبارات التطبيق. نُفذت أوامر package scripts فعليًا؛ أنشئت .env المحلية أثناء الإعداد بدل تشغيل cp فوقها. لا يعد هذا دليل تنفيذ cp نفسه.

```bash
npm run db:start # إعادة تشغيل العنقود المحلي الخاص بالمشروع إن كان موجودًا
npm run typecheck # فحص كل TypeScript بما فيه الاختبارات والإعداد
npm run test:unit # اختبارات البيئة والأخطاء الصرفة دون تغيير قاعدة التطوير
npm run test:integration # اختبارات Fastify/Prisma على TEST_DATABASE_URL الحقيقي فقط
npm test # تشغيل اختبارات Backend كلها
npm run build # إنتاج JavaScript في apps/api/build
npm run api:start # تشغيل ناتج build/server.js دون tsx
npm run db:stop # إيقاف العنقود المحلي بعد إيقاف API؛ لا ينفذ تلقائيًا بعد الاختبارات
```

لم يُنفذ db:stop على العنقود الحالي لأن API المعروض ما زال يستخدمه. المنفذ المعتمد 3001، وليس مثال 4000 في التكليف. GET /api/health يعيد حالة التطبيق دون أسرار؛ / ليس صفحة واجهة ويعيد 404 متعمدًا. server.ts يستمع على 0.0.0.0 ليسمح بالمعاينة، بينما PostgreSQL على loopback. SIGINT/SIGTERM يغلقان Fastify وPrisma؛ تحقق فعلي منفصل أثبت exit code 0.

## إعداد البيئة
.env الجذري يقرأ مرة مركزيًا في config/env.ts؛ dotenv لا يستبدل متغيرات النظام الممررة صراحة. NODE_ENV development/test/production، وAPI_PORT عدد صحيح 1–65535، وDATABASE_URL اتصال PostgreSQL صالح. API_BASE_URL وWEB_PORT في .env.example محفوظان لمرحلة Frontend ولا يُستخدمان حاليًا؛ لا NEXT_PUBLIC_DATABASE_URL أو secrets بالويب.

TEST_DATABASE_URL إلزامي للاختبارات ولا fallback إلى DATABASE_URL. يجب أن ينتهي اسم قاعدة الاختبار بـ_test ويكون schema=public وأن تختلف عن قاعدة التطوير على المضيف/المنفذ نفسيهما. قبل كل تنظيف تتحقق الاختبارات من current_database فعليًا. لا migrations أو deletes اختبارية على التطوير. الترحيل لا يحذف بيانات؛ cleanup في الاختبارات يحذف fixtures من القاعدة المعزولة فقط.

## Seed والمخطط والترحيلات
ثلاثة موظفين وأسماء عربية ثابتة وثلاثة أنواع: شاشة (2)، جهاز عرض (1)، محول (0). upsert بمعرفات UUID ثابتة وupdate فارغ. لا تكرار موظفين أو stock ولا حذف Loan، وتشغيله بعد Borrow يحافظ على الرصيد وبعد Return يحافظ على التاريخ. يرفض اختلاف إجمالي المعدات عن الإعداد بدل إعادة ضبطه.

النماذج حسب التصميم المعتمد: createdAt في Employee/Equipment؛ Loan له borrowedAt/returnedAt فقط، ولا updatedAt أو status/quantity غير لازم. لا تعديل صامت لإضافة الحقول التوضيحية في تكليف Phase 03.

الترحيل 202611180001_initial ينشئ الجداول وFK Restrict وNOT NULL وCHECKين والفهرس الجزئي وفهرس equipmentId. استخدم SQL مخصصًا للقيود والفهرس دون اعتماد preview feature، وهو مسار مصرح به في التصميم. مصدر replay هو migrations لا db push. لا تضف الفهرس ثانية في schema ولا تحذف SQL عند تطوير migration لاحقة. اختُبر replay على قاعدة جديدة مستقلة؛ فُحص pg_catalog واختُبرت القيود مباشرة.

## سياسة التعليقات والأمان
كل سطر authored TypeScript/Prisma/SQL/shell قابل للتعليق يحمل شرحًا عربيًا، مع فحص توثيقي لذلك. shebang توجيه نظام، وJSON/package-lock والملفات المولدة لا تُفسد بإضافة comments. package.json ينظم workspaces/scripts، وtsconfig يحدد الأنواع، وlockfile يقفل الشجرة؛ توثيقها هنا بدل JSON غير صالح. لا explicit any أو ts-ignore أو raw unsafe في المصادر المكتوبة. logging يسجل فئة الخطأ واسمه ورمزه داخليًا دون SQL أو كلمة مرور أو stack في الرد.

## حدود فحص الاعتماديات
npm audit --omit=dev نجح وقت التسليم بلا ثغرات مُبلّغ عنها في شجرة التشغيل. npm audit الكامل **لم ينجح**: خمس نتائج high في شجرة أدوات الاختبار (picomatch وتبعيات fdir/tinyglobby/Vite/Vitest). الإصدار الأعلى المتاح لـpicomatch حين الفحص ما زال مشمولًا في advisory؛ لم يُستخدم --force أو downgrade يُعيد ثغرات critical. لا Vitest UI أو dev test server معرض للشبكة؛ الاختبارات تعمل بوضع run محلي، لكن هذا لا يلغي التحذير. متابعة تحديث upstream وإعادة الفحص مطلوبة. راجع أدلة الفحص قبل اعتبار أي إصدار خاليًا من الثغرات مستقبلًا.
