# 07 — تصميم الواجهة وحالتها

## الشاشة والمكونات
Next.js App Router بصفحة واحدة؛ layout/page غلاف، وBorrowingScreen هو Client Component. لا Server Actions لقواعد الاستعارة ولا ORM في الويب. RTL ونصوص عربية وتسميات أزرار واضحة؛ معرفات وعقود إنجليزية. عرض بسيط مرن لشاشة ضيقة ولوحة مفاتيح، دون ادعاء شهادة accessibility أو تصميم بصري معقد.

| المكون داخل features/borrowing | دوره |
|---|---|
| BorrowingScreen | تنسيق الحالة والرسائل والطلبات |
| EmployeeSelector | select مسمى مع خيار أولي «اختر موظفًا» |
| EquipmentList | قائمة أو حالة فراغ |
| EquipmentCard | الاسم والوصف والإجمالي والمتاح وحالة النشط |
| LoanAction | زر واحد يتحول Borrow/Return حسب activeLoan؛ لا ملفان متطابقان بلا حاجة |
| useBorrowing | useState/useEffect وrequest token وpending guard وإعادة الجلب |
| api-client في lib | URLs نسبية وفك envelope ومعالجة HTTP/الشبكة |

لا Redux أو Zustand أو query library أو form library. fetch وReact state كافيان. DTO فقط في types/api.ts، والواجهة ليست مرجع صحة المخزون.

## نموذج الحالة
employees وemployeesLoadState، selectedEmployeeId، equipmentData المرتبط بالموظف، equipmentLoadState، pendingAction (employeeId/equipmentId/loanId/action أو null)، feedback، requestVersion. لا حفظ كمية مشتقة مستقلة تتقادم. يبدأ الاختيار فارغًا عمدًا؛ جلب الموظفين أولًا ثم equipment عند الاختيار.

| الحالة | العرض وسلوك الأزرار |
|---|---|
| Initial Loading | مؤشر تحميل الموظفين ثم معدات الموظف بعد اختياره؛ لا صفر مصطنع |
| No Selection | طلب اختيار؛ لا GET equipment أو mutations بهوية غائبة |
| Empty Employees | رسالة لا موظفين أوليين؛ لا شاشة إنشاء |
| Empty Equipment | رسالة لا معدات؛ مختلفة عن وجود معدات مخزونها صفر |
| Error Loading | رسالة عربية وزر إعادة جلب؛ لا إظهار بيانات موظف آخر |
| Pending | مؤشر للإجراء؛ تعطيل كل mutations ومحدد الموظف مؤقتًا لتبسيط الاتساق |
| Validation | رسالة مفهومة قرب السياق؛ لا تعديل محلي كأنه نجح |
| Success Borrow | إعلان نجاح وإعادة جلب؛ Borrow يتحول Return وفق النتيجة الجديدة |
| Success Return | إعلان نجاح وإعادة جلب؛ إتاحة Borrow عند التوفر |
| Out of Stock | شارة نفاد وتعطيل Borrow فقط؛ Return لنشط موجود يبقى متاحًا |
| Already Borrowed | عرض الاستعارة النشطة وزر Return؛ لا زر استعارة ثانية |
| Failed Action | خطأ مع بيانات موثوقة وإعادة جلب عند 409؛ يسمح بإعادة محاولة يدوية بعد المزامنة |
| Refresh Failed After Success | «نجحت العملية وتعذر تحديث العرض»؛ منع mutation على البيانات المتقادمة حتى إعادة جلب ناجحة |
| Ambiguous Network Result | «تعذر تأكيد النتيجة»؛ refetch قبل السماح بالمحاولة، لا إعلان rollback أو نجاح بلا دليل |

## المزامنة ومنع التكرار
لا Optimistic Updates. قبل fetch تُلتقط هوية الموظف ويزاد requestVersion؛ الرد يُطبق فقط إذا وافق الاختيار ورقم أحدث طلب. AbortController يوفر إلغاء القراءات؛ لا يُفترض أن abort ألغى mutation في الخلفية. تغيير الموظف يمسح معدات القديم من العرض. تعطيل selector أثناء mutation يبسط الاستجابة، مع بقاء token check للقراءات المتأخرة.

عند click يُفحص guard متزامن ref قبل بدء الطلب ثم تضبط pending؛ تعطيل الزر وحده قد لا يسبق نقرتين في نفس tick. لا تتاح mutations حتى اكتمال refresh. finally يحرر guard بعد معالجة الحالة، ولا يحول فشل الجلب إلى تكرار استعارة. إعادة تحميل قائمة المعدات تعكس قراءة حديثة لا اشتراكًا آنيًا في تغييرات الآخرين؛ الخلفية قد ترفض حتى لو بدا stock متاحًا.

تُربط labels بالحقول، وتعلن الرسائل بمنطقة live مناسبة، ويظهر focus وحالة disabled. لا تعديل هوية الموظف تلقائيًا بعد فشل طلب. تحديث كل هذا دون full-page reload.
