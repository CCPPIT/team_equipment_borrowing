# توثيق REST API الفعلي

## قواعد مشتركة
HTTP JSON تحت /api. أسماء الحقول إنجليزية والرسائل عربية. POST يتطلب application/json. UUID قياسي، والمدخلات الإضافية بما فيها quantity مرفوضة؛ لا حذف صامت للحقول أو coercion للأنواع. لا مصادقة أو RBAC؛ اختيار الموظف لا يثبت الهوية. التحقق من تطابق Loan مع الموظف شرط اتساق لا حاجز هوية آمن.

Envelope النجاح success=true وdata، والفشل success=false وerror.code وerror.message، وقد يتضمن error.fields في أخطاء schema. الأوقات ISO 8601 UTC. لا SQL أو stack أو Prisma metadata في الردود. لا pagination أو إدارة موظفين/معدات أو history endpoint.

| Method / URL | الوصف | Query | Path | Body | النجاح | أخطاء محتملة | قواعد العمل |
|---|---|---|---|---|---|---|---|
| GET /api/health | حيوية التطبيق دون بيانات حساسة | لا شيء | لا شيء | لا شيء | 200؛ data={status:"ok"} | 400 عند query إضافية؛ 500 غير متوقع | لا عملية مخزون؛ startup يتحقق من الاتصال أولًا |
| GET /api/employees | قراءة الموظفين المُدخلين مسبقًا | لا شيء | لا شيء | لا شيء | 200؛ data={employees:[{id,name}]} أو [] | 400 مدخلات إضافية؛ 500 قاعدة بيانات | FR-01؛ لا mutation موظفين |
| GET /api/equipment?employeeId={id} | الأنواع والإجمالي والمتاح ونشط الموظف | employeeId إلزامي UUID | لا شيء | لا شيء | 200؛ data={employeeId,equipment:[EquipmentDTO]} | 400 نقص/صيغة/query مكرر/زائد؛ 404 EMPLOYEE_NOT_FOUND؛ 500 | FR-03/04/05؛ قراءة RepeatableRead متسقة، لا حجز مخزون |
| POST /api/loans | استعارة وحدة واحدة | لا شيء | لا شيء | employeeId وequipmentId فقط | 201؛ data={loan:LoanDTO} بعد commit | 400 VALIDATION_ERROR؛ 404 EMPLOYEE_NOT_FOUND/EQUIPMENT_NOT_FOUND؛ 409 ALREADY_BORROWED/OUT_OF_STOCK/TRANSACTION_CONFLICT؛ 500 | P00-BR-01/02/03/04/07/08/09/10 |
| POST /api/loans/{loanId}/return | إكمال استعارة الموظف مرة واحدة | لا شيء | loanId UUID | employeeId فقط | 200؛ data={loan:LoanDTO} بعد commit | 400؛ 404 EMPLOYEE_NOT_FOUND/LOAN_NOT_FOUND بما فيه عدم التطابق؛ 409 ALREADY_RETURNED/TRANSACTION_CONFLICT؛ 500 | P00-BR-05/06/08/09/10 |

مسار غائب يعيد 404 ROUTE_NOT_FOUND. نوع محتوى غير مدعوم يعيد 415 بنمط خطأ موحد. الأخطاء الداخلية 500 INTERNAL_SERVER_ERROR. رمز تعارض المعاملة المعتمد **TRANSACTION_CONFLICT**؛ لم يُستبدل باسم DATABASE_CONFLICT الوارد كاسم مثال في تكليف التنفيذ.

## DTO والاستجابات
EmployeeDTO: id/name فقط. EquipmentDTO: id/name/description nullable/totalQuantity/availableQuantity/activeLoan. activeLoan هو null أو {id,borrowedAt} للموظف المحدد فقط. LoanDTO: id/employeeId/equipmentId/borrowedAt/returnedAt. returnedAt=null يعني نشطًا. لا status مزدوج.

مثال قراءة المعدات (الهويات أمثلة؛ للحصول على الحالية استخدم employees/equipment):
```json
{"success":true,"data":{"employeeId":"11111111-1111-4111-8111-111111111111","equipment":[{"id":"22222222-2222-4222-8222-111111111111","name":"شاشة","description":null,"totalQuantity":2,"availableQuantity":2,"activeLoan":null}]}}
```

مثال Borrow body؛ الحقل الأول هو الموظف والثاني نوع المعدات، ولا كمية يختارها العميل:
```json
{"employeeId":"11111111-1111-4111-8111-111111111111","equipmentId":"22222222-2222-4222-8222-111111111111"}
```

مثال نجاح Borrow (معرف Loan ووقته يولدهما التطبيق فعليًا):
```json
{"success":true,"data":{"loan":{"id":"33333333-3333-4333-8333-333333333333","employeeId":"11111111-1111-4111-8111-111111111111","equipmentId":"22222222-2222-4222-8222-111111111111","borrowedAt":"2026-11-18T08:00:00.000Z","returnedAt":null}}}
```

مثال Return body؛ يستخدم معرّف Loan الحقيقي في المسار:
```json
{"employeeId":"11111111-1111-4111-8111-111111111111"}
```

النجاح يعيد Loan نفسه ومعه returnedAt غير null. طلب Return التالي يعيد 409 ولا يغير returnedAt أو الرصيد. الاستعارة التالية بعد الإرجاع تنشئ Loan جديدًا ولا تعيد استخدام السابق.
```json
{"success":false,"error":{"code":"ALREADY_RETURNED","message":"أُرجعت هذه الاستعارة مسبقًا."}}
```

JSON لا يقبل comments؛ شُرحت الحقول خارجه وفق السياسة المعتمدة. عقد data كائن يحوي equipment وليس array مباشرة؛ اتُّبع عقد Phase 02 بدل المثال التوضيحي المختلف في Phase 03.

## ترتيب التحقق والمعاملات
schema أولًا، ثم وجود Employee؛ في Borrow نوع المعدات تحت القفل، ثم فحص النشط، ثم المتاح. إذا تحقق التكرار والنفاد معًا، ALREADY_BORROWED هو الخطأ السابق وفق التصميم. في Return: قراءة Loan للمطابقة وتحديد النوع دون قفله، ثم قفل Equipment وإعادة قراءة Loan، ثم updateMany بشرط returnedAt=null وعدد متأثر=1، ثم increment. المعاملة تعيد كل الكتابات إذا فشلت خطوة.

ReadCommitted + SELECT FOR UPDATE عبر tx وبقيم مربوطة؛ نفس ترتيب النوع أولًا في العمليتين. لا findFirst غير محمي أو mutex داخل العملية فقط. partial unique حارس في DB مستقل عن UI. الخطأ المعروف منه 409 بعد rollback؛ أخطاء قيود أخرى غير متوقعة 500 لا رسالة مضللة.

## التعافي من التعارض والشبكة
بعد 409 يُجلب GET equipment لتحديث الحالة. بعد نجاح Borrow/Return تُجلب القائمة؛ الرد لا يلزم إرجاع stock. إذا ضاعت استجابة commit أو حدث فشل اتصال لا تُكرر mutation تلقائيًا؛ fetch الحالة أولًا. المعاملات تمنع الحالة الجزئية ولا تعد بـexactly-once عبر الشبكة. لا يقال للمستخدم إن rollback مؤكد عندما نتيجة commit غامضة.

## تجربة قراءة محلية
```bash
curl -sS http://127.0.0.1:3001/api/health # قراءة حيوية الخادم
curl -sS http://127.0.0.1:3001/api/employees # قراءة الهويات المُدخلة مسبقًا
curl -sS 'http://127.0.0.1:3001/api/equipment?employeeId=11111111-1111-4111-8111-111111111111' # قراءة المتاح وحالة الموظف
```

نفذت قراءات HTTP فعلية مكافئة عبر urllib وسُجلت في evidence/live-http-smoke.json. اختبارات POST الفعلية تمت عبر Fastify inject على قواعد PostgreSQL معزولة، لا على بيانات التطوير. لم ندّع تنفيذ أوامر curl المكتوبة هنا إن لم تُشغل حرفيًا.
