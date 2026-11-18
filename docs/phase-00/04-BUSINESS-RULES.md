> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 04 — Business Rules

An **active loan** has not been returned. A completed loan remains persisted but is not active. All responses below describe externally observable effects after commit or rollback.

| ID | Explanation | Valid scenario | Invalid scenario | Expected system response | Verification method |
|---|---|---|---|---|---|
| BR-01 | At most one active loan per employee/equipment type | A borrows X with no active A/X loan | A attempts a second active X loan, including overlapping requests | Reject duplicate; retain one active loan and no additional stock decrement | TEST-01 and TEST-06; inspect active count and balance |
| BR-02 | Each borrowing action is exactly one unit | One request produces one loan and consumes one unit | A client supplies quantity 2 or attempts a multi-unit operation | No multi-unit borrowing; quantity is not an accepted input and is rejected if supplied under proposed contract | FR-06 contract check and TEST-02 stock deltas |
| BR-03 | Same type can be borrowed again after return if stock allows | A returns X, then borrows X with availability > 0 | A borrows again before returning, or after return when stock is zero | Allow new distinct loan only when both prerequisites hold | TEST-01, TEST-02, TEST-04 |
| BR-04 | Borrow reduces available stock by one | Availability 2 becomes 1 with one new active loan | New loan with balance unchanged or reduced by 2 | Commit both correct changes or neither | TEST-02 and TEST-05 |
| BR-05 | Return restores available stock by one | Active loan closes and availability 0 becomes 1 | Return closes loan without increment, or increments by 2 | Commit one completion and one increment atomically | TEST-02 and TEST-05 |
| BR-06 | An already returned loan cannot increase stock again | First return increments once; retry changes nothing | Second return increments again, even concurrently | No-op or conflict is permitted by source; proposed contract chooses 409 conflict with no mutation | TEST-03 and TEST-06 |
| BR-07 | Unavailable borrowing is rejected without modification | Borrow succeeds with positive stock | Borrow attempts with zero availability | Reject with a stock conflict; do not insert a loan or change any business data | TEST-04 and TEST-06 |
| BR-08 | History persists after return | Completed loan remains with its return information | Deleting or overwriting the old loan to allow a new borrow | Retain completed record; new cycle creates a new identity | TEST-02, inspect all completed records |
| BR-09 | Stock and loan/history changes are atomic | Both changes commit together | Failure occurs after only one database write | Roll back the whole borrow/return transaction | TEST-05 with controlled failure |
| BR-10 | Overlapping requests cannot duplicate active loans or consume the final unit twice | Two requests for distinct employees compete for one unit; one succeeds | Both succeed with one unit, or one employee gets two active loans | Serialize conflicting decisions or detect/reject conflict; preserve all invariants | TEST-06 using separate database connections and synchronized starts |

## Invariants
- Available stock is nonnegative. For fixed seeded total stock, available units + active loan count for a type = total units.
- Count(active loans for employee/type) is at most one.
- A completed loan's completion is applied once; its history is not deleted or reset to active.
- Any rejected operation leaves persisted business data unchanged.

## Concurrency obligation, not a Phase 00 schema
A check followed by an unprotected write is insufficient. Phase 01 must choose and explain a database-enforced strategy covering **both** stock and active-loan uniqueness. A viable candidate is a transaction that acquires the relevant equipment row lock before reading eligibility, then validates current active state and availability, and performs both writes before committing. Borrow and return must follow the same lock ordering and recheck state under protection. A database active-only uniqueness guard is another defense to evaluate; a global employee/type unique constraint would incorrectly prevent historical cycles. No schema or migration is defined here.

Transactions must protect against competing final-unit borrowers, same-pair duplicate borrows, repeated returns, and borrow/return overlap. In-process locks or frontend action disabling alone are insufficient. Transaction conflicts/deadlocks must not leak partial data; rollback is required, with any retry policy to be decided later. No distributed locking service is needed.

---

## النسخة العربية / Arabic version

# 04 — قواعد العمل

**الاستعارة النشطة** هي التي لم تُرجع بعد. تبقى الاستعارة المكتملة محفوظة لكنها ليست نشطة. تصف النتائج التالية الأثر المرئي بعد تثبيت المعاملة أو التراجع عنها.

| المعرّف | الشرح | سيناريو صحيح | سيناريو غير صحيح | استجابة النظام المتوقعة | وسيلة التحقق |
|---|---|---|---|---|---|
| BR-01 | استعارة نشطة واحدة كحد أقصى لكل موظف ونوع | يستعير A النوع X ولا توجد له استعارة نشطة منه | محاولة استعارة نشطة ثانية بما فيها الطلبات المتداخلة | رفض التكرار والإبقاء على استعارة واحدة دون خصم إضافي | TEST-01 وTEST-06؛ فحص العدد والرصيد |
| BR-02 | كل استعارة تمثل وحدة واحدة بالضبط | طلب واحد ينشئ سجلًا ويستهلك وحدة | إرسال كمية 2 أو طلب متعدد الوحدات | لا استعارة متعددة؛ وفق العقد المقترح يُرفض حقل الكمية غير المدعوم | فحص عقد FR-06 وفروق المخزون في TEST-02 |
| BR-03 | إعادة استعارة النوع بعد إرجاعه عند التوفر | يُرجع A النوع X ثم يستعيره مع توفر وحدات | استعارة جديدة قبل الإرجاع أو عند نفاد المخزون | السماح بسجل جديد فقط عند تحقق الشرطين | TEST-01 وTEST-02 وTEST-04 |
| BR-04 | الاستعارة تخفض المتاح وحدة | يتحول المتاح من 2 إلى 1 مع سجل نشط جديد | إنشاء سجل دون خصم أو خصم وحدتين | تثبيت التعديلين الصحيحين معًا أو عدم تثبيتهما | TEST-02 وTEST-05 |
| BR-05 | الإرجاع يعيد وحدة للمتاح | إغلاق استعارة وتحول المتاح من 0 إلى 1 | إغلاق دون زيادة أو زيادة بمقدار 2 | إكمال واحد وزيادة واحدة ضمن معاملة ذرية | TEST-02 وTEST-05 |
| BR-06 | إعادة إرجاع السجل لا تزيد المخزون | الإرجاع الأول يزيد مرة وإعادته لا تغير شيئًا | الطلب الثاني يزيد مجددًا ولو بالتزامن | المصدر يسمح بعدم التغيير أو التعارض؛ المقترح 409 دون تعديل | TEST-03 وTEST-06 |
| BR-07 | رفض الاستعارة عند عدم التوفر دون تعديل | النجاح مع رصيد موجب | محاولة الاستعارة والمتاح صفر | تعارض مخزون دون إنشاء سجل أو تعديل بيانات العمل | TEST-04 وTEST-06 |
| BR-08 | بقاء التاريخ بعد الإرجاع | الاحتفاظ بالسجل المكتمل ومعلومات الإرجاع | حذف السجل أو الكتابة فوقه للسماح باستعارة لاحقة | الاحتفاظ بالمكتمل وإنشاء هوية جديدة للدورة اللاحقة | TEST-02 وفحص جميع السجلات المكتملة |
| BR-09 | ذرية تغير المخزون وسجل الاستعارة | تثبيت التعديلين معًا | فشل بعد كتابة جزء واحد | التراجع عن معاملة الاستعارة أو الإرجاع كاملة | TEST-05 بفشل مضبوط |
| BR-10 | تداخل الطلبات لا يكرر النشط ولا يستهلك آخر وحدة مرتين | يتنافس موظفان على وحدة فينجح أحدهما | نجاح الاثنين أو إنشاء استعارتين نشطتين للموظف والنوع | تسلسل القرارات المتعارضة أو كشف التعارض ورفضه مع حفظ الثوابت | TEST-06 باتصالات قاعدة بيانات مستقلة وبدايات منسقة |

## الثوابت
- المتاح غير سالب. عند ثبات الإجمالي الأولي: المتاح + عدد الاستعارات النشطة للنوع = إجمالي وحداته.
- عدد الاستعارات النشطة لكل موظف ونوع لا يتجاوز واحدًا.
- لا يُطبق إكمال الاستعارة أكثر من مرة، ولا يُحذف تاريخها أو يُعاد تنشيطها.
- أي عملية مرفوضة لا تغير بيانات العمل المحفوظة.

## التزام التزامن وليس مخطط قاعدة بيانات
لا يكفي الفحص ثم الكتابة دون حماية. يجب أن تختار المرحلة 01 آلية مدعومة بقاعدة البيانات لحماية المخزون وفرادة الاستعارة النشطة معًا. من الخيارات معاملة تقفل صف نوع المعدات قبل قراءة الأهلية، ثم تعيد فحص حالة الاستعارة والمتاح وتجري الكتابتين قبل التثبيت. يجب أن تتبع الاستعارة والإرجاع ترتيب الأقفال نفسه وتعيد التحقق تحت الحماية. يمكن دراسة قيد فرادة يخص السجلات النشطة فقط كدفاع إضافي؛ القيد العام لكل الموظف والنوع سيمنع دورات التاريخ المطلوبة. لا يُعرّف هنا مخطط أو ترحيل.

يجب تغطية تنافس آخر وحدة، وتكرار استعارة الزوج نفسه، وتكرار الإرجاع، وتداخل الاستعارة مع الإرجاع. أقفال ذاكرة العملية وتعطيل الأزرار وحدهما غير كافيين. تعارض المعاملات أو تعطلها المتبادل يجب ألا يترك بيانات جزئية؛ التراجع إلزامي وسياسة إعادة المحاولة قرار لاحق. لا حاجة لخدمة أقفال موزعة.
