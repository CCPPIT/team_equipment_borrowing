'use client'; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
import { Icon } from '../../components/icon'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import { useBorrowing } from './use-borrowing'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import { EmployeeSelector, EquipmentList, EmptyPanel, LoadingPanel, FeedbackPanel } from './components'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
export function BorrowingScreen() { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  const model = useBorrowing(); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const selected = model.employees.find((item) => item.id === model.selectedId); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const fresh = model.equipmentState === 'ready' && !model.needsSync; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const blocked = Boolean(model.pending) || !fresh || model.employeesState !== 'ready'; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const summaries = [ // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    { label: 'أنواع المعدات', value: model.equipment.length, icon: 'box', caption: 'معدات مشتركة للفريق' }, // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    { label: 'وحدات متاحة', value: model.equipment.reduce((sum, item) => sum + item.availableQuantity, 0), icon: 'equipment', caption: 'بحسب آخر قراءة للمخزون' }, // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    { label: 'استعاراتك النشطة', value: model.equipment.filter((item) => item.activeLoan).length, icon: 'check', caption: selected ? `للموظف ${selected.name}` : 'تظهر بعد اختيار الموظف' }, // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  ] as const; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  return ( // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
    // بدء العنصر الجذري للواجهة مع الحفاظ على بنية JSX الصحيحة
    <div className="workspace">
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <EmployeeSelector employees={model.employees} value={model.selectedId} state={model.employeesState} error={model.employeesError} disabled={Boolean(model.pending)} onChange={model.selectEmployee} onRetry={() => void model.loadEmployees()} />
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <div className="summary-grid" aria-label="ملخص المعدات">
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        {summaries.map((summary) => <section className="summary-card" key={summary.label}><div><p>{summary.label}</p><strong>{fresh ? summary.value : '—'}</strong><small>{summary.caption}</small></div><span className="summary-icon"><Icon name={summary.icon} size={23} /></span></section>)}
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      </div>
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      {model.feedback && <FeedbackPanel value={model.feedback} />}
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <section className="catalog-section" aria-labelledby="catalog-heading" aria-busy={model.equipmentState === 'loading'}>
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        <div className="section-heading"><div><p className="eyebrow">المخزون المشترك</p><h2 id="catalog-heading">المعدات المتاحة للفريق</h2><p className="section-description">استعر ما تحتاجه، وأعده ليكون متاحًا لزملائك.</p></div>{model.selectedId && <button type="button" className="secondary-button" disabled={Boolean(model.pending) || model.equipmentState === 'loading'} onClick={model.retryEquipment}><Icon name="refresh" size={18} />تحديث الحالة</button>}</div>
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        {!model.selectedId && <EmptyPanel icon="user" title="ابدأ باختيار موظف" detail="اختر اسمك من القائمة أعلاه لعرض المعدات المتاحة وحالة استعاراتك." />}
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        {model.selectedId && model.equipmentState === 'loading' && <LoadingPanel label={model.equipment.length ? 'جاري تحديث المخزون' : 'جاري تحميل المعدات'} />}
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        {model.selectedId && model.equipmentState === 'error' && <div className="read-error" role="alert"><Icon name="alert" /><div><h3>تعذر تحديث المعدات</h3><p>{model.equipmentError}</p><p>الإجراءات متوقفة حتى تحميل حالة مؤكدة.</p></div><button type="button" className="secondary-button" disabled={Boolean(model.pending)} onClick={model.retryEquipment}>إعادة تحميل المعدات</button></div>}
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        {model.selectedId && (model.equipmentState === 'ready' || model.equipment.length > 0) && <EquipmentList items={model.equipment} blocked={blocked} pending={model.pending} onAction={(item) => void model.act(item)} />}
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      </section>
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <aside className="rules-note" aria-label="قواعد الاستعارة"><span className="rules-icon"><Icon name="shield" size={25} /></span><div><h2>استعارة بسيطة، ومعدات متاحة للجميع.</h2><p>وحدة واحدة من كل نوع لكل موظف. يمكنك استعارة النوع نفسه مجددًا بعد إرجاعه، عند توفر المخزون.</p></div></aside>
    {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
    </div>
  ); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
