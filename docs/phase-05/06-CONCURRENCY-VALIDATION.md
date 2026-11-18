# 06 — إثبات التزامن الحقيقي
## بروتوكول G1–G3
1. اتصال مراقب مستقل يبدأ transaction ويقفل آخر وحدة للنوعY بـSELECT FOR UPDATE.
2. طلباHTTP POST يبدأان عبرNext إلىFastify لموظفينA/B بينما القفل ما زال محجوزًا.
3. يستعلم مراقب آخر pg_stat_activity حتى يثبت أن **طلبين** ينتظران Lock على استعلامFOR UPDATE في قاعدة Phase05 نفسها، مع deadline10s. عدم تحقق الانتظار يفشل الاختبار.
4. قبل الإفراج يظلstock1 ولا نشط. يحرر المراقب القفل ثم ينتظر الردين ويطابق الأكواد والمخزون والنشط.
5. finally يحرر transaction/connection حتى عند فشل assertion، وafterEach يفحص المصالحة.

هذا يثبت overlap حقيقيًا، وليس Promise.all سريعًا بلا إثبات تداخل، ولا mock أو قفل JavaScript. ثلاث جولات ناجحة مستقلة معfixtures تعاد بين الجولات.

## النتائج الخام المفككة من مرفقات آخر تشغيل
| الجولة | طلبات منتظرة مرصودة | HTTP | المتاح بعدهما | النشط |
|---|---|---|---|---|
|1|2|[201, 409]|0|1|
|2|2|[201, 409]|0|1|
|3|2|[409, 201]|0|1|

الدليل المستقل: evidence/workflow-database-proofs.json وsystem-results.json وسجلsystem-final19-pass.log. الفائز ليس موظفًا ثابتًا؛ كلاهما يجوز أن يفوز. المتوقع للثاني409 OUT_OF_STOCK دون سجل غير صالح.

## حماية التنفيذ الموجودة
كل borrow/return يقفل Equipment أولًا ضمنReadCommitted transaction، ثم يعيد فحص الأهلية ويكتب السجل والرصيد ذريًا؛ partial unique يحمي النشط وCHECK يحصر الرصيد. Return يستخدم updateMany returnedAt=null/count1؛ لا زيادة ثانية. اختبارات backend المعادةI10/I11/I12/I25 تكمل تداخل الزوج نفسه والإرجاع المزدوج وReturn/Borrow. لا إضافة retries أو mutex أو queues أو تعديل isolation/constraints.

الحدود: ليست stress benchmark ولا توزيعًا متعدد المناطق أو failover. لم نختبر كل جدول زمني ممكن، ولا نستنتج exactly-once عبر شبكة غامضة. نتيجة فقد الرد يجب مصالحتها بـGET كما أثبتH06.
