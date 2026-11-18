'use client'; // المكونات التفاعلية تستخدم مراجع DOM لإدارة التركيز داخل شجرة العميل فقط
import { useEffect, useRef } from 'react'; // تتبع زر الإجراء واستعادة التركيز بعد القراءة المؤكدة دون إضافة حالة عرض
import type { Employee, Equipment } from '../../types/api'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import type { Feedback, PendingAction, LoadState } from './use-borrowing'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import { Icon } from '../../components/icon'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
export function FeedbackPanel({ value }: { value: Feedback }) { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  return <div className={`feedback feedback--${value.kind}`} role={value.kind === 'error' ? 'alert' : 'status'}><span className="feedback-icon"><Icon name={value.kind === 'success' ? 'check' : 'alert'} /></span><div><strong>{value.title}</strong><p>{value.detail}</p>{value.code && <small>رمز الحالة: <bdi>{value.code}</bdi></small>}</div></div>; // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export function LoadingPanel({ label = 'جاري تحميل البيانات' }: { label?: string }) { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  return <div className="loading-panel" role="status"><span className="spinner" aria-hidden="true" /><span>{label}…</span></div>; // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export function EmptyPanel({ title, detail, icon = 'box' }: { title: string; detail: string; icon?: 'box' | 'user' }) { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  return <div className="empty-panel"><span className="empty-icon"><Icon name={icon} size={34} /></span><h3>{title}</h3><p>{detail}</p></div>; // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export function EmployeeSelector({ employees, value, state, error, disabled, onChange, onRetry }: { employees: Employee[]; value: string; state: LoadState; error: string; disabled: boolean; onChange: (id: string) => void; onRetry: () => void }) { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  return ( // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
    // بدء العنصر الجذري للواجهة مع الحفاظ على بنية JSX الصحيحة
    <section className="employee-panel" aria-labelledby="employee-heading">
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <div className="employee-intro"><span className="panel-icon"><Icon name="user" size={24} /></span><div><h2 id="employee-heading">من سيستعير المعدات؟</h2><p id="employee-help">اختر موظفًا لعرض التوفّر واستعاراته الحالية.</p></div></div>
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <div className="employee-control">
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        <div className="employee-label-row"><label htmlFor="employee-select">الموظف المحدد</label><button type="button" className="text-button employee-reload" onClick={onRetry} disabled={disabled || state === 'loading'}>تحديث قائمة الموظفين</button></div>
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        <select id="employee-select" aria-describedby="employee-help" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled || state !== 'ready' || employees.length === 0}>
          {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
          <option value="">اختر موظفًا من القائمة</option>
          {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
          {employees.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        </select>
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        {state === 'loading' && <p className="field-note" role="status">جاري تحميل الموظفين…</p>}
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        {state === 'error' && <div className="field-error" role="alert"><p>{error}</p><button type="button" className="text-button" onClick={onRetry}>إعادة تحميل الموظفين</button></div>}
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        {state === 'ready' && employees.length === 0 && <p className="field-note">لا يوجد موظفون في القائمة حاليًا.</p>}
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      </div>
    {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
    </section>
  ); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export function EquipmentCard({ item, blocked, pending, onAction }: { item: Equipment; blocked: boolean; pending: PendingAction | null; onAction: (item: Equipment) => void }) { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  const active = item.activeLoan !== null; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const empty = item.availableQuantity === 0; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const working = pending?.equipmentId === item.id; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const actionRef = useRef<HTMLButtonElement | null>(null); // حفظ مرجع زر المعدة نفسه طوال دورة الاستعارة والإرجاع
  const restoreFocus = useRef(false); // تذكر ما إذا كانت العملية بدأت من زر يملك التركيز بالفعل
  useEffect(() => { // معالجة الأثر المتعلق بالتركيز فقط بعد انتهاء تحديث الحالة
    if (blocked || working || !restoreFocus.current) return; // عدم إعادة التركيز أثناء قفل العملية أو من دون طلب سابق
    restoreFocus.current = false; // استهلاك الطلب مرة واحدة حتى لا تتكرر إعادة التركيز في التحديثات اللاحقة
    const focused = document.activeElement; // احترام العنصر الذي اختاره المستخدم أثناء الانتظار
    if (!focused || focused === document.body || focused === actionRef.current) actionRef.current?.focus({ preventScroll: true }); // تعويض فقد التركيز الناتج عن disabled دون سرقته من عنصر آخر
  }, [blocked, working]); // إعادة فحص أهلية التركيز عند انتهاء قفل العملية والمصالحة فقط
  const label = active ? 'إرجاع' : 'استعارة'; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  return ( // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
    // بدء العنصر الجذري للواجهة مع الحفاظ على بنية JSX الصحيحة
    <article className={`equipment-card${active ? ' equipment-card--active' : ''}`} aria-labelledby={`equipment-${item.id}`}>
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <div className="card-top"><span className={`equipment-icon${active ? ' equipment-icon--active' : ''}`}><Icon name="equipment" size={28} /></span><span className={`badge ${active ? 'badge--borrowed' : empty ? 'badge--empty' : 'badge--available'}`}><span aria-hidden="true" className="badge-dot" />{active ? 'مستعارة لديك' : empty ? 'غير متاح حاليًا' : 'متاح للاستعارة'}</span></div>
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <h3 id={`equipment-${item.id}`}>{item.name}</h3>
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      {item.description && <p className="card-description">{item.description}</p>}
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <dl className="quantities"><div><dt>إجمالي الوحدات</dt><dd>{item.totalQuantity}</dd></div><div><dt>الوحدات المتاحة</dt><dd className={empty ? 'quantity--empty' : 'quantity--available'}>{item.availableQuantity}</dd></div></dl>
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <p className="loan-state"><Icon name={active ? 'check' : 'user'} size={16} />{active ? 'لديك استعارة نشطة من هذا النوع' : 'لا توجد لديك استعارة نشطة'}</p>
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <button type="button" className={`action-button ${active ? 'action-button--return' : ''}`} disabled={blocked || (!active && empty)} ref={actionRef} onClick={(event) => { restoreFocus.current = document.activeElement === event.currentTarget; onAction(item); }} aria-label={`${label} ${item.name}`} aria-busy={working}>
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        {working ? <><span className="spinner" aria-hidden="true" />{pending.kind === 'borrow' ? 'جاري الاستعارة…' : 'جاري الإرجاع…'}</> : <><span>{!active && empty ? 'نفد المخزون' : `${label} ${active ? 'المعدات' : 'وحدة واحدة'}`}</span><Icon name={active ? 'return' : 'arrow'} size={18} /></>}
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      </button>
    {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
    </article>
  ); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export function EquipmentList({ items, blocked, pending, onAction }: { items: Equipment[]; blocked: boolean; pending: PendingAction | null; onAction: (item: Equipment) => void }) { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  if (!items.length) return <EmptyPanel title="لا توجد معدات حاليًا" detail="قائمة المعدات فارغة. يمكنك إعادة تحميل البيانات لاحقًا." />; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
  return <div className="equipment-grid">{items.map((item) => <EquipmentCard key={item.id} item={item} blocked={blocked} pending={pending} onAction={onAction} />)}</div>; // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
