import { beforeEach, test, expect, vi } from 'vitest'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import userEvent from '@testing-library/user-event'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import { BorrowingScreen } from '../src/features/borrowing/borrowing-screen'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import { A, B, employees, equipment, borrowed, loan, success, failure, deferred } from './fixtures'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
const fetcher = vi.fn<typeof fetch>(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
beforeEach(() => { fetcher.mockReset(); vi.stubGlobal('fetch', fetcher); }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
function defaults() { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockImplementation(async (input) => String(input).endsWith('/employees') ? success({ employees }) : success({ employeeId: A, equipment: [equipment] })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
} // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
async function choose(id = A) { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await screen.findByRole('option', { name: 'أحمد' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await userEvent.selectOptions(screen.getByRole('combobox', { name: 'الموظف المحدد' }), id); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
} // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F01 البداية لا تسمح بعملية قبل اختيار موظف', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  defaults(); render(<BorrowingScreen />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('status')).toHaveTextContent('جاري تحميل الموظفين'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await screen.findByRole('option', { name: 'أحمد' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.queryByRole('button', { name: 'استعارة شاشة' })).not.toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(fetcher.mock.calls.every((call) => String(call[0]).endsWith('/employees'))).toBe(true); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F02 اختيار موظف ثم Borrow وReturn مع إعادة جلب الرصيد', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  let active = false; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockImplementation(async (input, init) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (String(input).endsWith('/employees')) return success({ employees }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (init?.method === 'POST') { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
      const returning = String(input).endsWith('/return'); active = !returning; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
      return success({ loan: { ...loan, returnedAt: returning ? '2026-11-18T09:00:00.000Z' : null } }, returning ? 200 : 201); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    } // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    return success({ employeeId: A, equipment: [active ? borrowed : equipment] }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); await choose(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await userEvent.click(await screen.findByRole('button', { name: 'استعارة شاشة' })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('button', { name: 'إرجاع شاشة' })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('status')).toHaveTextContent('تمت الاستعارة بنجاح'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await userEvent.click(screen.getByRole('button', { name: 'إرجاع شاشة' })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('button', { name: 'استعارة شاشة' })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('status')).toHaveTextContent('تم الإرجاع بنجاح'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F03 Pending يمنع نقرتين وتبديل الموظف حتى وصول الحالة المؤكدة', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const mutation = deferred<Response>(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockImplementation(async (input, init) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (String(input).endsWith('/employees')) return success({ employees }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (init?.method === 'POST') return mutation.promise; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    return success({ employeeId: A, equipment: [equipment] }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); await choose(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const button = await screen.findByRole('button', { name: 'استعارة شاشة' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fireEvent.click(button); fireEvent.click(button); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(button).toBeDisabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('combobox', { name: 'الموظف المحدد' })).toBeDisabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(fetcher.mock.calls.filter((call) => call[1]?.method === 'POST')).toHaveLength(1); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await act(async () => mutation.resolve(success({ loan }, 201))); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await waitFor(() => expect(screen.getByRole('combobox')).toBeEnabled()); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F04 فشل موظفين وRetry يعيد التحميل', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockRejectedValueOnce(new TypeError('offline')).mockResolvedValue(success({ employees })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('alert')).toHaveTextContent('تعذر الاتصال'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await userEvent.click(screen.getByRole('button', { name: 'إعادة تحميل الموظفين' })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('option', { name: 'أحمد' })).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F05 فراغ الموظفين لا يصبح فشل معدات', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockResolvedValue(success({ employees: [] })); render(<BorrowingScreen />); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByText('لا يوجد موظفون في القائمة حاليًا.')).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('combobox')).toBeDisabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F06 القائمة الفارغة بعد اختيار صالح', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockResolvedValueOnce(success({ employees })).mockResolvedValue(success({ employeeId: A, equipment: [] })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); await choose(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('heading', { name: 'لا توجد معدات حاليًا' })).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F07 فشل المعدات يعرض Retry دون إتاحة إجراءات قديمة', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockResolvedValueOnce(success({ employees })).mockRejectedValueOnce(new TypeError('offline')).mockResolvedValue(success({ employeeId: A, equipment: [equipment] })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); await choose(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await userEvent.click(await screen.findByRole('button', { name: 'إعادة تحميل المعدات' })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('button', { name: 'استعارة شاشة' })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F08 مخزون صفر يعطل الاستعارة وحالة مستعارة تعرض الإرجاع', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockResolvedValueOnce(success({ employees })).mockResolvedValue(success({ employeeId: A, equipment: [{ ...equipment, availableQuantity: 0 }] })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); await choose(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('button', { name: 'استعارة شاشة' })).toBeDisabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByText('غير متاح حاليًا')).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F09 تعارض نفاد أثناء الطلب يظهر الخطأ ثم يقرأ الحالة الجديدة', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  let unavailable = false; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockImplementation(async (input, init) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (String(input).endsWith('/employees')) return success({ employees }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (init?.method === 'POST') { unavailable = true; return failure('OUT_OF_STOCK'); } // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    return success({ employeeId: A, equipment: [{ ...equipment, availableQuantity: unavailable ? 0 : 2 }] }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); await choose(); await userEvent.click(await screen.findByRole('button', { name: 'استعارة شاشة' })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('alert')).toHaveTextContent('OUT_OF_STOCK'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await waitFor(() => expect(screen.getByRole('button', { name: 'استعارة شاشة' })).toBeDisabled()); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F10 نجاح مع فشل refresh لا يعاد كفشل mutation ولا يكرر POST', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  let reads = 0; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockImplementation(async (input, init) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (String(input).endsWith('/employees')) return success({ employees }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (init?.method === 'POST') return success({ loan }, 201); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    reads++; if (reads === 2) throw new TypeError('offline'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    return success({ employeeId: A, equipment: [reads > 2 ? borrowed : equipment] }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); await choose(); await userEvent.click(await screen.findByRole('button', { name: 'استعارة شاشة' })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByText('تمت الاستعارة، وتعذر تحديث العرض')).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('button', { name: 'استعارة شاشة' })).toBeDisabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await userEvent.click(screen.getByRole('button', { name: 'إعادة تحميل المعدات' })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('button', { name: 'إرجاع شاشة' })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(fetcher.mock.calls.filter((call) => call[1]?.method === 'POST')).toHaveLength(1); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F11 network ambiguous يعيد GET قبل السماح بإجراء جديد', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  let changed = false; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockImplementation(async (input, init) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (String(input).endsWith('/employees')) return success({ employees }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (init?.method === 'POST') { changed = true; throw new TypeError('lost response'); } // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    return success({ employeeId: A, equipment: [changed ? borrowed : equipment] }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); await choose(); await userEvent.click(await screen.findByRole('button', { name: 'استعارة شاشة' })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByText('تعذر تأكيد نتيجة العملية')).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('button', { name: 'إرجاع شاشة' })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(fetcher.mock.calls.filter((call) => call[1]?.method === 'POST')).toHaveLength(1); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F12 استجابة A المتأخرة لا تظهر في سياق B', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const slowA = deferred<Response>(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockImplementation(async (input) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (String(input).endsWith('/employees')) return success({ employees }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (String(input).includes(A)) return slowA.promise; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    return success({ employeeId: B, equipment: [{ ...equipment, name: 'معدات ليلى' }] }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); await choose(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await userEvent.selectOptions(screen.getByRole('combobox'), B); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByRole('article', { name: 'معدات ليلى' })).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await act(async () => slowA.resolve(success({ employeeId: A, equipment: [borrowed] }))); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.queryByRole('article', { name: 'شاشة' })).not.toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('button', { name: 'استعارة معدات ليلى' })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F13 فشل Return لا يزيد المخزون ولا يخفي الاستعارة', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  fetcher.mockImplementation(async (input, init) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (String(input).endsWith('/employees')) return success({ employees }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    if (init?.method === 'POST') return failure('INTERNAL_SERVER_ERROR', 500); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    return success({ employeeId: A, equipment: [borrowed] }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  render(<BorrowingScreen />); await choose(); await userEvent.click(await screen.findByRole('button', { name: 'إرجاع شاشة' })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(await screen.findByText('تعذر تأكيد نتيجة العملية')).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await waitFor(() => expect(screen.getByRole('button', { name: 'إرجاع شاشة' })).toBeEnabled()); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.queryByRole('button', { name: 'استعارة شاشة' })).not.toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('F14 مسح الموظف يمنع جميع إجراءات المخزون', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  defaults(); render(<BorrowingScreen />); await choose(); await screen.findByRole('button', { name: 'استعارة شاشة' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await userEvent.selectOptions(screen.getByRole('combobox'), ''); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.queryByRole('article')).not.toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(screen.getByRole('heading', { name: 'ابدأ باختيار موظف' })).toBeInTheDocument(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test.each(['ALREADY_BORROWED', 'TRANSACTION_CONFLICT', 'EMPLOYEE_NOT_FOUND', 'EQUIPMENT_NOT_FOUND', 'VALIDATION_ERROR'])('F15 مصالحة الخطأ %s دون تكرار mutation', async (code) => { // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  fetcher.mockImplementation(async (input, init) => { // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
    if (String(input).endsWith('/employees')) return success({ employees }); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
    if (init?.method === 'POST') return failure(code); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
    return success({ employeeId: A, equipment: [equipment] }); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  }); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  render(<BorrowingScreen />); await choose(); await userEvent.click(await screen.findByRole('button', { name: 'استعارة شاشة' })); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  expect(await screen.findByRole('alert')).toHaveTextContent(code); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  await waitFor(() => expect(screen.getByRole('button', { name: 'استعارة شاشة' })).toBeEnabled()); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  expect(fetcher.mock.calls.filter((call) => call[1]?.method === 'POST')).toHaveLength(1); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
}); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
test('F16 تحديث قائمة الموظفين يسقط الموظف المحذوف والسياق القديم', async () => { // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  let removed = false; // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  fetcher.mockImplementation(async (input) => { // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
    if (String(input).endsWith('/employees')) return success({ employees: removed ? [employees[1]] : employees }); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
    return success({ employeeId: A, equipment: [equipment] }); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  }); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  render(<BorrowingScreen />); await choose(); await screen.findByRole('button', { name: 'استعارة شاشة' }); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  removed = true; await userEvent.click(screen.getByRole('button', { name: 'تحديث قائمة الموظفين' })); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  expect(await screen.findByRole('alert')).toHaveTextContent('EMPLOYEE_NOT_FOUND'); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
  expect(screen.queryByRole('article')).not.toBeInTheDocument(); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
}); // التحقق من تعافي السياق ومصالحة الأخطاء دون إعادة كتابة
