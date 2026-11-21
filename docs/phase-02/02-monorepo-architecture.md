# 02 — تصميم المستودع الموحد

## القرار المقترح
npm Workspaces لتطبيقين لأن npm 10.8.2 متاح فعليًا وpnpm غير متاح في التدقيق. لا حاجة لتثبيت مدير حزم آخر أو pnpm-workspace.yaml مع npm. هذا اختيار تصميم لا ملف أُنشئ. يُحفظ اسم الجذر الحالي مع اقتباس المسار عند التشغيل. لا packages/ مشتركة حاليًا.

> **تحديث 2026-11-19 (سحب الاستخراج):** أُنشئت `packages/contract` باسم `@team/contract` بعد تثبيت التكرار الفعلي. تقتصر على DTO ونصوص رموز الأخطاء العربية ومغلفات Success/Failure ومعرّفات البذر الثابتة؛ لا تحمل أي منطق أعمال ولا تُستورد من واجهة العرض إلا كأنواع وقيم نقية. يُبنى قبل الطرفين (`contract:build`) ويُستهلك كـ `dist/` مُصرَّح. استُخرِجت الأنواع والمعرّفات من `apps/web/src/types/api.ts` (أُزيل) ومن `apps/api/src/lib/errors.ts` ومن `apps/api/src/services/seed-data.ts`، وأصبحت `apps/web/src/lib/api-client.ts` تفرض اكتمال سجل رسائلها عبر `Record<ClientErrorCode, string>` وقت الترجمة.

| المسار المخطط | المسؤولية |
|---|---|
| package.json وpackage-lock.json في الجذر | workspaces apps/* وscripts معتادة ونسخ dependencies مقفلة بعد اعتماد التوافق |
| apps/web/package.json | Next.js وReact وTypeScript واعتماديات اختبار الواجهة فقط |
| apps/web/src/app/layout.tsx وpage.tsx | layout ثابت وصفحة واحدة تستضيف feature العميل |
| apps/web/src/features/borrowing/ | BorrowingScreen ومكونات الشاشة وhook الحالة واختباراتها؛ لا features فارغة لكل مفهوم |
| apps/web/src/lib/api-client.ts | fetch النسبي وفحص envelope وتحويل الأخطاء |
| apps/web/src/types/api.ts | DTO فقط وفق العقد؛ لا Prisma generated types |
| apps/web/next.config.* | rewrite /api/* نحو API_BASE_URL الخاص بالخادم |
| apps/api/src/app.ts | بناء Fastify دون listen ليسهل inject في الاختبارات |
| apps/api/src/server.ts | قراءة الإعداد والتشغيل والإغلاق المنظم |
| apps/api/src/routes/ | employees/equipment/loans؛ handlers صغيرة تقوم بدور controller |
| apps/api/src/schemas/ | JSON Schema للمدخلات والمخرجات؛ رفض unknown fields دون حذفها بصمت |
| apps/api/src/services/ | القراءة وBorrow/Return ومعاملاتهما |
| apps/api/src/lib/ | Prisma singleton وإعدادات environment وأنواع أخطاء المجال ومعالجها |
| apps/api/prisma/schema.prisma | النموذج الفعلي لاحقًا فقط |
| apps/api/prisma/migrations/ | التاريخ الكامل للترحيلات بما فيه SQL القيود المخصصة |
| apps/api/prisma/seed.ts | بيانات محلية قابلة لإعادة التشغيل دون reset |
| apps/api/tests/unit وintegration وapi | فحوص منفصلة واضحة واختبارات PostgreSQL الفعلية |
| docs/phase-00 وphase-01 وphase-02 | المتطلبات والتدقيق والتصميم |
| .env.example و.env محلي غير متعقب | مثال إعداد بلا أسرار؛ يُحمّل إلى العمليات صراحة لا بافتراض بحث تلقائي |
| docker-compose.yml اختياري لاحقًا | PostgreSQL للتطوير فقط إن توفرت Docker؛ مسار native مكافئ دون خدمات إضافية |
| README.md | أوامر إعداد وتشغيل واختبار موثقة عند التنفيذ |

## بساطة التنظيم ومشاركة الأنواع
لا repositories عامة أو DI framework أو controllers/plugins directories فارغة. إضافة plugin مبررة فقط إذا احتاجت إدارة دورة اتصال؛ Prisma lib كافٍ هنا. خدمة تستقبل عميل tx في العملية لا تنشئ transaction متداخلة. مشاركة DTO صغيرة يدويًا بين الطرفين مع اختبارات العقد أفضل هنا من shared package يضيف بناءً وتشابكًا. لا import من API source إلى web ولا من Prisma إلى web. عند ظهور تكرار حقيقي يمكن إعادة تقييم مشاركة الأنواع بقرار لاحق.

كل المسارات السابقة **خريطة مستقبلية**. لم يُنشأ apps أو package أو env أو compose أو schema في هذه المرحلة. الفصل لا يفرض تشغيلًا إنتاجيًا أو أدوات monorepo مخصصة.
