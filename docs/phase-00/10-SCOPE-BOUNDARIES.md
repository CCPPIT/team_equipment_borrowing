> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 10 — Scope Boundaries

## Included product scope
Seeded employee selection; equipment-type list and information; availability; selected employee's active loans; exactly-one-unit borrowing; single-effect returns; repeated borrowing cycles; persistent history; atomic and concurrency-safe backend behavior; REST integration; frontend state/feedback; automated verification and repeatable local setup in later implementation phases.

## Explicit exclusions
The following must not be introduced unless the company explicitly changes the assignment:

- Authentication.
- Employee management.
- Equipment creation.
- Stock administration screens.
- Serial number tracking.
- Due dates.
- Fines.
- Reservations.
- Notifications.
- Background workers.
- Message queues.
- Distributed systems.
- Stress-testing infrastructure.
- Production deployment.
- CI pipelines.
- Elaborate styling.
- Custom monorepo tooling.
- Unnecessary shared component libraries.

History persistence is included; a dedicated history screen, history-list API, or standalone audit service is not required. Employee seed listing is not employee management. Local database setup is not production deployment. Small deterministic concurrency integration tests are not a stress-testing platform.

## Technology boundaries
Frontend: Next.js + React + TypeScript. Backend: Fastify + TypeScript. ORM: Prisma. Database: PostgreSQL. Repository: monorepo. API: HTTP REST. Suggested later structure: apps/web and apps/api plus README.md. The empty application folders are intentionally not scaffolded in this documentation-only phase. No extra service or framework is needed.

## Phase 00 restrictions
Only documentation is delivered. No application code, dependency installs, package-file edits, schemas, migrations, endpoint implementation, frontend components, or Phase 01 work. The workspace was empty at inspection; no existing repository was modified. Project-owner approval is required before any next phase.

---

## النسخة العربية / Arabic version

# 10 — حدود النطاق

## المشمول في المنتج
اختيار الموظفين المُدخلين مسبقًا؛ عرض أنواع المعدات ومعلوماتها والمتاح؛ استعارات الموظف المحدد النشطة؛ استعارة وحدة؛ إرجاع ذو أثر واحد؛ تكرار الدورات؛ حفظ التاريخ؛ خلفية ذرية وآمنة عند التزامن؛ REST؛ حالات الواجهة ورسائلها؛ تحقق آلي وإعداد محلي قابل للتكرار في المراحل البرمجية اللاحقة.

## الاستبعادات الصريحة
لا تُضاف العناصر التالية إلا إذا غيّرت الشركة التكليف صراحة:
- المصادقة.
- إدارة الموظفين.
- إنشاء المعدات.
- شاشات إدارة المخزون.
- تتبع الأرقام التسلسلية.
- تواريخ الاستحقاق.
- الغرامات.
- الحجوزات.
- الإشعارات.
- العمال الخلفيون.
- طوابير الرسائل.
- الأنظمة الموزعة.
- بنية اختبارات الضغط.
- النشر الإنتاجي.
- خطوط التكامل المستمر CI.
- التنسيق البصري المعقد.
- أدوات مخصصة للمستودع الموحد.
- مكتبات مكونات مشتركة غير ضرورية.

حفظ التاريخ مشمول لكن لا تُطلب شاشة تاريخ أو API مخصصة له أو خدمة تدقيق. قراءة الموظفين الأوليين ليست إدارة موظفين. تجهيز قاعدة محلية ليس نشرًا إنتاجيًا. اختبارات التزامن الصغيرة المحددة ليست منصة ضغط.

## حدود التقنيات
الواجهة Next.js + React + TypeScript؛ الخلفية Fastify + TypeScript؛ ORM هو Prisma؛ القاعدة PostgreSQL؛ مستودع موحد؛ HTTP REST. الهيكل المقترح لاحقًا apps/web وapps/api مع README.md. لم تُنشأ مجلدات التطبيقات الفارغة في هذه المرحلة التوثيقية. لا حاجة لإطار أو خدمة إضافية.

## قيود المرحلة 00
المسموح توثيق فقط: لا كود تطبيق أو تثبيت تبعيات أو تعديل حزم أو مخططات أو ترحيلات أو تنفيذ endpoints أو مكونات واجهة أو عمل للمرحلة 01. كانت مساحة العمل فارغة عند الفحص الأول، ولم يُعدل مستودع سابق. الانتقال يتطلب موافقة المالك. تحديث اللغتين الحالي تعديل توثيق داخل المرحلة نفسها وليس بدء مرحلة أخرى.
