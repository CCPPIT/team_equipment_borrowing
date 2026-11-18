> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 06 — Conceptual Data Requirements

This document is conceptual only: no Prisma schema, SQL, tables, indexes, migrations, or seed implementation is supplied.

| Concept | Persisted information | Meaning |
|---|---|---|
| Employee | Stable identity; display name | Seeded selectable employee; not an authenticated account |
| Equipment Type | Stable identity; readable name; stock accounting information | A category of interchangeable units, not an individually serialized asset |
| Loan | Stable identity; employee reference; equipment-type reference; borrowing time; return/completion time when returned | One borrowing action for one unit; initially active, later completed |

## Relationships
One employee may have many loans over time. One equipment type may have many loans over time. Every loan refers to exactly one existing employee and one existing equipment type. For any employee/type pair, many completed loans are allowed but at most one active loan is allowed. Different employees may simultaneously borrow the same type when sufficient units exist.

## Stock accounting
The system must be able to determine total units, available units, and the number of active loans per type consistently. Whether available count is stored or derived is a later design decision. If it is stored, every change must be transactional with the related loan change. In a fixed-stock scope, available + active units = seeded total; no user-facing stock adjustment exists. Reject attempts to overdraw availability.

## History retention and return history
Return transitions the existing loan from active to completed and records when it was returned. It does not delete the loan, clear its references, or overwrite it for reuse. A new borrowing cycle creates a new loan identity, retaining all earlier borrowing and return information. The loan's completion information satisfies the return-history requirement; a separate return-event entity is not mandated.

No UI for historical browsing, separate audit logging system, retention/deletion policy, employee deletion, serial-number tracking, or seed data volume is specified. Avoid cascading deletion decisions that would undermine required history. Exact field types, timestamps/timezone conventions, identifier format, constraints and seed contents are Phase 01 decisions.

---

## النسخة العربية / Arabic version

# 06 — متطلبات البيانات المفاهيمية

هذه وثيقة مفاهيمية فقط؛ لا تحتوي مخطط Prisma أو SQL أو تعريف جداول أو فهارس أو ترحيلات أو تنفيذ بيانات أولية.

| الكيان المفاهيمي | المعلومات المحفوظة | المعنى |
|---|---|---|
| الموظف | معرّف ثابت واسم للعرض | موظف مُدخل مسبقًا للاختيار، وليس حسابًا موثّق الهوية |
| نوع المعدات | معرّف ثابت واسم واضح ومعلومات حساب المخزون | فئة وحدات متبادلة وليست أصلًا فرديًا برقم تسلسلي |
| الاستعارة | معرّف ثابت ومرجع الموظف والنوع ووقت الاستعارة ووقت الإرجاع عند الإكمال | استعارة وحدة واحدة؛ تبدأ نشطة ثم تكتمل |

## العلاقات
يمكن للموظف امتلاك استعارات كثيرة عبر الزمن، وكذلك يمكن للنوع الارتباط باستعارات كثيرة. ترتبط كل استعارة بموظف واحد موجود ونوع واحد موجود. يجوز تعدد الاستعارات المكتملة للموظف والنوع نفسيهما، لكن لا تزيد النشطة عن واحدة. يمكن لموظفين مختلفين استعارة النوع نفسه بالتزامن إذا كفت الوحدات.

## حساب المخزون
يجب معرفة إجمالي الوحدات والمتاح وعدد الاستعارات النشطة لكل نوع بصورة متسقة. حفظ المتاح كقيمة أو اشتقاقه قرار تصميم لاحق. إذا حُفظ، فيجب تحديثه ضمن معاملة الاستعارة نفسها. في نطاق المخزون الثابت: المتاح + الوحدات المستعارة النشطة = الإجمالي الأولي. لا يوجد تعديل مخزون من الواجهة، وتُرفض محاولات تجاوز المتاح.

## الاحتفاظ بتاريخ الاستعارة والإرجاع
يحوّل الإرجاع السجل الموجود من نشط إلى مكتمل ويسجل وقته. لا يحذف السجل أو يمسح مراجعَه أو يعيد استخدامه. تنشئ الدورة التالية هوية استعارة جديدة وتحفظ السابقة. معلومات الإكمال داخل السجل تكفي لمتطلب تاريخ الإرجاع؛ لا يُفرض كيان منفصل لأحداث الإرجاع.

لا يُطلب تاريخ في الواجهة أو نظام تدقيق مستقل أو سياسة حذف واحتفاظ أو حذف موظفين أو أرقام تسلسلية أو حجم محدد للبيانات الأولية. يجب تجنب قرارات الحذف المتسلسل التي تفسد التاريخ. أنواع الحقول والتوقيت والمنطقة الزمنية وصيغة المعرفات والقيود ومحتوى البيانات الأولية قرارات المرحلة 01.
