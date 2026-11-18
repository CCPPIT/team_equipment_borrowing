# التشغيل وإعادة التحقق
من جذر المشروع، استخدم Node 22.22.2 أو إصدارًا يحقق engines للواجهة وnpm Workspaces.

```sh
npm ci
npm run prisma:generate
cp apps/web/.env.local.example apps/web/.env.local
npm run api:dev
# في نافذة أخرى
npm run web:dev
```
إعداد backend وقاعدة البيانات في وثائق Phase03؛ لا تنسخ `.env` الجذري إلى الواجهة. `apps/web/.env.local` يحتوي `WEB_PORT=3000` و`API_BASE_URL=http://127.0.0.1:3001` فقط. API_BASE_URL إعداد خادم وليس NEXT_PUBLIC؛ المتصفح يتصل بمسارات `/api` النسبية ويعيد Next توجيهها إلى backend. قاعدة البيانات لا تصل للمتصفح. الخادم يستمع على 0.0.0.0 لدعم المعاينة.

```sh
npm run web:typecheck
npm run web:lint
npm run web:test
npm run web:build
npm run web:start
```
حدد API_BASE_URL الصحيح عند **البناء أيضًا** لأن rewrites تحفظ في بناء Next، وأعد البناء عند تغييره. لا تشغّل بناء 3004 الاختباري كإعداد إنتاج. ملف `.env.local` تقرؤه Next عند البناء وسكربت التشغيل عند dev/start.

## المتصفح وبيئة الاختبار
```sh
npm exec -w @team/web -- playwright install --with-deps chromium
RUN_LIVE_API=1 npm run web:test:browser
```
لا يطلق الاختبار API تلقائيًا ولا ينظف قاعدة بيانات. يجب توفير Next مبنيًا على API اختباري معزول. السكربت يطلب بيانات fixture الموجودة في قاعدة Phase03 الاختبارية (أ، ب، متعدد، أخير، نافد)؛ يمكن تجهيزها بتشغيل اختبارات backend المعزولة أولًا. راجع حارس TEST_DATABASE_URL في Phase03 ولا تستخدم قاعدة تطوير/إنتاج.

بيئة الإثبات الفعلية: backend غير معدل عبر `NODE_ENV=test API_PORT=3004 DATABASE_URL=<اتصال team_equipment_test> node apps/api/build/server.js`؛ بناء Next مع `API_BASE_URL=http://127.0.0.1:3004 npm run web:build`؛ ثم `API_BASE_URL=http://127.0.0.1:3004 WEB_PORT=3000 npm run web:start`. `WEB_TEST_URL` يغير عنوان Next المستهدف للمتصفح. RUN_LIVE_API موافقة تشغيل صريحة؛ بدونه اختبارات المتصفح SKIP وليست إثبات نجاح.

اختبار B01 يتحقق من المخزون قبل وبعد ويحاول إرجاع الاستعارة في finally إن توقف التدفق. لا يحذف السجل التاريخي ولا يعيد ضبط أي قاعدة. لا تشغّل اختبارات backend التي تنظف قاعدة الاختبار بالتزامن معه. معاينة الجلسة الحالية على قاعدة اختبار وليست بيانات إنتاج، وقد تعيد الاختبارات تشكيل بياناتها.
