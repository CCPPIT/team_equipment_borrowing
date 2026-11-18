import { test, expect, vi } from 'vitest'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import { render, screen } from '@testing-library/react'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import userEvent from '@testing-library/user-event'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import { EmployeeSelector, EquipmentCard, EquipmentList, LoadingPanel, FeedbackPanel } from '../src/features/borrowing/components'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import { A, equipment, employees, borrowed } from './fixtures'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('V01 محدد الموظف مسمى ويستدعي الاختيار الصحيح', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const onChange = vi.fn(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<EmployeeSelector employees={employees} value="" state="ready" error="" disabled={false} onChange={onChange} onRetry={() => {}} />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await userEvent.selectOptions(screen.getByRole('combobox', { name: 'الموظف المحدد' }), A); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(onChange).toHaveBeenCalledWith(A); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('V02 بطاقة المعدات تعرض الإجمالي والمتاح والوصف', () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<EquipmentCard item={equipment} blocked={false} pending={null} onAction={() => {}} />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('article', { name: 'شاشة' })).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByText('شاشة للعمل المشترك')).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('button', { name: 'استعارة شاشة' })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('V03 نفاد المخزون يعطل Borrow وليس Return', () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const { rerender } = render(<EquipmentCard item={{ ...equipment, availableQuantity: 0 }} blocked={false} pending={null} onAction={() => {}} />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('button', { name: 'استعارة شاشة' })).toBeDisabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  rerender(<EquipmentCard item={{ ...borrowed, availableQuantity: 0 }} blocked={false} pending={null} onAction={() => {}} />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('button', { name: 'إرجاع شاشة' })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('V04 القائمة الفارغة والتحميل مميزان', () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const { rerender } = render(<EquipmentList items={[]} blocked={false} pending={null} onAction={() => {}} />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('heading', { name: 'لا توجد معدات حاليًا' })).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  rerender(<LoadingPanel />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('status')).toHaveTextContent('جاري تحميل البيانات'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('V05 رسائل الخطأ والنجاح قابلة للإدراك', () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const { rerender } = render(<FeedbackPanel value={{ kind: 'error', title: 'فشل', detail: 'تعذر الاتصال', code: 'NETWORK_ERROR' }} />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('alert')).toHaveTextContent('NETWORK_ERROR'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  rerender(<FeedbackPanel value={{ kind: 'success', title: 'نجاح', detail: 'تم الإرجاع' }} />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('status')).toHaveTextContent('تم الإرجاع'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي

test('V06 يستعيد تركيز زر الإجراء بعد pending ولا يسرقه من عنصر آخر', async () => { // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  const user = userEvent.setup(); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  const props = { item: equipment, blocked: false, pending: null, onAction: () => {} }; // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  const { rerender } = render(<><button type="button">عنصر آخر</button><EquipmentCard {...props} /></>); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  let button = screen.getByRole('button', { name: 'استعارة شاشة' }); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  button.focus(); await user.keyboard('{Enter}'); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  rerender(<><button type="button">عنصر آخر</button><EquipmentCard {...props} blocked pending={{ kind: 'borrow', equipmentId: equipment.id }} /></>); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  screen.getByRole('button', { name: 'عنصر آخر' }).focus(); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  rerender(<><button type="button">عنصر آخر</button><EquipmentCard {...props} item={borrowed} /></>); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  expect(screen.getByRole('button', { name: 'عنصر آخر' })).toHaveFocus(); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  button = screen.getByRole('button', { name: 'إرجاع شاشة' }); button.focus(); await user.keyboard('{Enter}'); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  rerender(<><button type="button">عنصر آخر</button><EquipmentCard {...props} item={borrowed} blocked pending={{ kind: 'return', equipmentId: equipment.id }} /></>); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  button.blur(); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  rerender(<><button type="button">عنصر آخر</button><EquipmentCard {...props} /></>); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
  expect(screen.getByRole('button', { name: 'استعارة شاشة' })).toHaveFocus(); // التحقق من استعادة التركيز عند انتهاء العملية واحترام اختيار المستخدم
}); // نهاية اختبار انحدار الوصول بلوحة المفاتيح
