# 11 — سجلات القرارات المعمارية ADR

الحالة العامة: **مقترح للاعتماد، غير مطبق**. تفاصيل القرارات قابلة للمراجعة قبل Phase 03. ADR-003 وتوافق أدوات ADR-010 يظلان مفتوحين في أرقام النسخ والإعدادات المرتبطة بها. لا يُقدم نقص المعلومات كقرار إصدار نهائي.

## ADR-001: Monorepo Structure
- **Context — السياق:** تطبيقان صغيران ووثائق واحدة؛ npm متاح وpnpm غير متاح.
- **Problem — المشكلة:** تنظيم التنفيذ دون أدوات زائدة.
- **Options Considered — البدائل:** npm workspaces؛ pnpm؛ custom tooling.
- **Decision — القرار المقترح:** npm Workspaces وتطبيقان apps/web وapps/api دون packages مشتركة.
- **Reasons — الأسباب:** يستخدم المتاح ويحقق الفصل المطلوب بأقل إعداد.
- **Trade-offs — التنازلات:** ربما تُكرر DTO صغيرة بدل بناء حزمة مشتركة.
- **Consequences — النتائج:** root lockfile واحد واختبارات عقد تمنع الانحراف.

## ADR-002: Frontend and Backend Separation
- **Context — السياق:** التقنيات مفروضة وDB يجب أن تكون خلف API.
- **Problem — المشكلة:** منع تكرار منطق الاستعارة وتسريب الاتصال.
- **Options Considered — البدائل:** Next full-stack؛ Fastify منفصل مع direct browser origin؛ proxy نسبي.
- **Decision — القرار المقترح:** Fastify للقواعد وNext.js للعرض وrewrite نقل فقط.
- **Reasons — الأسباب:** فصل واضح وعمل عبر origin واحد وpreview.
- **Trade-offs — التنازلات:** عملية server إضافية للتطوير لكنها مطلوبة بالتكليف.
- **Consequences — النتائج:** لا Prisma بالويب ولا business logic بالـproxy.

## ADR-003: Prisma and PostgreSQL
- **Context — السياق:** Stack مقرر ولا حزم مثبتة.
- **Problem — المشكلة:** إدارة persistence ونسخ متوافقة دون ادعاء تثبيت.
- **Options Considered — البدائل:** التقنيات المقررة؛ استبدالها خارج النطاق؛ اختيار major مختلف.
- **Decision — القرار المقترح:** Prisma/PostgreSQL؛ exact versions OPEN-VERSION ومرجع interactive API هو v7.
- **Reasons — الأسباب:** مطابقة التكليف والاستفادة من constraints وtransactions.
- **Trade-offs — التنازلات:** native SQL محدود للقفل وبعض القيود، وتوافق النسخ يحتاج تحققًا.
- **Consequences — النتائج:** لا قرار patch نهائي؛ مراجعة engines وdriver/migration قبل التنفيذ.

## ADR-004: Database Relationship Design
- **Context — السياق:** الوحدة تمثل نوعًا لا serial؛ التاريخ إلزامي.
- **Problem — المشكلة:** تمثيل الحالة دون تناقض أو حذف التاريخ.
- **Options Considered — البدائل:** status مخزن مع returnedAt؛ سجل قابل لإعادة الاستخدام؛ سجل مستقل لكل دورة.
- **Decision — القرار المقترح:** Employee/Equipment/Loan؛ returnedAt وحده يحدد النشاط وإجمالي/متاح محفوظان.
- **Reasons — الأسباب:** أقل كيانات ولا ازدواج حالة ويسمح بتاريخ متعدد.
- **Trade-offs — التنازلات:** حفظ المتاح يتطلب مصالحة وحماية معاملة بين جدولين.
- **Consequences — النتائج:** لا حذف Loan ولا إعادة تنشيطه؛ لا quantity وstatus زائدين.

## ADR-005: Active Loan Uniqueness
- **Context — السياق:** نشط واحد للزوج مع تكرار مكتمل.
- **Problem — المشكلة:** unique العام يمنع إعادة الاستعارة.
- **Options Considered — البدائل:** فحص تطبيق فقط؛ unique عام؛ partial unique.
- **Decision — القرار المقترح:** فهرس PostgreSQL فريد للزوج WHERE returnedAt IS NULL.
- **Reasons — الأسباب:** يفرض القاعدة ويحفظ تاريخًا غير محدود بالدورات.
- **Trade-offs — التنازلات:** تمثيل Prisma يعتمد على الإصدار؛ migration SQL عند الحاجة.
- **Consequences — النتائج:** فحص replay وpg_catalog؛ violation معروف يتحول 409 بعد rollback.

## ADR-006: Inventory Transaction Strategy
- **Context — السياق:** Borrow/Return يغيران سجلين.
- **Problem — المشكلة:** منع الكتابة الجزئية.
- **Options Considered — البدائل:** كتابتان مستقلتان؛ تعويض لاحق؛ interactive transaction.
- **Decision — القرار المقترح:** transaction قصيرة واحدة لكل عملية وكل الاستعلامات تستخدم tx.
- **Reasons — الأسباب:** ذرية وبساطة وrollback آلي عند throw.
- **Trade-offs — التنازلات:** يجب ألا تتضمن network calls أو catch يحول الفشل لنجاح.
- **Consequences — النتائج:** اختبارات فشل بين الكتابتين لكلتا العمليتين.

## ADR-007: Concurrency Control
- **Context — السياق:** تنافس آخر وحدة وتكرار Borrow/Return.
- **Problem — المشكلة:** حماية المخزون وحالة الاستعارة معًا.
- **Options Considered — البدائل:** conditional update مع constraints؛ Serializable مع retries؛ قفل Equipment موحد.
- **Decision — القرار المقترح:** ReadCommitted + row lock للنوع قبل الفحوص المتغيرة وconstraints؛ لا retry تلقائي.
- **Reasons — الأسباب:** ترتيب واحد يمكن شرحه واختباره دون distributed coordination.
- **Trade-offs — التنازلات:** تسلسل عمليات النوع نفسه وraw SQL parameterized محدود.
- **Consequences — النتائج:** إعادة قراءة Loan بعد القفل و409 للتعارض المؤكد؛ ambiguous commit يعالج بالـrefetch.

## ADR-008: REST API Contract
- **Context — السياق:** عمليات أساسية محدودة ومحدد موظف seeded.
- **Problem — المشكلة:** عقد واضح وتغذية راجعة ثابتة.
- **Options Considered — البدائل:** routes دون prefix؛ /api prefix؛ تضمين الموظفين في list equipment.
- **Decision — القرار المقترح:** المسارات الأربع والعقود في 06، مع success/data أو success/error.
- **Reasons — الأسباب:** قراءة الموظفين مستقلة عن employee selection وعقد سهل الاختبار.
- **Trade-offs — التنازلات:** تكرار Return هو 409 لا نجاح idempotent؛ قرار واضح للمستهلك.
- **Consequences — النتائج:** لا مسارات إدارية أو history UI؛ إخفاء DB details.

## ADR-009: Frontend State Management
- **Context — السياق:** صفحة واحدة وحالة موظف وطلبات متأخرة.
- **Problem — المشكلة:** حماية UI دون مكتبة غير لازمة.
- **Options Considered — البدائل:** React state/refetch؛ query library؛ optimistic updates.
- **Decision — القرار المقترح:** React state + fetch + tokens + ref guard، وتعطيل الاختيار أثناء mutation.
- **Reasons — الأسباب:** بسيط ويقلل rollback UI ولا يخلط موظفين.
- **Trade-offs — التنازلات:** refetch يزيد قراءة، وتعطيل مؤقت أوسع من زر واحد.
- **Consequences — النتائج:** لا optimistic updates؛ منع mutations حتى نجاح refresh عند stale state.

## ADR-010: Testing Strategy
- **Context — السياق:** لا أدوات موجودة ولا اختبارات منفذة.
- **Problem — المشكلة:** إثبات القواعد وSQL behavior والواجهة.
- **Options Considered — البدائل:** mock-only؛ PostgreSQL integration؛ عدة runners؛ runner موحد.
- **Decision — القرار المقترح:** Vitest مقترح وFastify inject وPostgreSQL وRTL/jsdom للواجهة؛ النسخ مفتوحة.
- **Reasons — الأسباب:** أدوات لكل حاجة مباشرة دون منصة ضغط.
- **Trade-offs — التنازلات:** DB fixtures واتصالات متعددة تكلف إعدادًا لكن لا بديل لإثبات locks.
- **Consequences — النتائج:** اختبار migrations والقيود وrollback والتزامن والـDOM؛ الصفر الحالي ليس نجاحًا.

