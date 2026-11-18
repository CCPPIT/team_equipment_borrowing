'use client'; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
import { useCallback, useEffect, useRef, useState } from 'react'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import { api, asApiError, uncertain } from '../../lib/api-client'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import type { Employee, Equipment } from '../../types/api'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
export type LoadState = 'idle' | 'loading' | 'ready' | 'error'; // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
export interface Feedback { kind: 'success' | 'error' | 'warning'; title: string; detail: string; code?: string; } // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
export interface PendingAction { equipmentId: string; kind: 'borrow' | 'return'; } // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
export function useBorrowing() { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  const [employees, setEmployees] = useState<Employee[]>([]); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const [employeesState, setEmployeesState] = useState<LoadState>('loading'); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const [employeesError, setEmployeesError] = useState(''); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const [selectedId, setSelectedId] = useState(''); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const [equipment, setEquipment] = useState<Equipment[]>([]); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const [equipmentState, setEquipmentState] = useState<LoadState>('idle'); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const [equipmentError, setEquipmentError] = useState(''); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const [pending, setPending] = useState<PendingAction | null>(null); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const [needsSync, setNeedsSync] = useState(false); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const [feedback, setFeedback] = useState<Feedback | null>(null); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const mounted = useRef(false); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const snapshotEmployee = useRef(''); // ربط صلاحية الإجراءات بقراءة مؤكدة للموظف نفسه قبل تحديث React
  const selectedRef = useRef(''); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const actionGuard = useRef(false); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const employeeVersion = useRef(0); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const equipmentVersion = useRef(0); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const employeeAbort = useRef<AbortController | null>(null); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const equipmentAbort = useRef<AbortController | null>(null); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const loadEmployees = useCallback((): Promise<void> => { // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
    const version = ++employeeVersion.current; // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
    employeeAbort.current?.abort(); // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
    const controller = new AbortController(); // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
    employeeAbort.current = controller; // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
    return api.employees(controller.signal).then((data) => { // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
      if (!mounted.current || version !== employeeVersion.current) return; // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
      if (selectedRef.current && !data.some((item) => item.id === selectedRef.current)) { selectedRef.current = ''; snapshotEmployee.current = ''; equipmentVersion.current++; equipmentAbort.current?.abort(); setSelectedId(''); setEquipment([]); setEquipmentState('idle'); setNeedsSync(false); setFeedback({ kind: 'error', title: 'الموظف لم يعد في القائمة', detail: 'اختر موظفًا متاحًا من القائمة المحدّثة.', code: 'EMPLOYEE_NOT_FOUND' }); } // إسقاط السياق القديم إن لم يعد الموظف موجودًا في البيانات المؤكدة
      setEmployees(data); // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
      setEmployeesState('ready'); // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
    }, (error: unknown) => { // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
      if (!mounted.current || version !== employeeVersion.current || controller.signal.aborted) return; // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
      setEmployeesState('error'); // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
      setEmployeesError(asApiError(error).message); // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
    }); // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
  }, []); // تحديث القراءة عند اكتمال الاتصال الخارجي فقط دون setState متزامن في التأثير
  const loadEquipment = useCallback(async (employeeId: string): Promise<boolean> => { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    const version = ++equipmentVersion.current; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    equipmentAbort.current?.abort(); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    const controller = new AbortController(); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    equipmentAbort.current = controller; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    snapshotEmployee.current = ''; // إبطال أهلية الإرسال فور بدء إعادة القراءة
    setEquipmentState('loading'); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    setEquipmentError(''); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    try { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      const data = await api.equipment(employeeId, controller.signal); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      if (!mounted.current || version !== equipmentVersion.current || selectedRef.current !== employeeId) return false; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
      snapshotEmployee.current = employeeId; // إعادة الأهلية فقط بعد استجابة سليمة مطابقة لسياق الموظف
      setEquipment(data.equipment); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      setEquipmentState('ready'); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      setNeedsSync(false); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      return true; // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
    } catch (error) { // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
      if (!mounted.current || version !== equipmentVersion.current || selectedRef.current !== employeeId || controller.signal.aborted) return false; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
      setEquipmentState('error'); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      setEquipmentError(asApiError(error).message); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      setNeedsSync(true); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      return false; // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
    } // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  }, []); // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  const cancelReads = useCallback(() => { employeeVersion.current++; equipmentVersion.current++; employeeAbort.current?.abort(); equipmentAbort.current?.abort(); }, []); // إلغاء القراءات وتحييد الاستجابات المتأخرة عند مغادرة الشاشة
  const retryEmployees = useCallback(() => { setEmployeesState('loading'); setEmployeesError(''); void loadEmployees(); }, [loadEmployees]); // بدء إعادة المحاولة من حدث المستخدم دون تحديث متزامن داخل التأثير
  useEffect(() => { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    mounted.current = true; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    void loadEmployees(); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    return () => { mounted.current = false; cancelReads(); }; // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
  }, [loadEmployees, cancelReads]); // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  const selectEmployee = useCallback((id: string) => { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    if (actionGuard.current) return; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    if (id && !employees.some((item) => item.id === id)) { setFeedback({ kind: 'error', title: 'اختيار غير صالح', detail: 'اختر موظفًا من القائمة المتاحة.', code: 'VALIDATION_ERROR' }); return; } // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    snapshotEmployee.current = ''; // منع أي نقرة قديمة بين تغيير الاختيار وإعادة الرسم
    selectedRef.current = id; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    equipmentVersion.current++; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    equipmentAbort.current?.abort(); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    setSelectedId(id); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    setEquipment([]); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    setFeedback(null); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    setNeedsSync(false); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    setEquipmentError(''); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    setEquipmentState(id ? 'loading' : 'idle'); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    if (id) void loadEquipment(id); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
  }, [employees, loadEquipment]); // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  const retryEquipment = useCallback(() => { if (!actionGuard.current && selectedRef.current) void loadEquipment(selectedRef.current); }, [loadEquipment]); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  const act = useCallback(async (item: Equipment) => { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    const employeeId = selectedRef.current; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    if (actionGuard.current || employeesState !== 'ready' || !employees.some((employee) => employee.id === employeeId) || !employeeId || snapshotEmployee.current !== employeeId || equipmentState !== 'ready' || needsSync || !equipment.some((current) => current.id === item.id)) return; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    if (!item.activeLoan && item.availableQuantity === 0) return; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    actionGuard.current = true; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    const kind = item.activeLoan ? 'return' : 'borrow'; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    setPending({ kind, equipmentId: item.id }); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    setFeedback(null); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    try { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      if (item.activeLoan) await api.returnLoan(employeeId, item.activeLoan.id); else await api.borrow(employeeId, item.id); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
      if (!mounted.current) return; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
      setNeedsSync(true); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      setFeedback({ kind: 'success', title: kind === 'borrow' ? 'تمت الاستعارة بنجاح' : 'تم الإرجاع بنجاح', detail: kind === 'borrow' ? `سُجلت استعارة وحدة واحدة من ${item.name}.` : `سُجل إرجاع ${item.name} وحُفظت الاستعارة في السجل.` }); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      const refreshed = await loadEquipment(employeeId); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      if (!refreshed && mounted.current) setFeedback({ kind: 'warning', title: kind === 'borrow' ? 'تمت الاستعارة، وتعذر تحديث العرض' : 'تم الإرجاع، وتعذر تحديث العرض', detail: 'العملية نجحت بالفعل. أعد تحميل الحالة فقط؛ لا تكرر العملية.', code: 'REFRESH_FAILED' }); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    } catch (error) { // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
      if (!mounted.current) return; // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
      const apiError = asApiError(error); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      setNeedsSync(true); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      setFeedback({ kind: uncertain(apiError) ? 'warning' : 'error', title: uncertain(apiError) ? 'تعذر تأكيد نتيجة العملية' : 'لم تكتمل العملية', detail: apiError.message, code: apiError.code }); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      await loadEquipment(employeeId); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    } finally { // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
      actionGuard.current = false; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
      if (mounted.current) setPending(null); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
    } // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  }, [employees, employeesState, equipmentState, needsSync, equipment, loadEquipment]); // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  return { employees, employeesState, employeesError, selectedId, equipment, equipmentState, equipmentError, pending, needsSync, feedback, loadEmployees: retryEmployees, selectEmployee, retryEquipment, act }; // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
