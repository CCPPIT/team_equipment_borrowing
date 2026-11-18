> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 05 — Non-Functional Requirements

| ID | Quality requirement | Acceptance evidence required in later phases |
|---|---|---|
| NFR-01 | Data consistency | Nonnegative availability, one active loan per employee/type, and stock/active-loan reconciliation hold after every tested operation |
| NFR-02 | Transaction safety | Integration tests demonstrate full rollback for both borrow and return failures |
| NFR-03 | Concurrency safety | Real PostgreSQL tests with overlapping requests preserve BR-10; tests cannot rely only on mocks or sequential requests |
| NFR-04 | Backend validation | Missing, malformed, unsupported, or nonexistent identities are rejected; return ownership and business eligibility are checked server-side |
| NFR-05 | Clear API errors | Expected failures have consistent HTTP status and stable machine-readable code plus readable message; raw database errors and stack traces are not exposed |
| NFR-06 | Frontend loading and pending states | Initial loading and action progress are visible; affected duplicate action controls are unavailable while pending; absence of employee selection blocks mutations |
| NFR-07 | Success and failure feedback | Successful actions and failed reads/mutations are distinguishable; failures do not falsely show a successful stock change |
| NFR-08 | Maintainable TypeScript | Web and API code is readable TypeScript with clear responsibilities and decisions documented; future line comments follow the owner's Arabic-comment instruction once clarified |
| NFR-09 | Separation of responsibilities | Web uses the HTTP REST API; database access and authoritative rules live behind the API using Prisma/PostgreSQL; web has no direct database credentials/access |
| NFR-10 | Repeatable local setup | Later README documents prerequisites, configuration placeholders, database preparation/seeding, app startup, and test commands; a clean local run follows those instructions |
| NFR-11 | Minimal monorepo organization | Standard repository organization separates apps/web and apps/api; no custom tooling or unnecessary shared UI package is introduced |

No numeric latency target, load target, availability SLA, production infrastructure requirement, or stress-test platform has been specified. No dependency installation, package edits, startup, or executable verification is part of Phase 00.

---

## النسخة العربية / Arabic version

# 05 — المتطلبات غير الوظيفية

| المعرّف | متطلب الجودة | دليل القبول المطلوب في المراحل اللاحقة |
|---|---|---|
| NFR-01 | اتساق البيانات | عدم سلبية المخزون وفرادة الاستعارة النشطة ومطابقة المخزون مع النشط بعد كل عملية مختبرة |
| NFR-02 | أمان المعاملات | اختبارات تكامل تثبت التراجع الكامل عند فشل الاستعارة وعند فشل الإرجاع |
| NFR-03 | أمان التزامن | اختبارات PostgreSQL حقيقية بطلبات متداخلة تحفظ BR-10؛ المحاكاة وحدها أو التنفيذ المتسلسل غير كافيين |
| NFR-04 | التحقق في الخلفية | رفض الهوية المفقودة أو المشوهة أو غير المدعومة أو غير الموجودة، والتحقق من تبعية الاستعارة وأهلية الإجراء خلفيًا |
| NFR-05 | وضوح أخطاء API | حالة HTTP متسقة ورمز آلي ثابت ورسالة مفهومة للأخطاء المتوقعة؛ دون كشف أخطاء قاعدة البيانات الخام أو تتبع التنفيذ |
| NFR-06 | حالات التحميل والانتظار | إظهار التحميل والتقدم وتعطيل الإجراء المتأثر أثناء انتظاره، ومنع التعديل دون موظف محدد |
| NFR-07 | تغذية راجعة للنجاح والفشل | تمييز نجاح العملية وفشل القراءة أو التعديل، وعدم عرض تغيير مخزون وهمي عند الفشل |
| NFR-08 | TypeScript قابل للصيانة | كود واضح ومسؤوليات منفصلة وقرارات موثقة؛ تطبيق تعليمات التعليقات العربية لاحقًا بعد توضيحها |
| NFR-09 | فصل المسؤوليات | الواجهة تتواصل عبر HTTP REST؛ الوصول إلى البيانات والقواعد الملزمة خلف API باستخدام Prisma/PostgreSQL؛ لا وصول مباشر أو بيانات اعتماد قاعدة البيانات في الواجهة |
| NFR-10 | إعداد محلي قابل للتكرار | README لاحق يوضح المتطلبات والإعدادات النموذجية وتجهيز البيانات الأولية وتشغيل التطبيقات والاختبارات؛ يمكن اتباعه من بيئة نظيفة |
| NFR-11 | تنظيم بسيط للمستودع الموحد | فصل apps/web عن apps/api بأدوات معتادة دون أدوات مخصصة أو مكتبة واجهات مشتركة غير لازمة |

لم تُحدد أهداف زمن استجابة أو حمل أو اتفاقية إتاحة أو بنية إنتاجية أو منصة اختبار ضغط. لا تشمل المرحلة 00 تثبيت تبعيات أو تعديل حزم أو تشغيل التطبيق أو التحقق التنفيذي منه.
