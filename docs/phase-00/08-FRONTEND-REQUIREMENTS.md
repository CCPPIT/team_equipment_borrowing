> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 08 — Frontend Requirements

## Required interface
One employee selector and one equipment list are sufficient. Each equipment entry displays distinguishing information, available units, and the selected employee's active borrowing state. Offer Borrow when eligible and Return for the selected employee's active loan. No administrative screens or elaborate styling are needed.

## Interaction and state requirements
| State | Required visible behavior | Acceptance check |
|---|---|---|
| Initial loading | Show progress while employees and selected-context equipment load; do not show fabricated zero stock | Delayed reads show loading rather than an actionable empty/default balance |
| No selected employee | Ask for a selection; no borrow or return request is sent | Controls cannot mutate without an employee identity |
| Empty equipment list | Explain that no equipment is available in the catalog; distinguish from all types having zero stock | Successful empty response shows an empty state, not a read error |
| Empty employee list | Explain that there are no seeded employees to select; no creation flow | No mutation is possible; this is not presented as an equipment failure |
| Data loading failure | Show readable failure and a way to retry/reload the read | Failed employee/equipment read is distinguishable from empty data |
| Action in progress | Show pending state for affected action and prevent duplicate clicks while awaiting result | Multiple clicks do not create multiple UI-originated submissions for the pending action |
| Validation error | Explain invalid/missing input without changing displayed data as though committed | API validation message is presented in a readable form |
| Successful borrowing | Show success and update/refetch availability and active state | Available count decreases and Return replaces the eligible Borrow action without a page reload |
| Successful return | Show success and update/refetch availability and active state | Availability increases once; eligible Borrow is offered again |
| Failed action | Show failure; retain or refetch authoritative state rather than pretending success | Conflict or server failure never leaves an invented successful loan/return |
| Post-success refresh failure | Distinguish committed action from stale display; allow refresh retry | Message says action succeeded but fresh data could not load; do not encourage repeating the mutation |

## State ownership and switching
Key equipment/loan state by selected employee identity. Capture employee context when starting requests. If the selection changes, ignore or segregate obsolete responses so employee A's loan cannot appear as employee B's. A pending mutation remains associated with its original employee even if the selector changes. Either temporarily disable switching during a mutation or explicitly manage per-employee request state; exact technique is a later implementation decision.

Backend rules remain decisive. Disabled controls are usability safeguards, not concurrency protection. Zero stock must not disable Return for an existing active loan. A type borrowed by another employee is not marked as borrowed by the selected employee. No full page reload is required; refetching relevant data is acceptable. No frontend state library is mandated.

---

## النسخة العربية / Arabic version

# 08 — متطلبات الواجهة الأمامية

## الواجهة المطلوبة
يكفي محدد موظف وقائمة معدات. يعرض كل عنصر معلومات تميزه وعدد الوحدات المتاحة وحالة الموظف المحدد. يُتاح زر الاستعارة عند الأهلية وزر الإرجاع للاستعارة النشطة لذلك الموظف. لا شاشات إدارة أو تنسيق معقد.

| الحالة | السلوك المرئي المطلوب | فحص القبول |
|---|---|---|
| التحميل الأولي | إظهار تقدم تحميل الموظفين والمعدات وعدم اختلاق مخزون صفري | تأخر القراءة يظهر تحميلًا لا رصيدًا افتراضيًا قابلًا للإجراء |
| لا موظف محدد | طلب اختيار موظف وعدم إرسال استعارة أو إرجاع | لا تعديل دون هوية مختارة |
| قائمة معدات فارغة | بيان غياب أنواع المعدات وتمييزه عن وجود أنواع نافدة | النجاح بقائمة فارغة لا يظهر كخطأ قراءة |
| قائمة موظفين فارغة | بيان عدم وجود موظفين أوليين دون إنشاء مسار لإضافتهم | منع التعديل وعدم اعتباره فشل معدات |
| فشل تحميل البيانات | رسالة مفهومة وطريقة لإعادة محاولة القراءة | تمييز الخطأ عن القائمة الفارغة |
| إجراء جارٍ | إظهار الانتظار ومنع تكرار نقر الإجراء المتأثر | النقر المتكرر لا يرسل عدة طلبات للإجراء المنتظر |
| خطأ تحقق | توضيح المدخلات الخاطئة أو المفقودة دون إظهار نجاح | عرض رسالة API مفهومة |
| نجاح الاستعارة | رسالة نجاح وتحديث المتاح والحالة أو إعادة جلبهما | ينقص المتاح ويظهر الإرجاع بدل الاستعارة المؤهلة دون إعادة تحميل الصفحة |
| نجاح الإرجاع | رسالة نجاح وتحديث المتاح والحالة أو إعادة جلبهما | يزيد المتاح مرة وتُتاح الاستعارة مجددًا عند الأهلية |
| فشل الإجراء | إظهار الفشل والإبقاء على الحالة الموثوقة أو جلبها | لا يترك التعارض أو الفشل نجاحًا وهميًا |
| فشل التحديث بعد النجاح | تمييز العملية المثبتة عن البيانات القديمة وإتاحة إعادة الجلب | توضيح أن الإجراء نجح لكن تعذر تحديث العرض، دون تشجيع تكرار التعديل |

## إدارة الحالة وتبديل الموظف
تُربط بيانات المعدات والاستعارات بهوية الموظف المحدد، ويُحفظ سياق الطلب عند بدء إرساله. عند تغير الاختيار تُهمل الردود القديمة أو تُعزل كي لا تظهر بيانات A كأنها تخص B. يبقى التعديل الجاري مرتبطًا بموظفه الأصلي. يمكن تعطيل تبديل الموظف مؤقتًا أثناء التعديل أو إدارة حالة الطلب لكل موظف صراحة؛ التقنية الدقيقة قرار لاحق.

الخلفية هي المرجع النهائي. تعطيل الأزرار إجراء قابلية استخدام وليس حماية تزامن. المخزون الصفري لا يعطل إرجاع استعارة نشطة. استعارة موظف آخر لا تظهر كأنها للموظف المحدد. لا يلزم تحميل كامل للصفحة؛ إعادة جلب البيانات كافية، ولا تُفرض مكتبة إدارة حالة.
