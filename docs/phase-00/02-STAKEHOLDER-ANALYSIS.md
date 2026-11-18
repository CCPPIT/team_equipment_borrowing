> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 02 — Stakeholder and User Analysis

## Actual application role
| Role | Capabilities | Limits |
|---|---|---|
| Employee | Choose a seeded employee, inspect equipment and availability, borrow one unit, return that selected employee's active loan | No identity verification, employee editing, equipment creation, stock administration, or administrative privileges |

The employee selector represents the current acting context. Switching it changes which employee's active loans are shown and which identity is supplied with mutations. It is not an authorization boundary. Backend ownership validation must still ensure that a return targets a loan belonging to the employee supplied in that request.

## Stakeholders, not additional product roles
| Stakeholder | Interest | Product access implied |
|---|---|---|
| Company assessment reviewers | Relational modeling, reliability, transactions/concurrency, frontend state, organization, tests, readability, explanation of decisions | None beyond the employee UI; review is an assessment activity |
| Project owner | Scope approval and phase approval | No separate application role |
| Implementing engineer | Deliver and explain the constrained solution | No application administration workflow |

## Identity and data constraints
Employees are seeded in the database. No employee registration, login, editing, deletion, permission system, or employee-management API is required. Listing seeded employees is a supporting read operation necessary for the selector.

## Owner instruction
Future application code is requested to contain Arabic comments on every line. This requirement is recorded, not executed in Phase 00 because application code is expressly prohibited. Formatting-sensitive files and a precise definition of commentable lines should be clarified before implementation; do not add invalid comments to JSON or other formats that do not support them.

---

## النسخة العربية / Arabic version

# 02 — تحليل أصحاب المصلحة والمستخدمين

## الدور الفعلي في التطبيق
| الدور | الإمكانات | الحدود |
|---|---|---|
| الموظف | اختيار موظف مُدخل مسبقًا؛ عرض المعدات والتوفر؛ استعارة وحدة؛ إرجاع الاستعارة النشطة للموظف المحدد | لا إثبات هوية أو تعديل موظفين أو إنشاء معدات أو إدارة مخزون أو امتيازات إدارية |

يمثل محدد الموظف سياق العمل الحالي؛ تغييره يغير الاستعارات المعروضة والهوية المرسلة مع عمليات التعديل. ليس حاجز صلاحيات. ومع ذلك يجب على الخلفية التحقق من أن الاستعارة المراد إرجاعها تخص الموظف المرسل في الطلب، للحفاظ على اتساق البيانات.

## أصحاب مصلحة وليسوا أدوارًا إضافية في المنتج
| صاحب المصلحة | اهتمامه | الوصول الذي يستلزمه ذلك |
|---|---|---|
| مراجعو تقييم الشركة | النمذجة العلائقية والموثوقية والمعاملات والتزامن وحالة الواجهة والتنظيم والاختبارات والوضوح وتفسير القرارات | لا دور إضافي خارج واجهة الموظف؛ المراجعة نشاط تقييم |
| مالك المشروع | اعتماد النطاق والمراحل | لا دور منفصل في التطبيق |
| المهندس المنفذ | تسليم الحل ضمن القيود وشرح قراراته | لا سير عمل إداري داخل التطبيق |

## قيود الهوية والبيانات
الموظفون مُدخلون مسبقًا في قاعدة البيانات. لا تسجيل موظفين أو تسجيل دخول أو تعديل أو حذف أو نظام أذونات أو واجهة برمجية لإدارة الموظفين. قراءة قائمة الموظفين عملية داعمة ضرورية لمحدد الاختيار.

## تعليمات المالك
طلب المالك تعليقات عربية لكل سطر من كود التطبيق المستقبلي. يُوثق الطلب ولا يُنفذ هنا لأن المرحلة تمنع كتابة كود التطبيق. يجب توضيح معنى الأسطر القابلة للتعليق والتعامل مع الملفات الحساسة للتنسيق قبل البرمجة؛ لا تُضاف تعليقات غير صالحة إلى JSON أو صيغة لا تدعمها. كما طلب المالك لاحقًا توثيقًا عربيًا وإنجليزيًا، ونُفذ ذلك دون توسيع النطاق.
