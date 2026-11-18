import type { Employee, Equipment, Loan } from '../src/types/api'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export const A = '11111111-1111-4111-8111-111111111111'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export const B = '11111111-1111-4111-8111-222222222222'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export const X = '22222222-2222-4222-8222-111111111111'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export const L = '33333333-3333-4333-8333-333333333333'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export const employees: Employee[] = [{ id: A, name: 'أحمد' }, { id: B, name: 'ليلى' }]; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export const equipment: Equipment = { id: X, name: 'شاشة', description: 'شاشة للعمل المشترك', totalQuantity: 2, availableQuantity: 2, activeLoan: null }; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export const loan: Loan = { id: L, employeeId: A, equipmentId: X, borrowedAt: '2026-11-18T08:00:00.000Z', returnedAt: null }; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export const borrowed: Equipment = { ...equipment, availableQuantity: 1, activeLoan: { id: L, borrowedAt: loan.borrowedAt } }; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export function success(data: unknown, status = 200): Response { return new Response(JSON.stringify({ success: true, data }), { status, headers: { 'Content-Type': 'application/json' } }); } // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export function failure(code: string, status = 409): Response { return new Response(JSON.stringify({ success: false, error: { code, message: 'رسالة توضيحية' } }), { status }); } // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
export function deferred<T>() { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  let resolve: (value: T) => void = () => { throw new Error('حاجز غير جاهز'); }; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const promise = new Promise<T>((done) => { resolve = done; }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  return { promise, resolve }; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
} // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
