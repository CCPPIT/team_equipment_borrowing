> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 01 — Product Overview

## Document status and authority
Phase: 00 — Product Discovery & Requirements Analysis. Status: documentation complete; implementation not started. The company assignment supplied in this conversation is the primary source of truth. This package interprets it; it does not supersede it. The companion `00-SOURCE-REGISTER.md` records source authority and owner instructions. All software behaviors below are requirements, not claims of implemented or verified behavior.

## Problem
Employees need a reliable way to borrow shared equipment, see remaining availability, return what they borrowed, and borrow the same equipment type later. Inventory and loan records must stay consistent even when requests overlap or an operation fails partway through.

## Users and value
The only application user role is **Employee**. A person selects a seeded employee identity rather than authenticating. The application provides visibility into shared stock and the selected employee's current loans, prevents duplicate active borrowing, and preserves completed records for historical integrity. Selection is context, not proof of identity.

## Minimum workflow
1. Load seeded employees and select an employee.
2. Display equipment types, information, available units, and that employee's active borrowing state.
3. Borrow exactly one unit when available and no active loan exists for that employee/type.
4. After success, refresh affected availability and borrowing state without reloading the page.
5. Return an active loan, restoring one unit exactly once while retaining the record.
6. Borrow the same type again later when stock allows; create a new loan record.

## Minimum product
A small monorepo with a Next.js + React + TypeScript web application, a Fastify + TypeScript REST API, Prisma, and PostgreSQL. The eventual implementation must include reliable transactions, concurrency protection, backend validation, understandable errors, appropriate frontend state, repeatable local setup, and automated tests. Phase 00 supplies specifications only.

## Constraints
No authentication, management screens, or physical-item serial tracking. Stock is counted by equipment type. History must persist, but a history-browsing screen is not required. No performance SLA, production deployment, or additional infrastructure is implied.

---

## النسخة العربية / Arabic version

# 01 — نظرة عامة على المنتج

## حالة الوثيقة ومرجعيتها
المرحلة: 00 — اكتشاف المنتج وتحليل المتطلبات. الحالة: اكتمل التوثيق ولم يبدأ التنفيذ. تكليف الشركة في المحادثة الأصلية هو المرجع الأساسي، وهذه الحزمة تفسّره ولا تستبدله. يسجل الملف `00-SOURCE-REGISTER.md` المصادر وتعليمات المالك، بما فيها طلب التوثيق باللغتين. جميع السلوكيات التالية متطلبات مستقبلية وليست ادعاءً بأنها نُفذت أو اختُبرت.

## المشكلة
يحتاج الموظفون إلى طريقة موثوقة لاستعارة المعدات المشتركة ومعرفة المتاح منها وإرجاعها ثم استعارة النوع نفسه لاحقًا. يجب أن تبقى أرصدة المخزون وسجلات الاستعارة متسقة حتى عند تداخل الطلبات أو فشل العملية أثناء تنفيذها.

## المستخدمون والقيمة
الدور الوحيد داخل التطبيق هو **الموظف**. يختار المستخدم هوية موظف مُدخلة مسبقًا في قاعدة البيانات بدلًا من تسجيل الدخول. يوضح التطبيق المخزون المشترك واستعارات الموظف المحدد، ويمنع تكرار الاستعارة النشطة ويحافظ على السجل التاريخي. الاختيار يحدد سياق العمل ولا يثبت الهوية.

## الحد الأدنى لسير العمل
1. تحميل الموظفين المُدخلين مسبقًا واختيار موظف.
2. عرض أنواع المعدات ومعلوماتها والوحدات المتاحة وحالة الاستعارة النشطة لذلك الموظف.
3. استعارة وحدة واحدة بالضبط إذا توفرت ولم توجد استعارة نشطة للموظف والنوع نفسيهما.
4. تحديث التوفر وحالة الاستعارة بعد النجاح دون إعادة تحميل الصفحة بالكامل.
5. إرجاع استعارة نشطة وإعادة وحدة واحدة للمخزون مرة واحدة مع الاحتفاظ بالسجل.
6. استعارة النوع نفسه لاحقًا عند توفر المخزون، بإنشاء سجل جديد.

## الحد الأدنى للمنتج
مستودع موحد صغير: واجهة Next.js + React + TypeScript، وخلفية Fastify + TypeScript عبر HTTP REST، واستخدام Prisma وPostgreSQL. يجب أن يشمل التنفيذ اللاحق معاملات موثوقة وحماية من التزامن وتحققًا خلفيًا وأخطاء مفهومة وحالات واجهة مناسبة وإعدادًا محليًا قابلًا للتكرار واختبارات آلية. المرحلة 00 تقدم المواصفات فقط.

## القيود
لا مصادقة ولا شاشات إدارة ولا تتبع للوحدات بأرقام تسلسلية. يُحسب المخزون حسب نوع المعدات. الاحتفاظ بالتاريخ إلزامي لكن شاشة استعراضه ليست مطلوبة. لا تُفترض اتفاقية مستوى خدمة أو أهداف أداء أو نشر إنتاجي أو بنية تحتية إضافية.
