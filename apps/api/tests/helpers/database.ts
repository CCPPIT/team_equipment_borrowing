import { randomUUID } from 'node:crypto'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import { loadTestEnv } from '../../src/config/env.js'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import { createPrisma } from '../../src/lib/prisma.js'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import type { TransactionHooks } from '../../src/services/loans.js'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export const env = loadTestEnv(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export const db = createPrisma(env.databaseUrl); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export const A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export const B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export const X = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export const Y = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export const Z = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export const UNKNOWN = 'ffffffff-ffff-4fff-8fff-ffffffffffff'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export async function assertTestDatabase(): Promise<void> { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  const rows = await db.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  if (rows[0]?.name !== decodeURIComponent(new URL(env.databaseUrl).pathname.slice(1)) || !rows[0].name.endsWith('_test')) throw new Error('رفض تنظيف قاعدة غير اختبارية'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
} // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export async function reset(): Promise<void> { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  await assertTestDatabase(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  await db.$transaction([db.loan.deleteMany(), db.equipment.deleteMany(), db.employee.deleteMany()]); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  await db.employee.createMany({ data: [{ id: A, name: 'أ' }, { id: B, name: 'ب' }] }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  await db.equipment.createMany({ data: [{ id: X, name: 'متعدد', totalQuantity: 2, availableQuantity: 2 }, { id: Y, name: 'أخير', totalQuantity: 1, availableQuantity: 1 }, { id: Z, name: 'نافد', totalQuantity: 0, availableQuantity: 0 }] }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
} // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export async function assertInvariant(): Promise<void> { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  const equipment = await db.equipment.findMany({ include: { loans: { where: { returnedAt: null } } } }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  for (const item of equipment) { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    if (item.availableQuantity < 0 || item.availableQuantity + item.loans.length !== item.totalQuantity) throw new Error('انتهاك مصالحة المخزون'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const employees = item.loans.map((loan) => loan.employeeId); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    if (new Set(employees).size !== employees.length) throw new Error('نشط مكرر'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  } // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
} // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
function deferred() { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  let resolve: () => void = () => { throw new Error('لم يجهز حاجز الاختبار'); }; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  const promise = new Promise<void>((done) => { resolve = done; }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  return { promise, resolve }; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
} // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export async function overlapping<T>(first: (hooks: TransactionHooks) => Promise<T>, second: () => Promise<T>) { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  const acquired = deferred(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  const release = deferred(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  const one = first({ afterLock: async () => { acquired.resolve(); await release.promise; } }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  await acquired.promise; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  const two = second(); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  const outcomes = Promise.allSettled([one, two]); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  let observedLockWait = false; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  try { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const deadline = Date.now() + 3000; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    while (Date.now() < deadline) { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
      const rows = await db.$queryRaw<{ blocked: bigint }[]>`SELECT count(*) AS blocked FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid() AND wait_event_type = 'Lock' AND query LIKE '%FOR UPDATE%'`; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
      if (Number(rows[0]?.blocked ?? 0) > 0) { observedLockWait = true; break; } // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
      await new Promise((done) => setTimeout(done, 10)); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    } // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  } finally { release.resolve(); } // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  const results = await outcomes; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  if (!observedLockWait) throw new Error('لم يثبت تداخل اتصالين ينتظر أحدهما قفل PostgreSQL'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  return results; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
} // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
export function loanInput(employeeId = A, equipmentId = X) { return { id: randomUUID(), employeeId, equipmentId }; } // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
