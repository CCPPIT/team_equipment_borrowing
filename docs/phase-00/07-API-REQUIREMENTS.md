> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 07 — API Requirements

HTTP REST is required. Names and status choices below are **proposed contracts for Phase 01 approval**, not existing endpoints or company-mandated route spellings. No endpoints are implemented. Conceptual field names do not establish database schema.

## Shared contract expectations
Validate input structure, unknown properties, identifier syntax according to the eventual identifier format, referenced resources, and business rules on the backend. Client state is never authoritative. Proposed errors contain a stable `code` and readable `message`; field details may accompany validation errors. No internal database details should escape.

Proposed statuses: 400 for invalid input; 404 for a well-formed missing referenced resource or a loan not belonging to the supplied employee (same external treatment); 409 for state conflicts; 500 for an unexpected internal failure after rollback. A syntactically valid but nonexistent employee is not silently treated as an empty borrowing state. No authentication status codes or authentication mechanism are required. Exact error wording is not fixed.

| Operation and proposed route | Purpose | Required input | Expected success response | Validation | Possible failures and status categories |
|---|---|---|---|---|---|
| List employees — GET /employees | Populate selector from seeded data; supporting operation implied by FR-01 | None | 200; employee list with stable ID and display name; empty list allowed | No employee mutation inputs | 5xx persistence failure; 4xx malformed unsupported request inputs under final contract |
| List equipment — GET /equipment?employeeId=… | Return types, current stock, selected employee's active state | Selected employee ID | 200; list containing equipment identity/name, available count, and matching active loan identity or absence; empty list allowed | Required ID present, valid and existing | 400 missing/malformed input; 404 employee absent; 5xx database/internal failure |
| Borrow — POST /loans | Borrow exactly one unit | Selected employee ID and equipment-type ID | Proposed 201; new active loan identity, employee/type references and borrowing time; UI may refetch stock/state | Both resources exist; no quantity input; no matching active loan; positive stock; atomic/concurrent enforcement | 400 malformed/missing/unknown input including quantity; 404 resource absent; 409 duplicate active loan or no stock; 5xx unexpected failure with rollback |
| Return — POST /loans/{loanId}/return | Complete selected employee's active loan | Loan ID in path; selected employee ID in body | Proposed 200; same loan identity with completion information; UI may refetch stock/state | Employee exists; loan exists and belongs to supplied employee; loan still active under transactional protection | 400 invalid input; 404 employee/loan absent or ownership mismatch; 409 already returned; 5xx unexpected failure with rollback |

## Consistency and UI integration
List results must represent committed state with internally consistent availability and active status, not a mixture from different moments. Reads are observations, not reservations: another employee may consume stock before a later action. Such races must become safe conflicts, not negative inventory.

Only a committed operation produces a success response. On conflict the UI may refetch authoritative data; errors never imply that stock was changed. After success, relevant equipment/state refetch is sufficient; stock need not be included in mutation responses. A failure of that refetch must be distinguished from failure of the already committed mutation.

An uncertain network outcome does not justify blindly repeating a borrow. Refetch first; durable request-id/idempotency infrastructure is not added. Repeating a return is protected against extra stock increments. Selection is not authentication: ownership validation is a data-consistency check, not a claim that one user cannot impersonate another selector choice.

---

## النسخة العربية / Arabic version

# 07 — متطلبات الواجهة البرمجية API

المطلوب HTTP REST. الأسماء والحالات التالية **عقود مقترحة لاعتمادها في المرحلة 01** وليست مسارات منفذة أو أسماء فرضتها الشركة. أسماء الحقول مفاهيمية وليست مخطط قاعدة بيانات.

## التوقعات المشتركة
التحقق خلفيًا من بنية المدخلات والخصائص غير المعروفة وصيغة المعرفات حسب التصميم اللاحق ووجود الموارد وقواعد العمل. حالة العميل ليست مرجعًا ملزمًا. يتضمن الخطأ المقترح `code` ثابتًا و`message` مفهومة، ويمكن إرفاق تفاصيل الحقول. لا تُكشف التفاصيل الداخلية لقاعدة البيانات.

الحالات المقترحة: 400 للمدخلات غير الصالحة؛ 404 لمورد غير موجود بمعرّف سليم أو لاستعارة لا تخص الموظف المرسل، بالمعاملة الخارجية نفسها؛ 409 لتعارض الحالة؛ 500 لفشل داخلي غير متوقع بعد التراجع. الموظف غير الموجود لا يعامل كأنه بلا استعارات. لا حاجة لمصادقة أو رموز أخطاء مصادقة، ولا تُفرض صياغة حرفية للرسائل.

| العملية والمسار المقترح | الغرض | المدخلات المطلوبة | استجابة النجاح | التحقق | الأخطاء وفئات HTTP |
|---|---|---|---|---|---|
| قائمة الموظفين GET /employees | تعبئة المحدد من البيانات الأولية؛ داعمة لـ FR-01 | لا شيء | 200؛ قائمة معرّفات وأسماء، وقد تكون فارغة | لا مدخلات لتعديل الموظفين | 5xx لفشل التخزين؛ 4xx لمدخلات طلب مشوهة أو غير مدعومة حسب العقد النهائي |
| قائمة المعدات GET /equipment?employeeId=… | الأنواع والمتاح وحالة الموظف المحدد | معرّف الموظف المحدد | 200؛ معرّف واسم النوع والمتاح ومعرّف الاستعارة النشطة المطابقة أو عدم وجودها؛ يمكن أن تفرغ القائمة | وجود المعرّف وصحته ووجود الموظف | 400 للمدخلات؛ 404 لموظف غير موجود؛ 5xx لفشل داخلي أو قاعدة البيانات |
| استعارة POST /loans | استعارة وحدة واحدة | معرّف الموظف ومعرّف نوع المعدات | المقترح 201؛ هوية الاستعارة النشطة ومراجعها ووقتها؛ يمكن إعادة جلب حالة المخزون | وجود الموردين، وعدم قبول الكمية، وعدم وجود استعارة نشطة مطابقة، ومخزون موجب، وحماية ذرية ومتزامنة | 400 للمفقود أو المشوه أو غير المعروف بما فيه الكمية؛ 404 لمورد غائب؛ 409 للتكرار أو النفاد؛ 5xx مع التراجع |
| إرجاع POST /loans/{loanId}/return | إكمال استعارة الموظف المحدد | معرّف الاستعارة في المسار ومعرّف الموظف في جسم الطلب | المقترح 200؛ هوية السجل نفسها مع معلومات الإكمال؛ يمكن إعادة الجلب | وجود الموظف والسجل وتبعيته له وبقاؤه نشطًا تحت حماية المعاملة | 400 للمدخلات؛ 404 للغياب أو عدم تطابق الموظف؛ 409 للإرجاع السابق؛ 5xx مع التراجع |

## الاتساق والربط بالواجهة
يجب أن تعرض قراءة القائمة حالة مثبتة ومتسقة داخليًا، لا مخزونًا من لحظة وحالة استعارة من لحظة أخرى. القراءة ملاحظة وليست حجزًا؛ قد تستهلك عملية أخرى المخزون قبل الإجراء، وعندها ينتج تعارض آمن لا رصيد سالب.

لا تُرسل استجابة نجاح قبل تثبيت العملية. يمكن للواجهة إعادة الجلب عند التعارض، والخطأ لا يعني تغير المخزون. تكفي إعادة جلب البيانات ذات الصلة بعد النجاح؛ ليس ضروريًا تضمين المخزون في استجابة التعديل. يجب تمييز فشل إعادة الجلب عن فشل العملية التي ثبتت بالفعل.

عند غموض نتيجة الشبكة لا تُكرر الاستعارة عشوائيًا، بل تُجلب الحالة أولًا. لا تُضاف بنية مفاتيح طلبات أو منع تكرار دائم غير مطلوبة. تكرار الإرجاع محمي من الزيادة الإضافية. اختيار الموظف ليس مصادقة، ومطابقة السجل معه تحقق اتساق لا ضمان أمني يمنع انتحال اختيار آخر.
