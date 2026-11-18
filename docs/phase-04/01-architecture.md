# Phase04 — هندسة الواجهة
تاريخ التسليم: 2026-11-18. التنفيذ وفق اعتماد Phase02 وAPI الفعلي في Phase03، دون تغيير backend أو Prisma أو المخطط أو قواعد الأعمال.

## الحدود والملفات
- `src/app/layout.tsx` و`page.tsx`: Server Components، لغة عربية واتجاه RTL وهيكل الصفحة. `loading.tsx` و`error.tsx` للتعافي على مستوى المسار.
- `features/borrowing/borrowing-screen.tsx`: نقطة client واحدة لتجميع العرض.
- `features/borrowing/components.tsx`: EmployeeSelector وEquipmentList وEquipmentCard ولوحات الحالات؛ زر الإجراء ضمن البطاقة دون طبقة غير لازمة.
- `features/borrowing/use-borrowing.ts`: الحالة وتنسيق الطلبات والمصالحة؛ React hooks فقط، دون مكتبات حالة إضافية.
- `lib/api-client.ts`: اتصال موحد والتحقق وقت التشغيل وترجمة الأخطاء؛ `types/api.ts`: DTOs.
- `components/icon.tsx`: SVG محلي؛ CSS محلي دون خطوط أو صور خارجية.
- `tests/`: اختبارات عميل ومكونات وشاشة؛ `tests/browser/`: متصفح وتكامل حقيقي.

لا مصادقة ولا إدارة موظفين ولا CRUD للمخزون ولا لوحة إدارة ولا ميزات خارج النطاق. اختيار الموظف ليس تسجيل دخول ولا حدًا أمنيًا.

## التعليقات
كل سطر مؤلف قابل للتعليق في TS/TSX/MJS/CSS موضح بالعربية، بما فيه الإغلاق. JSX يستخدم تعليقات داخلية أو سابقة للسطر. JSON وlock وملفات Next المولدة مستثناة للحفاظ على صحة التنسيق، وتشرح مسؤوليتها هنا: package يثبت الأدوات، tsconfig يفعّل التحقق الصارم، lock يثبت شجرة التبعيات، next-env يضيف تعريفات Next.
