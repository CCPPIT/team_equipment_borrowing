> Language update: English and Arabic are provided in this file per the owner’s latest instruction. Both sections describe the same requirements; repeated IDs are translations, not new requirements.
> تحديث اللغة: يتضمن هذا الملف الإنجليزية والعربية وفق طلب المالك الأخير؛ المعرّفات المتكررة ترجمة للمتطلبات نفسها وليست متطلبات إضافية.

## English version / النسخة الإنجليزية

# 09 — Test Requirements Matrix

**Status: specified, not executed.** These are six mandatory test families; subcases expand coverage rather than renumbering the required company cases. Transaction/concurrency evidence must eventually use actual PostgreSQL behavior through the backend/Prisma boundary, not mock-only proofs.

| ID | Initial state | Test action | Expected result | Data consistency expectations |
|---|---|---|---|---|
| TEST-01 | Employee A has one active X loan; X still has spare stock | A requests another X loan | State conflict; original active loan remains the only active A/X loan | No new loan, no stock decrement, no change to existing history; BR-01 |
| TEST-02 | A has no active X loan; X total/available starts at 2 | Execute at least three sequential borrow/return cycles, recording identities and balances after each step | Each borrow succeeds with a new loan identity; each return completes that loan; reborrowing remains allowed | Borrow 2→1, return 1→2 on every cycle; after three cycles, three completed records persist and zero active A/X loans; BR-02/03/04/05/08 |
| TEST-03 | One active loan; record available balance s | Return it once, then return the same loan again; also test concurrent repeated returns under TEST-06 | First return succeeds; second returns proposed 409 and makes no change | Final balance s+1, one completed loan, unchanged completion metadata on rejected repeat; BR-05/06 |
| TEST-04 | X availability is zero, reconciled with existing active loans | An eligible different employee requests X | Stock conflict, not success | All business records and balances remain identical; zero never becomes negative; BR-07 |
| TEST-05 | Borrow subcase: positive stock/no active pair; return subcase: an active loan; snapshot business data | In separate subcases inject a deterministic failure after one persisted write inside the borrow transaction and inside the return transaction, before the other write/commit | Each operation fails without reporting success; clear internal error mapping | Borrow leaves no inserted loan and no stock change; return leaves loan active and balance unchanged. Cover failure between writes in the chosen write order; if other ordering exists, cover it too. Use test-only instrumentation, not a product failure-injection endpoint; BR-09 |
| TEST-06 | Independent reset fixtures for four overlap cases below | Start competing operations on separate database connections using a synchronization barrier; observe outcomes and database state | Database-level protection serializes decisions or rejects conflicting transaction; no invariant violation | No negative stock, no duplicate active pair, no lost/extra stock change; retain history and reconcile totals; BR-01/06/09/10 |

## TEST-06 overlap subcases and prevention explanation
1. **Same pair, spare stock:** two concurrent A/X borrow requests with availability ≥ 2. At most one succeeds; exactly one new active A/X loan and one stock decrement if either succeeds.
2. **Different employees, last unit:** concurrent A/X and B/X requests with one available unit. At most one succeeds; if normal requests resolve without injected infrastructure failure, one succeeds and the other conflicts; final availability zero and one additional active loan.
3. **Same loan, repeated return:** concurrent returns of one active loan. Only one completion takes effect and stock increases once; the other request conflicts under the proposed API policy.
4. **Borrow/return overlap for same pair:** A already holds X. Race return of the old loan with a new A/X borrow. If borrow is evaluated first, it conflicts and return succeeds; if return is evaluated first, both may succeed in that order with a new active loan. Never produce two active A/X loans or reuse the completed loan.

The prevention mechanism must cover eligibility checks and both writes in a single protected database transaction. See `04-BUSINESS-RULES.md` for the row-lock candidate and active-only uniqueness consideration. Tests should assert valid outcome sets rather than a specific winning request. A client-side pending flag, sequential test, or in-process mutex is not evidence of database concurrency safety. Use bounded test coordination rather than stress-test infrastructure; no load target is introduced.

## Additional acceptance coverage (within existing requirement IDs)
- FR-01/02: seeded employee load, selection changes and stale response handling.
- FR-03/04/05: equipment rendering, zero stock, and per-employee active state.
- FR-06/07 and NFR-04/05: missing/malformed IDs, nonexistent resources, ownership mismatch, unsupported quantity, stable error codes/statuses.
- FR-10 and NFR-06/07: loading/empty/error/pending states, success refetch, failed action, post-success refresh failure, and no full page reload.

These checks may use unit, API integration, and UI interaction tests as appropriate. The choice of test runner and browser tooling is deferred; no testing dependencies are installed in this phase. Evidence must include test commands, results, and persistence assertions when implemented. A passed documentation check is not a passed software test.

---

## النسخة العربية / Arabic version

# 09 — مصفوفة متطلبات الاختبار

**الحالة: موصوفة ولم تُنفذ.** توجد ست مجموعات اختبار إلزامية؛ الحالات الفرعية توسع التغطية ولا تضيف معرّفات إلزامية جديدة. إثبات المعاملات والتزامن يتطلب PostgreSQL حقيقيًا عبر الخلفية وPrisma، وليس محاكاة فقط.

| المعرّف | الحالة الأولية | إجراء الاختبار | النتيجة المتوقعة | توقعات اتساق البيانات |
|---|---|---|---|---|
| TEST-01 | لدى A استعارة نشطة من X مع بقاء مخزون | يطلب A استعارة X ثانية | تعارض وبقاء السجل النشط الأصلي وحده | لا سجل جديد ولا خصم ولا تعديل للتاريخ؛ BR-01 |
| TEST-02 | لا استعارة نشطة لـ A/X؛ الإجمالي والمتاح 2 | ثلاث دورات استعارة وإرجاع متتابعة على الأقل مع تسجيل الهويات والأرصدة | نجاح كل استعارة بسجل جديد وإكماله بالإرجاع وإمكان التكرار | كل استعارة 2→1 وكل إرجاع 1→2؛ بعد الثالثة توجد ثلاثة سجلات مكتملة ولا نشط؛ BR-02/03/04/05/08 |
| TEST-03 | استعارة نشطة ورصيد متاح s | إرجاعها ثم إرجاع السجل نفسه مجددًا؛ التزامن ضمن TEST-06 | نجاح الأول و409 مقترح للثاني دون تغيير | الرصيد النهائي s+1 وسجل مكتمل واحد وعدم تغيير بيانات الإكمال عند التكرار المرفوض؛ BR-05/06 |
| TEST-04 | المتاح من X صفر ومتطابق مع الاستعارات النشطة | موظف آخر مؤهل يحاول استعارة X | تعارض مخزون لا نجاح | بقاء جميع سجلات العمل والأرصدة كما هي وعدم سلبية المخزون؛ BR-07 |
| TEST-05 | للاستعارة: مخزون موجب ولا نشط مطابق؛ للإرجاع: سجل نشط؛ حفظ لقطة للبيانات | في حالتين منفصلتين، حقن فشل مضبوط بعد كتابة جزء داخل المعاملة وقبل الجزء الآخر أو التثبيت | فشل دون إعلان نجاح مع معالجة واضحة للخطأ الداخلي | الاستعارة لا تترك سجلًا جديدًا أو تغير رصيد؛ الإرجاع يبقي السجل نشطًا والرصيد كما كان. تغطية الفشل بين الكتابتين حسب الترتيب المختار وكل ترتيب مستخدم. الحقن أداة اختبار لا endpoint منتج؛ BR-09 |
| TEST-06 | بيانات معاد تهيئتها لكل حالة تداخل أدناه | تشغيل طلبات متنافسة باتصالات مستقلة وحاجز تنسيق ثم فحص النتائج والقاعدة | حماية قاعدة البيانات تسلسل القرارات أو ترفض المتعارض دون خرق الثوابت | لا سالب أو نشط مكرر أو فقد أو زيادة مخزون؛ حفظ التاريخ ومطابقة الإجمالي؛ BR-01/06/09/10 |

## حالات TEST-06 الفرعية وشرح المنع
1. **الزوج نفسه مع مخزون كافٍ:** طلبا استعارة A/X متزامنان والمتاح 2 أو أكثر. ينجح واحد كحد أقصى؛ عند نجاحه توجد استعارة نشطة جديدة واحدة وخصم واحد.
2. **موظفان وآخر وحدة:** طلبا A/X وB/X والمتاح واحد. ينجح واحد كحد أقصى؛ عند اكتمال الطلبات الطبيعية دون فشل بنية مختلق ينجح أحدهما ويتعارض الآخر، وينتهي المتاح صفرًا مع سجل نشط إضافي واحد.
3. **إرجاعان للسجل نفسه:** يُطبق إكمال واحد وتزيد الوحدة مرة؛ الآخر يتعارض وفق سياسة API المقترحة.
4. **استعارة وإرجاع للزوج نفسه:** لدى A استعارة X. يتنافس إرجاعها مع استعارة جديدة؛ إذا قيّمت الاستعارة أولًا تُرفض ثم ينجح الإرجاع، وإذا نُفذ الإرجاع أولًا قد ينجح الاثنان بهذا الترتيب مع سجل جديد. لا يجوز نشطان أو إعادة استعمال السجل المكتمل.

يجب حماية فحوص الأهلية والكتابتين ضمن معاملة واحدة في قاعدة البيانات. يوضح المستند 04 خيار قفل صف المعدات ودراسة الفرادة للنشط فقط. تُختبر مجموعة النتائج الصحيحة لا فائز بعينه. تعطيل زر أو اختبار متسلسل أو قفل داخل العملية ليس دليلًا على أمان تزامن قاعدة البيانات. يُستخدم تنسيق اختباري محدود دون منصة ضغط أو هدف حمل جديد.

## تغطية قبول إضافية ضمن المعرّفات الحالية
- FR-01/02: تحميل الموظفين وتغيير الاختيار ومعالجة الاستجابة القديمة.
- FR-03/04/05: عرض المعدات والمخزون الصفري وحالة كل موظف.
- FR-06/07 وNFR-04/05: المعرفات المفقودة والمشوهة والموارد الغائبة وعدم تطابق الموظف والكمية غير المدعومة وثبات رموز الأخطاء وحالاتها.
- FR-10 وNFR-06/07: التحميل والفراغ والخطأ والانتظار وتحديث النجاح وفشل الإجراء وفشل التحديث بعد النجاح وعدم التحميل الكامل للصفحة.

يمكن توزيع الفحوص على اختبارات وحدات وتكامل API وتفاعل واجهة حسب الحاجة. اختيار الأدوات والمتصفح مؤجل، ولم تُثبت تبعيات. يتطلب الإثبات اللاحق أوامر تشغيل ونتائج وفحوصًا للبيانات المحفوظة. نجاح فحص الوثيقة لا يعني نجاح اختبار البرنامج.
