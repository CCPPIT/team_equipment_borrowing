> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 03 — Functional Requirements

Priority: **Must** means required by the company assignment; this package introduces no optional product features. Each ID is unique. Acceptance checks below describe future behavior.

| ID | Description | Priority | Expected behavior | Testable acceptance criteria |
|---|---|---|---|---|
| FR-01 | Display seeded employees | Must | Retrieve persisted employees for the selector | Given seeded employees, loading the application makes each available as a selectable identity; no employee-creation flow exists |
| FR-02 | Select an employee | Must | Use the selected identity as context for reads and actions | Selecting employee B after A displays B's active state; later requests use B, not A; no mutation is sent without a selection |
| FR-03 | Display equipment types and information | Must | Show equipment types with stable identity and readable name | Given persisted types, each appears in the equipment list with enough information to distinguish it; additional descriptive fields are not mandated |
| FR-04 | Display available stock | Must | Show the current available count for each type | The count matches committed database availability when fetched, includes zero, and never represents a negative committed balance |
| FR-05 | Display the selected employee's active borrowing state | Must | Distinguish types actively borrowed by the selected employee and identify the returnable loan | An active loan for A/type X marks X as borrowed for A; a returned loan does not; switching to B does not reuse A's state |
| FR-06 | Borrow exactly one unit | Must | Submit a borrow request for the selected employee and type | With stock > 0 and no matching active loan, success creates one active loan and reduces availability by one; rejected requests make no changes |
| FR-07 | Return an active loan | Must | Return the selected employee's active loan once | Successful return closes that loan and restores one unit; wrong-employee, unknown, or already-returned targets cannot increment stock |
| FR-08 | Borrow the same type again | Must | Permit a fresh loan after a previous one is returned | With stock available, at least three borrow/return cycles for the same employee/type succeed without reactivating old records |
| FR-09 | Preserve completed borrowing records | Must | Retain loan identity, employee/type references, borrowing time and completion information | After return, the old record remains queryable in persistence with completion time; a later borrow creates a distinct record; no history screen is required |
| FR-10 | Refresh UI after successful actions | Must | Update both availability and selected employee loan state without full reload | A successful borrow or return updates the affected data through local state or refetch; switching employee during an in-flight request never renders the old employee's result as the new one's |

Traceability: FR-06/07 depend on BR-01 through BR-10, not merely disabled buttons. Backend enforcement is mandatory even for direct REST requests.

---

## النسخة العربية / Arabic version

# 03 — المتطلبات الوظيفية

الأولوية **إلزامي (Must)** تعني أن التكليف يتطلب الميزة؛ لا تُضاف ميزات اختيارية. المعرّف نفسه في اللغتين يمثل المتطلب نفسه. معايير القبول تصف تحققًا مستقبليًا.

| المعرّف | الوصف | الأولوية | السلوك المتوقع | معايير قبول قابلة للاختبار |
|---|---|---|---|---|
| FR-01 | عرض الموظفين المُدخلين مسبقًا | إلزامي | جلب الموظفين المحفوظين لمحدد الاختيار | عند وجود موظفين مُدخلين مسبقًا يتيح تحميل التطبيق اختيار كل منهم، دون مسار لإنشاء موظف |
| FR-02 | اختيار موظف | إلزامي | استخدام الهوية المحددة كسياق للقراءة والإجراءات | اختيار B بعد A يعرض حالة B وتستخدم الطلبات التالية هويته لا A؛ لا يُرسل تعديل دون اختيار |
| FR-03 | عرض أنواع المعدات ومعلوماتها | إلزامي | عرض معرّف ثابت واسم واضح لكل نوع | تظهر كل الأنواع المحفوظة بمعلومات تميزها؛ الحقول الوصفية الإضافية غير إلزامية |
| FR-04 | عرض المخزون المتاح | إلزامي | عرض العدد الحالي لكل نوع | يطابق العدد البيانات المثبتة وقت جلبها، ويشمل الصفر، ولا يعرض رصيدًا مثبتًا سالبًا |
| FR-05 | عرض استعارات الموظف المحدد النشطة | إلزامي | تمييز الأنواع المستعارة وتحديد سجل الاستعارة القابل للإرجاع | استعارة A النشطة للنوع X تظهر له فقط؛ المكتملة لا تُعد نشطة؛ اختيار B لا يعيد استخدام حالة A |
| FR-06 | استعارة وحدة واحدة بالضبط | إلزامي | إرسال الموظف والنوع المطلوب | إذا كان المتاح أكبر من صفر ولا توجد استعارة نشطة مطابقة، يُنشأ سجل نشط واحد وينقص المتاح واحدًا؛ الرفض لا يعدل البيانات |
| FR-07 | إرجاع استعارة نشطة | إلزامي | إكمال استعارة الموظف المحدد مرة واحدة | يغلق النجاح الاستعارة ويعيد وحدة؛ السجل المجهول أو الخاص بموظف آخر أو المُرجع مسبقًا لا يزيد المخزون |
| FR-08 | استعارة النوع نفسه مجددًا | إلزامي | السماح بسجل جديد بعد إرجاع السابق | تنجح ثلاث دورات استعارة وإرجاع على الأقل للموظف والنوع نفسيهما عند التوفر، دون إعادة تنشيط السجلات القديمة |
| FR-09 | الاحتفاظ بالاستعارات المكتملة | إلزامي | حفظ هوية السجل وروابط الموظف والنوع ووقت الاستعارة والإكمال | يبقى السجل بعد الإرجاع قابلًا للقراءة من التخزين مع وقت إكماله؛ الاستعارة التالية لها معرّف مختلف؛ لا تُطلب شاشة تاريخ |
| FR-10 | تحديث الواجهة بعد نجاح الإجراءات | إلزامي | تحديث المتاح وحالة الموظف دون إعادة تحميل كاملة | يُستخدم تحديث الحالة أو إعادة الجلب؛ تغيير الموظف أثناء الطلب لا يعرض نتيجة الموظف السابق باعتبارها نتيجة الجديد |

التتبع: تعتمد FR-06 وFR-07 على BR-01 إلى BR-10، وليس على تعطيل الأزرار فقط. فرض القواعد في الخلفية إلزامي حتى للطلبات المباشرة عبر REST.
