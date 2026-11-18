import { beforeAll, afterAll, beforeEach, afterEach, describe, test, expect } from 'vitest'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import { randomUUID } from 'node:crypto'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import type { FastifyInstance } from 'fastify'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import { buildApp } from '../../src/app.js'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import { borrow, returnLoan } from '../../src/services/loans.js'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import { seedData, employeeIds, equipmentIds } from '../../src/services/seed-data.js'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import { classifyError } from '../../src/lib/errors.js'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import { db, env, A, B, X, Y, Z, UNKNOWN, reset, assertInvariant, assertTestDatabase, overlapping, loanInput } from '../helpers/database.js'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
let app: FastifyInstance; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
async function post(employeeId = A, equipmentId = X) { return app.inject({ method: 'POST', url: '/api/loans', payload: { employeeId, equipmentId } }); } // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
async function sendReturn(id: string, employeeId = A) { return app.inject({ method: 'POST', url: `/api/loans/${id}/return`, payload: { employeeId } }); } // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
describe('PostgreSQL حقيقي وتطبيق Fastify', () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  beforeAll(async () => { await assertTestDatabase(); app = await buildApp(env, db); }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  beforeEach(reset); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  afterEach(assertInvariant); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  afterAll(async () => { if (app) await app.close(); await db.$disconnect(); }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I01 health والموظفون وعقد equipment وسياق الموظف', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect((await app.inject('/api/health')).json()).toEqual({ success: true, data: { status: 'ok' } }); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    const employees = await app.inject('/api/employees'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(employees.statusCode).toBe(200); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(employees.json()).toEqual({ success: true, data: { employees: expect.arrayContaining([{ id: A, name: 'أ' }, { id: B, name: 'ب' }]) } }); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    const loan = await borrow(db, A, X); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const response = await app.inject(`/api/equipment?employeeId=${A}`); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(response.statusCode).toBe(200); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(response.json().data.equipment).toContainEqual(expect.objectContaining({ id: X, totalQuantity: 2, availableQuantity: 1, activeLoan: { id: loan.id, borrowedAt: loan.borrowedAt.toISOString() } })); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await app.inject(`/api/equipment?employeeId=${B}`)).json().data.equipment.every((item: { activeLoan: unknown }) => item.activeLoan === null)).toBe(true); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I02 Borrow ناجح ثم رفض نشط ثان دون تغيير', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const first = await post(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(first.statusCode).toBe(201); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(first.json().data.loan.returnedAt).toBeNull(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    const second = await post(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(second.statusCode).toBe(409); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(second.json().error.code).toBe('ALREADY_BORROWED'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count()).toBe(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I03 ثلاث دورات مع تاريخ ومعرفات مختلفة', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const identities = new Set<string>(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    for (let cycle = 0; cycle < 3; cycle++) { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
      const response = await post(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
      expect(response.statusCode).toBe(201); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
      const id: string = response.json().data.loan.id; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
      identities.add(id); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
      expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
      const result = await sendReturn(id); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
      expect(result.statusCode).toBe(200); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
      expect(result.json().data.loan.returnedAt).not.toBeNull(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
      expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(2); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    } // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(identities.size).toBe(3); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count({ where: { returnedAt: { not: null } } })).toBe(3); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I04 الإرجاع المتكرر لا يغير المخزون أو التاريخ', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const loan = await borrow(db, A, X); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const first = await sendReturn(loan.id); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const second = await sendReturn(loan.id); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(second.statusCode).toBe(409); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(second.json().error.code).toBe('ALREADY_RETURNED'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.loan.findUniqueOrThrow({ where: { id: loan.id } })).returnedAt?.toISOString()).toBe(first.json().data.loan.returnedAt); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(2); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I05 رفض النفاد دون إنشاء سجل', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const response = await post(A, Z); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(response.statusCode).toBe(409); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(response.json().error.code).toBe('OUT_OF_STOCK'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count()).toBe(0); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I06 rollback عند الفشل بعد decrement وقبل insert', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await expect(borrow(db, A, X, { afterBorrowStock: async () => { throw new Error('فشل مضبوط'); } })).rejects.toThrow('فشل مضبوط'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count()).toBe(0); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(2); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I07 rollback عند فشل Loan insert فعلي بعد decrement', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await expect(borrow(db, A, X, { afterBorrowStock: async () => { await db.employee.delete({ where: { id: A } }); } })).rejects.toThrow(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count()).toBe(0); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(2); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I08 rollback بعد returnedAt وقبل increment', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const loan = await borrow(db, A, X); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await expect(returnLoan(db, A, loan.id, { afterReturnLoan: async () => { throw new Error('فشل الإرجاع'); } })).rejects.toThrow('فشل الإرجاع'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.loan.findUniqueOrThrow({ where: { id: loan.id } })).returnedAt).toBeNull(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I09 تداخل فعلي على آخر وحدة مع رصد انتظار القفل', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const results = await overlapping((hooks) => borrow(db, A, Y, hooks), () => borrow(db, B, Y)); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(results.filter((item) => item.status === 'fulfilled')).toHaveLength(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    const rejected = results.find((item) => item.status === 'rejected'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(rejected?.status === 'rejected' && classifyError(rejected.reason).code).toBe('OUT_OF_STOCK'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count({ where: { equipmentId: Y, returnedAt: null } })).toBe(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.equipment.findUniqueOrThrow({ where: { id: Y } })).availableQuantity).toBe(0); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I10 تداخل طلبين للموظف والنوع نفسيهما', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const results = await overlapping((hooks) => borrow(db, A, X, hooks), () => borrow(db, A, X)); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(results.filter((item) => item.status === 'fulfilled')).toHaveLength(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    const rejected = results.find((item) => item.status === 'rejected'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(rejected?.status === 'rejected' && classifyError(rejected.reason).code).toBe('ALREADY_BORROWED'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count()).toBe(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I11 إرجاعان متزامنان يزيدان مرة واحدة', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const loan = await borrow(db, A, X); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const results = await overlapping((hooks) => returnLoan(db, A, loan.id, hooks), () => returnLoan(db, A, loan.id)); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(results.filter((item) => item.status === 'fulfilled')).toHaveLength(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    const rejected = results.find((item) => item.status === 'rejected'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(rejected?.status === 'rejected' && classifyError(rejected.reason).code).toBe('ALREADY_RETURNED'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(2); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I12 Return أولا ثم Borrow متداخل يحفظ السابق وينشئ جديدا', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const loan = await borrow(db, A, X); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const results = await overlapping((hooks) => returnLoan(db, A, loan.id, hooks), () => borrow(db, A, X)); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(results.every((item) => item.status === 'fulfilled')).toBe(true); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count()).toBe(2); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count({ where: { returnedAt: null } })).toBe(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I13 يمكن استعارة نوعين مختلفين', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect((await post(A, X)).statusCode).toBe(201); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await post(A, Y)).statusCode).toBe(201); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count({ where: { employeeId: A, returnedAt: null } })).toBe(2); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I14 القيد الجزئي موجود ويرفض النشط المكرر فعليا', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const indexes = await db.$queryRaw<{ indexname: string; indexdef: string }[]>`SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'Loan'`; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const index = indexes.find((item) => item.indexname === 'unique_active_loan_per_employee_equipment'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(index?.indexdef).toContain('UNIQUE'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(index?.indexdef).toContain('WHERE ("returnedAt" IS NULL)'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    await borrow(db, A, X); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    let caught: unknown; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    try { await db.loan.create({ data: loanInput() }); } catch (error) { caught = error; } // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(caught).toBeDefined(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(classifyError(caught).code).toBe('ALREADY_BORROWED'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test.each([{ totalQuantity: -1 }, { availableQuantity: -1 }, { availableQuantity: 3 }])('I15 PostgreSQL CHECK يرفض الرصيد غير الصحيح %#', async (data) => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await expect(db.equipment.update({ where: { id: X }, data })).rejects.toThrow(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(2); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I16 FK وNOT NULL وعدم حذف التاريخ', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await expect(db.loan.create({ data: loanInput(UNKNOWN) })).rejects.toThrow(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    await expect(db.$executeRaw`INSERT INTO "Employee" ("id", "name") VALUES (${randomUUID()}::uuid, NULL)`).rejects.toThrow(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    const loan = await borrow(db, A, X); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await returnLoan(db, A, loan.id); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await expect(db.employee.delete({ where: { id: A } })).rejects.toThrow(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    await expect(db.equipment.delete({ where: { id: X } })).rejects.toThrow(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I17 seed يتكرر ويحفظ الاستعارة والرصيد والتاريخ', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await seedData(db); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await seedData(db); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(await db.employee.count()).toBe(5); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.equipment.count()).toBe(6); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    const loan = await borrow(db, employeeIds[0], equipmentIds[0]); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await seedData(db); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect((await db.equipment.findUniqueOrThrow({ where: { id: equipmentIds[0] } })).availableQuantity).toBe(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    await returnLoan(db, employeeIds[0], loan.id); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await seedData(db); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(await db.loan.count({ where: { id: loan.id, returnedAt: { not: null } } })).toBe(1); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.equipment.findUniqueOrThrow({ where: { id: equipmentIds[0] } })).availableQuantity).toBe(2); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test.each([ // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    [{}, 'VALIDATION_ERROR', 400], [{ employeeId: 'bad', equipmentId: X }, 'VALIDATION_ERROR', 400], // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    [{ employeeId: A, equipmentId: null }, 'VALIDATION_ERROR', 400], [{ employeeId: A, equipmentId: X, quantity: 2 }, 'VALIDATION_ERROR', 400], // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    [{ employeeId: UNKNOWN, equipmentId: X }, 'EMPLOYEE_NOT_FOUND', 404], [{ employeeId: A, equipmentId: UNKNOWN }, 'EQUIPMENT_NOT_FOUND', 404], // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    [{ employeeId: 123, equipmentId: X }, 'VALIDATION_ERROR', 400], // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  ])('I18 تحقق الطلب والموارد دون كتابة %#', async (payload, code, status) => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const response = await app.inject({ method: 'POST', url: '/api/loans', payload }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(response.statusCode).toBe(status); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(response.json().error.code).toBe(code); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(await db.loan.count()).toBe(0); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I19 query غائب ومكرر وزائد وموظف غير موجود', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    for (const suffix of ['', `?employeeId=${A}&employeeId=${B}`, `?employeeId=${A}&extra=1`, '?employeeId=bad']) { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
      expect((await app.inject(`/api/equipment${suffix}`)).statusCode).toBe(400); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    } // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect((await app.inject(`/api/equipment?employeeId=${UNKNOWN}`)).json().error.code).toBe('EMPLOYEE_NOT_FOUND'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I20 ملكية السجل والتحقق من الإرجاع', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const loan = await borrow(db, A, X); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect((await sendReturn(loan.id, B)).json().error.code).toBe('LOAN_NOT_FOUND'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await sendReturn(UNKNOWN)).statusCode).toBe(404); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await sendReturn('bad')).statusCode).toBe(400); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await sendReturn(loan.id, UNKNOWN)).json().error.code).toBe('EMPLOYEE_NOT_FOUND'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await db.loan.findUniqueOrThrow({ where: { id: loan.id } })).returnedAt).toBeNull(); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I21 JSON غير صالح ونوع محتوى غير مدعوم وroute مجهول', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const malformed = await app.inject({ method: 'POST', url: '/api/loans', headers: { 'content-type': 'application/json' }, payload: '{broken' }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(malformed.statusCode).toBe(400); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(malformed.json().error.code).toBe('VALIDATION_ERROR'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    const unsupported = await app.inject({ method: 'POST', url: '/api/loans', headers: { 'content-type': 'application/xml' }, payload: '<x/>' }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(unsupported.statusCode).toBe(415); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(unsupported.json().success).toBe(false); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect((await app.inject('/does-not-exist')).json().error.code).toBe('ROUTE_NOT_FOUND'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I22 قوائم فارغة صحيحة', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    await db.equipment.deleteMany(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect((await app.inject(`/api/equipment?employeeId=${A}`)).json().data.equipment).toEqual([]); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    await db.employee.deleteMany(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect((await app.inject('/api/employees')).json().data.employees).toEqual([]); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I23 طلبا API على آخر وحدة يثبتان العقد النهائي', async () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const responses = await Promise.all([post(A, Y), post(B, Y)]); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(responses.map((response) => response.statusCode).sort()).toEqual([201, 409]); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('I24 فشل تحديث المخزون الحقيقي يعيد Loan وAPI يخفي تفاصيله', async () => { // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
    const loan = await borrow(db, A, X); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
    await db.$executeRaw`CREATE FUNCTION test_reject_return() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."availableQuantity" > OLD."availableQuantity" THEN RAISE EXCEPTION 'test-only-private-failure'; END IF; RETURN NEW; END; $$`; // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
    await db.$executeRaw`CREATE TRIGGER test_return_failure BEFORE UPDATE ON "Equipment" FOR EACH ROW EXECUTE FUNCTION test_reject_return()`; // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
    try { // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
      const response = await sendReturn(loan.id); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
      expect(response.statusCode).toBe(500); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
      expect(response.json().error.code).toBe('INTERNAL_SERVER_ERROR'); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
      expect(response.body).not.toContain('test-only-private-failure'); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
      expect(response.body).not.toContain('Prisma'); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
      expect((await db.loan.findUniqueOrThrow({ where: { id: loan.id } })).returnedAt).toBeNull(); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
      expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(1); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
    } finally { // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
      await db.$executeRaw`DROP TRIGGER test_return_failure ON "Equipment"`; // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
      await db.$executeRaw`DROP FUNCTION test_reject_return()`; // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
    } // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
  }); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
  test('I25 طلبي API للإرجاع بالتزامن ينتجان 200 و409 فقط', async () => { // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
    const loan = await borrow(db, A, X); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
    const responses = await Promise.all([sendReturn(loan.id), sendReturn(loan.id)]); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
    expect(responses.map((response) => response.statusCode).sort()).toEqual([200, 409]); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
    expect((await db.equipment.findUniqueOrThrow({ where: { id: X } })).availableQuantity).toBe(2); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
  }); // اختبار فشل قاعدة البيانات أو التزامن والتحقق من سلامة النتيجة
}); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
