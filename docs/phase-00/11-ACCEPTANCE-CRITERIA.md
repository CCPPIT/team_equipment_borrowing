> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 11 — Acceptance Criteria and Traceability

## Phase 00 documentation acceptance
| Gate | Objective completion check | Result and boundary |
|---|---|---|
| G-01 | Product, users, activities, workflow, value and minimum scope documented | Covered in 01 and 02 |
| G-02 | Functional IDs unique and each includes priority, behavior and testable acceptance | FR-01–FR-10 in 03; documentation checked |
| G-03 | All ten mandatory business rules include explanation, valid/invalid scenario, response and verification | BR-01–BR-10 in 04; documentation checked |
| G-04 | Required quality constraints and conceptual persistence covered without schema | 05 and 06 |
| G-05 | Operations have inputs, responses, validation, errors and HTTP categories | 07; proposed route/status decisions identified as proposals |
| G-06 | Required interface and UI states covered without components | 08 |
| G-07 | All six mandatory test families include state, action, outcome and consistency expectations | TEST-01–TEST-06 in 09; none executed |
| G-08 | Scope exclusions explicit; stack retained; unnecessary infrastructure absent | 10 |
| G-09 | Assumptions, ambiguities and questions visible; no unresolved normative contradiction | 12; unresolved choices are identified, not silently asserted |
| G-10 | Stop at Phase 00 and request owner approval | Documentation-only delivery; no implementation started |

## Product acceptance traceability for later verification
| Functional requirement | Rules / quality linkage | Future verification |
|---|---|---|
| FR-01 | NFR-04/07 | Seeded-selector read/UI checks |
| FR-02 | NFR-04/06/07 | Selection change, no-selection and stale-response UI/API checks |
| FR-03 | NFR-09 | Catalog response and rendering checks |
| FR-04 | BR-04/05/07/10, NFR-01 | TEST-02/04/06 and displayed balance checks |
| FR-05 | BR-01, NFR-01 | TEST-01 and selected-employee state checks |
| FR-06 | BR-01/02/04/07/09/10 | TEST-01/02/04/05/06 plus invalid-input checks |
| FR-07 | BR-05/06/09/10 | TEST-02/03/05/06 plus ownership checks |
| FR-08 | BR-03/08 | TEST-02 and distinct loan IDs/history assertions |
| FR-09 | BR-08/09 | TEST-02/05 persistence assertions |
| FR-10 | NFR-06/07 | Borrow/return refresh, failure and employee-switch UI checks |

## Required interpretation
The documentation package may be complete while the application is unimplemented. No runtime acceptance criterion, transaction behavior, concurrency strategy, local setup or automated application test has been verified. Formal project-owner approval of the package and proposed contract choices is still pending.

---

## النسخة العربية / Arabic version

# 11 — معايير القبول والتتبع

## قبول وثائق المرحلة 00
| البوابة | فحص الاكتمال الموضوعي | النتيجة وحدودها |
|---|---|---|
| G-01 | توثيق المنتج والمستخدمين والأنشطة والسير والقيمة والحد الأدنى | مغطى في 01 و02 |
| G-02 | فرادة معرّفات المتطلبات ووجود الأولوية والسلوك ومعيار قابل للاختبار | FR-01–FR-10 في 03؛ فحص توثيقي |
| G-03 | القواعد العشر بشرح ومثال صحيح وغير صحيح واستجابة وتحقق | BR-01–BR-10 في 04؛ فحص توثيقي |
| G-04 | الجودة والبيانات المفاهيمية دون مخطط | 05 و06 |
| G-05 | مدخلات العمليات ومخرجاتها والتحقق وأخطاؤها وفئات HTTP | 07؛ وُسمت المسارات والحالات المقترحة كمقترحات |
| G-06 | الواجهة وحالاتها دون مكونات تنفيذية | 08 |
| G-07 | المجموعات الست بحالة أولية وإجراء ونتيجة واتساق | TEST-01–TEST-06 في 09؛ لم تُنفذ |
| G-08 | صراحة الاستبعادات والالتزام بالتقنيات وعدم إضافة بنية غير لازمة | 10 |
| G-09 | إظهار الافتراضات والغموض والأسئلة دون تناقض معياري متبقٍ | 12؛ الخيارات المعلقة معلنة وليست حقائق ضمنية |
| G-10 | التوقف بعد المرحلة وطلب الاعتماد | تسليم توثيقي؛ لم يبدأ التنفيذ |

## تتبع قبول المنتج للتحقق اللاحق
| المتطلب | القواعد والجودة المرتبطة | التحقق المستقبلي |
|---|---|---|
| FR-01 | NFR-04/07 | قراءة وعرض الموظفين الأوليين |
| FR-02 | NFR-04/06/07 | تغيير الاختيار وغيابه والاستجابات القديمة في الواجهة وAPI |
| FR-03 | NFR-09 | استجابة قائمة المعدات وعرضها |
| FR-04 | BR-04/05/07/10، NFR-01 | TEST-02/04/06 وفحص الرصيد المعروض |
| FR-05 | BR-01، NFR-01 | TEST-01 وفحوص حالة الموظف المحدد |
| FR-06 | BR-01/02/04/07/09/10 | TEST-01/02/04/05/06 وفحوص المدخلات غير الصالحة |
| FR-07 | BR-05/06/09/10 | TEST-02/03/05/06 وفحوص تبعية الاستعارة |
| FR-08 | BR-03/08 | TEST-02 وفرادة هويات السجلات والتاريخ |
| FR-09 | BR-08/09 | فحوص التخزين في TEST-02/05 |
| FR-10 | NFR-06/07 | تحديث الاستعارة والإرجاع والفشل وتغيير الموظف |

## التفسير الملزم
يمكن اكتمال الوثائق بينما التطبيق غير منفذ. لم يُتحقق من معيار قبول تشغيلي أو سلوك معاملة أو استراتيجية تزامن أو إعداد محلي أو اختبار آلي للتطبيق. ما زال اعتماد المالك الرسمي للحزمة وخيارات العقود المقترحة معلقًا. تكرار المعرّفات في القسم العربي ترجمة لا متطلبات أو اختبارات إضافية.
