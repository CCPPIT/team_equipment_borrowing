# 05 — سلامة PostgreSQL والمعاملات
## إصلاح قابلية إعادة الإنشاء بالموافقة
أول migrate deploy على قاعدة Phase05 الفارغة فشلP3019 لأن provider في migration_lock.toml تضمن التعليق الطرفي عند قراءة Prisma. توقفنا وطلبنا إذنًا؛ وافق المالك على نقل التعليق إلى سطر مستقل والاستئناف. نجح deploy الفعلي بعدها من الصفر، ثم repeat deploy بلا pending، وmigrate status:Database schema is up to date. لا تغيير migration.sql أو schema أو قيمة provider، ولا إسقاط تاريخ أو db push. السطر الحساس استثناء مصرح به من التعليق الطرفي؛ شرحه العربي في السطر السابق.

## الفحص المباشر
catalog للقاعدة الجديدة يؤكد PK وFK Restrict وeq_total_nonnegative وeq_available_bounds وunique_active_loan_per_employee_equipment بشرطreturnedAt IS NULL وidx_loan_equipment. فحص البيانات بعد انحدار المتصفح:أرصدة2/1/0 ونشط0، وعدد failure triggers المتبقية0. seed CLI شُغل مرتين على قاعدة Phase05 ونجح؛ اختبارI17 المعاد يثبت حفظ الاستعارة والرصيد والتاريخ عند إعادة seed قبل/بعد العمليات، لا إعادة مخزون مصطنعة.

## مصفوفة BR المطلوبة في Phase05
| القاعدة | التحقق الفعلي |
|---|---|
| BR01 منع نشطين للزوج |D وI02/I10/I14؛ partial unique حقيقي وsnapshot ثابت عند الرفض |
| BR02 وحدة واحدة |A–C ورفضquantity فيH01؛ كل Loan وحدة بلا حقل quantity |
| BR03 إعادة استعارة |A–C ثلاث دورات وهويات مستقلة وI03 |
| BR04 الخصم مرة |A–C وفحص stock/UI بعد كل201، وH07/H06 يمنعان POST مكررًا |
| BR05 الزيادة مرة |A–C وF وI11/I25 |
| BR06 رفض المرتجع ثانية |F وI04،409 وتاريخ ورصيد ثابتان |
| BR07 نفاد |E وG؛ لا stock سالب |
| BR08 لا أثر للرفض |D/E/F/H01/H04/H05 بمقارنة snapshots وفحص invariant |
| BR09 الذرية |H04 insert يفشل بعدdecrement فيتراجع الكل؛H05 increment يفشل بعدreturnedAt فيرجع النشط؛I06/I07/I08/I24 |
| BR10 التزامن |G1–G3 عبرHTTP ورصد lock wait، وI09–I12 على اتصالاتDB فعلية |

## آلية المصالحة
المراقب المستقل يقرأ SQL snapshot واحدة للجداول، ويتحقق بعد العمليات والرفض وafterEach من available>=0 وavailable+active=total وعدد النشط=عدد موظفيه المميزين لكل نوع. يثبت stock المعين بالضبط عند النجاح. لا مراقبة لحظية لكلnanosecond؛ منع القيم السالبة خلال المعاملة يستند أيضًا إلىCHECK الفعلي وقفل الصف. triggers الاختبار مؤقتة في قاعدة Phase05 فقط وتزال finally وafterEach؛ ليست تعديلًا لمعمارية المنتج.

قاعدة التطوير ظلت3 موظفين و3 أنواع بأرصدة2/1/0 وصفرLoans قبل/بعد. اختبارات backend القديمة تستخدم قاعدة_test الأصلية بمعايير عزلها؛ النظام الجديد يستخدم_phase05_test مستقلة. ملفات .env وschema وmigration.sql وخدمات backend بقيت ببصماتها. SQL إداري خارج البروتوكول قد يكسر invariant عابر الجداول؛ لا ندعي وجودCHECK عابر جداول أو حماية من كل تدخل خارجي.
