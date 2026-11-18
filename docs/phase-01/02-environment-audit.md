# 02 — تدقيق بيئة التطوير

## تعريف التصنيفات
Verified: شوهد الدليل مباشرة. Partially Verified: تحقق جزء دون التوافق/التشغيل الكامل. Missing: ملف أو حزمة مشروع غير موجودة في الجذر المفحوص. Not Available: أداة غير ظاهرة في PATH أو خدمة محلية غير متاحة ضمن حدود الفحص. Not Applicable: لا ينطبق الفحص على أصل غير موجود. Unknown وNot Verified يصفان معلومات لم تثبت، ولا يعنيان أن التقنية غير موجودة على أي جهاز آخر.

| التقنية | الدليل الفعلي | التصنيف | الحدود والتوافق |
|---|---|---|---|
| Node.js | /usr/bin/node؛ v20.20.2 | Verified للإصدار؛ Partially Verified للجاهزية | لا manifests أو engines؛ توافق إصدارات الحزم المستقبلية Not Verified |
| npm | /usr/bin/npm؛ 10.8.2 | Verified | وجوده لا يثبت اختياره كمدير للمشروع |
| pnpm | command -v لم يجده | Not Available | Workspace configuration وlockfile: Missing؛ الإصدار Unknown |
| TypeScript | tsc غير متاح؛ لا package.json أو tsconfig | Missing في المشروع | الإصدار Unknown؛ لا typecheck |
| Next.js | next غير متاح؛ لا تطبيق أو إعداد | Missing في المشروع | الإصدار وApp Router Unknown |
| React | لا manifests أو حزم محلية | Missing في المشروع | الإصدار والتوافق مع Next.js Not Verified |
| Fastify | fastify غير متاح؛ لا تطبيق أو plugins موثقة | Missing في المشروع | CLI ليس مطلوبًا بحد ذاته؛ غياب التطبيق هو الدليل الأساسي |
| Prisma | prisma غير متاح؛ لا schema أو إعداد | Missing في المشروع | الإصدار والعميل المولد Unknown |
| PostgreSQL | psql وpostgres وpg_isready غير ظاهرة؛ TCP 127.0.0.1:5432 مرفوض | Not Available محليًا ضمن الفحص | لا دليل على إصدار خادم أو اعتماد اتصال أو قاعدة خارجية؛ كل ذلك Not Verified |
| Vitest | vitest غير ظاهر؛ لا إعداد أو اختبارات أو حزم | Missing في المشروع | الإصدار Unknown؛ لا tests منفذة |
| Docker | docker غير ظاهر؛ لا compose | Not Available للأداة؛ Missing للإعداد | daemon غير مفحوص؛ Docker وسيلة محلية محتملة لا شرط منتج |
| Git | /usr/bin/git؛ 2.47.3 | Verified للأداة | .git غير موجود داخل الجذر؛ لا تاريخ commits لفحصه |

## ما نُفذ بأمان
فحص PATH؛ أوامر --version للأدوات المتاحة؛ قراءة قائمة الملفات؛ محاولة فتح TCP ثم إغلاقه دون إرسال أوامر قاعدة بيانات. لم تُطبع متغيرات بيئة أو أسرار. لم تُبحث أجهزة المستخدم أو خدمات خارجية. رفض اتصال محلي واحد لا يثبت غياب PostgreSQL في كل مكان.

## الفجوات والإجراءات اللاحقة المشروطة
لا يمكن تثبيت مصفوفة توافق دون اختيار إصدارات الحزم في Phase 02 بعد الاعتماد. يجب مراجعة متطلبات engines والدعم للإصدارات المختارة بدل افتراض أن Node الحالي مناسب أو اختيار «الأحدث» بلا فحص. اختيار pnpm أو غيره وتوفير PostgreSQL محليًا قرارات معلقة. لا تثبيت pnpm أو Docker أو أي حزمة في هذه المرحلة. لم تُشغل npm install أو npx أو pnpm dlx أو Prisma generate أو migrations أو اختبارات.
