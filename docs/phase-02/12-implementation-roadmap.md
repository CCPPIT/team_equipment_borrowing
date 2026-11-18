# 12 — خارطة التنفيذ وبوابات التسليم

هذه خارطة لا بدء تنفيذ. اعتماد Phase 02 مطلوب قبل Phase 03. لا نحول open decisions إلى حقائق.

| الترتيب | العمل | التبعية | دليل الخروج |
|---|---|---|---|
| بوابة Phase 02 | مراجعة هذه الوثائق والـADR والعقد والقيود؛ اعتماد سياسة التعليقات والإصدارات قبل التثبيت | موافقة المالك | تسجيل موافقة صريحة؛ حسم OPEN-VERSION أو اعتماد إجراء فحص التوافق قبل أي تثبيت |
| Phase 03 / خطوة 1 | تثبيت compatibility matrix وworkspaces وتهيئة Fastify وPrisma/PostgreSQL محليًا | إذن Phase 03 وتوافق runtime | إصدارات مقفلة وأوامر موثقة؛ لا اختيار أحدث بلا مراجعة |
| Phase 03 / خطوة 2 | models وmigrations مع CHECK/index وseed غير مدمر | DB اختبار منفصل | replay وpg_catalog assertions وseed مرتين وبعد Borrow/Return |
| Phase 03 / خطوة 3 | services والقفل وترتيب المعاملات وخطأ موحد وroutes الأربع | القيود وfixtures | BT-01–BT-12 وAPI tests؛ لا خصم جزئي أو زيادة مكررة |
| Phase 04 | Next.js وproxy والشاشة وحالات React وعميل API واختبارات DOM | عقد API منفذ وموافقة المرحلة | حالات الواجهة والتبديل وpending guard وrefetch دون optimistic complexity |
| Phase 05 | ربط فعلي وتدفقات الموظفين والمخزون والعودة وإعادة الاستعارة | frontend/backend | نتائج تكامل موثقة وعدم ظهور بيانات موظف آخر |
| Phase 06 | مراجعة القواعد والفشل والتزامن والأخطاء وTypeScript وbuild والتعليقات | التطبيق المتكامل | أوامر ونتائج فعلية؛ لا ادعاء نجاح بلا تشغيل |
| Phase 07 | README محلي وAPI والقرارات والقيود وZIP بلا أسرار | نتائج QA | إعداد من بيئة نظيفة وتسليم قابل للتكرار دون production/CI |

## التتبّع إلى القواعد المعتمدة
مرجع BR هو Phase 00 لتفادي تغير الأرقام في Phase 01.
| القاعدة | موضع التصميم | الإثبات اللاحق |
|---|---|---|
| P00-BR-01 | partial unique + فحص بعد قفل النوع | BT-01/08/12 |
| P00-BR-02 | سجل واحد بلا quantity | BT-02 وAPI validation |
| P00-BR-03 | returnedAt وLoan جديد | BT-02 |
| P00-BR-04 | decrement داخل transaction | BT-02/05 |
| P00-BR-05 | returnedAt ثم increment داخل transaction | BT-02/06 |
| P00-BR-06 | إعادة قراءة الحالة بعد القفل | BT-03/09 |
| P00-BR-07 | فحص المتاح المحمي وCHECK | BT-04/07 |
| P00-BR-08 | لا حذف أو إعادة استخدام السجل | BT-02/12 |
| P00-BR-09 | tx واحدة وthrow عند الفشل | BT-05/06 |
| P00-BR-10 | ReadCommitted + row lock + constraints | BT-07/08/09/10 |
| P01-BR-02 توضيح أنواع مختلفة | القيد على الزوج لا الموظف وحده | BT-11 |

## قيود مستمرة
لا توسيع نطاق؛ لا Authentication أو إدارة أو queues أو workers أو distributed services أو tracking serials أو نشر إنتاجي أو CI أو stress infrastructure. لا البدء في Phase 04 أو غيرها تلقائيًا من هذا الجدول؛ كل انتقال يحتاج إذن المرحلة. بيانات العرض وسياسة اختيار الموظف المقترحة قابلة للمراجعة دون تغيير قواعد العمل.
