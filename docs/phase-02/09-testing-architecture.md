# 09 — معمارية الاختبارات

## الأدوات وحقيقة البيئة
لا إطار اختبار مثبت أو ملفات اختبار في audit. الاختيار المقترح: Vitest لتوحيد TypeScript unit/integration، وFastify inject المدمج لاختبارات HTTP بلا خادم مستمع، وReact Testing Library + jsdom لاختبارات تفاعل الواجهة. الأخيرتان ضرورة محددة لاختبار DOM وReact لا مكتبات تشغيل للمنتج. استخدام user-event اختياري إذا احتاجت المحاكاة الواقعية، لا يُضاف تلقائيًا. أرقام النسخ والتوافق مفتوحة؛ لم يُثبت أو يُشغل شيء. PostgreSQL حقيقي إلزامي لفحوص المعاملات؛ SQLite وmocks لا يثبتان partial indexes/locking.

## الحالات الخلفية وتتبّع المصدر
| الاختبار | initial/action | المتوقع بعد الاستجابة والبيانات | المصدر |
|---|---|---|---|
| BT-01 | A لديه X نشط ومخزون كافٍ؛ يطلبه ثانية | 409 ALREADY_BORROWED؛ active واحد ولا خصم | TEST-01؛ P00-BR-01 |
| BT-02 | متاح 2؛ ثلاث دورات Borrow/Return | 201 ثم 200 لكل دورة؛ 2→1→2؛ ثلاث هويات مكتملة | TEST-02؛ P00-BR-02/03/04/05/08 |
| BT-03 | إرجاع السجل ثم إرجاعه ثانية | 409 ALREADY_RETURNED للثاني؛ returnedAt نفسه ورصيد زاد واحدًا فقط | TEST-03؛ P00-BR-06 |
| BT-04 | متاح صفر؛ موظف مؤهل يطلب النوع | 409 OUT_OF_STOCK؛ لقطة كل بيانات العمل لم تتغير | TEST-04؛ P00-BR-07 |
| BT-05 | فشل اختباري بعد decrement وقبل insert في Borrow | خطأ؛ لا خصم ولا Loan جديد | TEST-05؛ P00-BR-09 |
| BT-06 | فشل اختباري بعد returnedAt وقبل increment في Return | خطأ؛ Loan ما زال نشطًا والمخزون كما كان | TEST-05؛ P00-BR-09 |
| BT-07 | اتصالان يتنافسان على آخر وحدة | نجاح واحد وتعارض نفاد للآخر؛ متاح صفر وسجل نشط إضافي واحد | TEST-06؛ P00-BR-10 |
| BT-08 | اتصالان للزوج نفسه مع وحدتين | واحد 201 وآخر ALREADY_BORROWED؛ خصم واحد | TEST-06؛ P00-BR-01/10 |
| BT-09 | إرجاعان متزامنان للسجل نفسه | إكمال واحد وزيادة واحدة و409 للآخر | TEST-06؛ P00-BR-06/10 |
| BT-10 | Borrow/Return لنفس الزوج متداخلان | نتيجة تتفق مع ترتيب قفل النوع؛ لا نشطين ولا فقد تاريخ | TEST-06 |
| BT-11 | A يستعير X وY بمخزون متاح | كلاهما نشط؛ لا منع شامل للموظف | P01-BR-02 |
| BT-12 | direct DB insert نشط مكرر وCHECK/FK مخالف | ترفضها PostgreSQL؛ إعادة الاستعارة بعد إكمال القديم تنجح | إثبات القيود الفعلية |

## API tests
تحقق missing/malformed/null UUID، JSON غير صالح، fields إضافية وquantity، query مكرر، missing Employee/Equipment/Loan، mismatch employee، empty lists، content type، success 200/201 وenvelope وtimestamps. غطاء جميع error codes في الوثيقة 06 مع عدم كشف SQL/stack/secrets. تحقق أن equipment state يخص employee المطلوب وأن total/available/activeLoan متسقة داخل snapshot. لكل رفض تُفحص بيانات العمل لا status وحده. اختبر خطأ unique الحقيقي مع migration ولا تكتفِ بـmock عند إثبات القيد.

## Frontend tests
اختيار الموظف ومسحه، عرض المعدات والإجمالي والمتاح، loading/empty/error، Borrow وReturn، pending/guard ضد نقرتين، feedback نجاح، فشل 400/404/409/500، refresh failure بعد commit، network ambiguous ثم refetch، تأخر رد A بعد B، عدم تعطيل Return عند صفر، ولا full reload. اختبارات api-client تشمل non-JSON proxy errors. مراجعة يدويّة بسيطة للوحة المفاتيح وRTL والعرض الضيق تكملها ولا تستبدل السيناريوهات الآلية.

## عزل البيانات والتنسيق
قاعدة اختبار مستقلة عبر TEST_DATABASE_URL. تحقق اسم/هوية القاعدة أنها للاختبار قبل أي reset أو تنظيف؛ لا إعادة استخدام DATABASE_URL افتراضيًا. يُطبق تاريخ migrations كاملًا ثم fixtures محددة. fixtures تعاد بين الاختبارات فقط في القاعدة المعزولة؛ لا wrapping خارجي واحد لكل اختبارات التزامن لأنه قد يخفي locks. اتصالات مستقلة وسعة pool لا تقل عن اثنتين لتداخل حقيقي.

TEST-06 يستخدم barrier قبل محاولة القفل، مع أداة تنسيق داخلية لإبقاء transaction الفائز مفتوحًا حتى يتأكد بدء المنافس، لا حاجز بعد القفل ينتظر طرفًا لا يستطيع الحصول عليه. تنتهي الاختبارات بمهلة اختبار محدودة لتشخيص deadlock، ليست SLA منتج. لا sleep عشوائي كدليل تزامن ولا stress infrastructure.

حقن الفشل dependency اختبارية داخل الخدمة لا endpoint عام أو علم إنتاجي. لا اختبار cleanup على قاعدة المستخدم. تشمل أدلة التنفيذ لاحقًا أوامر ونسخ وأزمنة تشغيل ونواتج وقيم صفوف بعد الفشل/التزامن وقراءة pg_indexes/pg_constraint ومصالحة available+active=total. العدد الحالي للاختبارات المنفذة **صفر**؛ هذه معمارية تحقق لا تقرير نجاح.
