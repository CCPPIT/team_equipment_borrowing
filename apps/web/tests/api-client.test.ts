import { describe, test, expect, vi } from 'vitest'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import { api, ApiError } from '../src/lib/api-client'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import { A, B, X, L, employees, equipment, loan, success, failure } from './fixtures'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
describe('عميل API وتحقيق العقد', () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  test('C01 يقرأ أغلفة الموظفين والمعدات الفعلية', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(success({ employees })).mockResolvedValueOnce(success({ employeeId: A, equipment: [equipment] })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    vi.stubGlobal('fetch', fetcher); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(await api.employees()).toEqual(employees); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect((await api.equipment(A)).equipment).toEqual([equipment]); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(fetcher.mock.calls[0]?.[0]).toBe('/api/employees'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(fetcher.mock.calls[1]?.[0]).toBe(`/api/equipment?employeeId=${A}`); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  test('C02 يرسل body الاستعارة والإرجاع دون حقول زائدة', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(success({ loan }, 201)).mockResolvedValueOnce(success({ loan: { ...loan, returnedAt: '2026-11-18T09:00:00.000Z' } })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    vi.stubGlobal('fetch', fetcher); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await api.borrow(A, X); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await api.returnLoan(A, L); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(fetcher.mock.calls[0]?.[1]?.body).toBe(JSON.stringify({ employeeId: A, equipmentId: X })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(fetcher.mock.calls[1]?.[0]).toBe(`/api/loans/${L}/return`); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(fetcher.mock.calls[1]?.[1]?.body).toBe(JSON.stringify({ employeeId: A })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  test.each(['OUT_OF_STOCK', 'ALREADY_BORROWED', 'ALREADY_RETURNED', 'EMPLOYEE_NOT_FOUND', 'EQUIPMENT_NOT_FOUND', 'LOAN_NOT_FOUND', 'VALIDATION_ERROR', 'INTERNAL_SERVER_ERROR', 'TRANSACTION_CONFLICT'])('C03 يحتفظ برمز الخطأ %s دون عرض تفاصيل خام', async (code) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(failure(code))); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(api.borrow(A, X)).rejects.toMatchObject({ code }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  test('C04 يعالج non-JSON proxy وnetwork errors', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('<html>secret</html>', { status: 502 })).mockRejectedValueOnce(new TypeError('private detail'))); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(api.employees()).rejects.toMatchObject({ code: 'INTERNAL_SERVER_ERROR' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(api.employees()).rejects.toMatchObject({ code: 'NETWORK_ERROR' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  test.each([ // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    { equipment: [equipment] }, { employeeId: B, equipment: [equipment] }, { employeeId: A, equipment: [{ ...equipment, availableQuantity: -1 }] }, // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    { employeeId: A, equipment: [{ ...equipment, activeLoan: { id: 'bad', borrowedAt: 'bad' } }] }, // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  ])('C05 يرفض بنية معدات غير موثوقة %#', async (data) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(success(data))); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(api.equipment(A)).rejects.toMatchObject({ code: 'INVALID_RESPONSE' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  test('C06 يرفض UUID قبل الاتصال', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const fetcher = vi.fn<typeof fetch>(); vi.stubGlobal('fetch', fetcher); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(api.borrow('invalid', X)).rejects.toMatchObject({ code: 'VALIDATION_ERROR' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(fetcher).not.toHaveBeenCalled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  test('C07 لا يقبل mutation response لموظف آخر أو Return غير مكتمل', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValueOnce(success({ loan: { ...loan, employeeId: B } }, 201)).mockResolvedValueOnce(success({ loan }))); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(api.borrow(A, X)).rejects.toMatchObject({ code: 'INVALID_RESPONSE' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(api.returnLoan(A, L)).rejects.toMatchObject({ code: 'INVALID_RESPONSE' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  test('C08 انتهاء مهلة الاتصال يظهر كحالة غامضة ولا يعيد POST', async () => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    vi.useFakeTimers(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const fetcher = vi.fn<typeof fetch>().mockImplementation((_input, init) => new Promise((_resolve, reject) => { init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))); })); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    vi.stubGlobal('fetch', fetcher); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const result = api.borrow(A, X).catch((error: unknown) => error); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await vi.advanceTimersByTimeAsync(15001); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(await result).toBeInstanceOf(ApiError); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(await result).toMatchObject({ code: 'TIMEOUT_ERROR' }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(fetcher).toHaveBeenCalledTimes(1); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
