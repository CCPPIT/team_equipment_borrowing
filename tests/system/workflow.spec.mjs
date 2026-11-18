import { test, expect } from '@playwright/test'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import { A, B, X, Y, Z, UNKNOWN, db, guard, reset, snapshot, invariant, stock, control, trigger, removeTrigger } from './database.mjs'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
test.beforeAll(guard); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test.beforeEach(async () => { await control('database/up'); await control('backend/up'); await removeTrigger(); await reset(); }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test.afterEach(async () => { await control('database/up'); await control('backend/up'); await removeTrigger(); await invariant(); }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test.afterAll(async () => { await db.end(); }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
async function open(page, employee = A) { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.goto('/'); await expect(page.getByRole('option', { name: 'أ', exact: true })).toBeAttached(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.getByRole('combobox').selectOption(employee); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
async function borrow(page, name = 'متعدد') { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const response = page.waitForResponse((r) => r.url().endsWith('/api/loans') && r.request().method() === 'POST'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.getByRole('button', { name: `استعارة ${name}`, exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const result = await response; expect(result.status()).toBe(201); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(result.request().postDataJSON()).toEqual({ employeeId: A, equipmentId: name === 'متعدد' ? X : Y }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const body = await result.json(); expect(body.success).toBe(true); expect(body.data.loan.returnedAt).toBeNull(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: `إرجاع ${name}`, exact: true })).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await invariant(); return body.data.loan; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
async function giveBack(page, loan, name = 'متعدد') { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const response = page.waitForResponse((r) => r.url().endsWith(`/api/loans/${loan.id}/return`)); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.getByRole('button', { name: `إرجاع ${name}`, exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const result = await response; expect(result.status()).toBe(200); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(result.request().postDataJSON()).toEqual({ employeeId: A }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect((await result.json()).data.loan.returnedAt).not.toBeNull(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: `استعارة ${name}`, exact: true })).toBeEnabled(); await invariant(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('A-B-C استعارة وإرجاع وثلاث دورات إعادة استعارة بلا إعادة تحميل الصفحة', async ({ page }, testInfo) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  let navigations = 0; const errors = []; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  page.on('request', (request) => { if (request.isNavigationRequest() && request.resourceType() === 'document') navigations++; }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  page.on('pageerror', (error) => errors.push(error.message)); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); const initial = await stock(); const ids = new Set(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  for (let cycle = 0; cycle < 3; cycle++) { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    const loan = await borrow(page); ids.add(loan.id); expect(await stock()).toBe(initial - 1); await expect(page.getByRole('article', { name: 'متعدد', exact: true }).locator('dd').nth(1)).toHaveText(String(initial - 1)); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    const active = await db.query('SELECT * FROM "Loan" WHERE id=$1', [loan.id]); expect(active.rows[0].returnedAt).toBeNull(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await expect(page.getByRole('article', { name: 'متعدد', exact: true })).toContainText('مستعارة لديك'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await giveBack(page, loan); expect(await stock()).toBe(initial); await expect(page.getByRole('article', { name: 'متعدد', exact: true }).locator('dd').nth(1)).toHaveText(String(initial)); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    const completed = await db.query('SELECT * FROM "Loan" WHERE id=$1', [loan.id]); expect(completed.rows[0].returnedAt).not.toBeNull(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(ids.size).toBe(3); expect(navigations).toBe(1); expect(errors).toEqual([]); await testInfo.attach('three-cycles-database', { body: JSON.stringify(await snapshot(), null, 2), contentType: 'application/json' }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect((await db.query('SELECT count(*)::int AS n FROM "Loan" WHERE "returnedAt" IS NOT NULL')).rows[0].n).toBe(3); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('D استعارة نشطة مكررة مرفوضة من API دون تغيير DB', async ({ page, request }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); await borrow(page); const before = await snapshot(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const response = await request.post('/api/loans', { data: { employeeId: A, equipmentId: X } }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(response.status()).toBe(409); expect((await response.json()).error.code).toBe('ALREADY_BORROWED'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(await snapshot()).toEqual(before); await invariant(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('E نفاد المخزون يعطل الواجهة ويرفض الطلب المباشر دون سجلات جديدة', async ({ page, request }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); await expect(page.getByRole('button', { name: 'استعارة نافد', exact: true })).toBeDisabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const before = await snapshot(); const response = await request.post('/api/loans', { data: { employeeId: A, equipmentId: Z } }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(response.status()).toBe(409); expect((await response.json()).error.code).toBe('OUT_OF_STOCK'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(await snapshot()).toEqual(before); await invariant(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('F الإرجاع مرتين يرفض الثانية دون زيادة أو تغيير التاريخ', async ({ page, request }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); const loan = await borrow(page); await giveBack(page, loan); const before = await snapshot(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const response = await request.post(`/api/loans/${loan.id}/return`, { data: { employeeId: A } }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(response.status()).toBe(409); expect((await response.json()).error.code).toBe('ALREADY_RETURNED'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(await snapshot()).toEqual(before); expect(await stock()).toBe(2); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
for (let round = 1; round <= 3; round++) { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  test(`G${round} موظفان وآخر وحدة عبر HTTP مع إثبات انتظارهما قفل PostgreSQL`, async ({ request }, testInfo) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    const blocker = await db.connect(); let pending; let observedWaiters = 0; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    try { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
      await blocker.query('BEGIN'); await blocker.query('SELECT id FROM "Equipment" WHERE id=$1 FOR UPDATE', [Y]); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
      pending = Promise.all([A, B].map((employeeId) => request.post('/api/loans', { data: { employeeId, equipmentId: Y } }))); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
      await expect.poll(async () => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
        const rows = await db.query(`SELECT count(*)::int AS n FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock' AND query LIKE '%FOR UPDATE%'`); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
        observedWaiters = rows.rows[0].n; return observedWaiters; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
      }, { timeout: 10000 }).toBeGreaterThanOrEqual(2); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
      expect(await stock(Y)).toBe(1); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
      await blocker.query('COMMIT'); const results = await pending; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
      expect(results.map((r) => r.status()).sort()).toEqual([201, 409]); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
      const rejected = results.find((r) => r.status() === 409); expect((await rejected.json()).error.code).toBe('OUT_OF_STOCK'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
      expect(await stock(Y)).toBe(0); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
      const active = await db.query('SELECT count(*)::int AS n FROM "Loan" WHERE "equipmentId"=$1 AND "returnedAt" IS NULL', [Y]); expect(active.rows[0].n).toBe(1); await testInfo.attach('http-concurrency-proof', { body: JSON.stringify({ round, observedWaiters, statuses: results.map((r) => r.status()), state: await invariant() }, null, 2), contentType: 'application/json' }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    } finally { await blocker.query('ROLLBACK'); blocker.release(); if (pending) await pending; } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H01 أخطاء IDs والموارد وJSON والكمية تبقي DB كما هي', async ({ request }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const before = await snapshot(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const cases = [ // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    ['/api/loans', { employeeId: 'bad', equipmentId: X }, 400, 'VALIDATION_ERROR'], // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    ['/api/loans', { employeeId: A, equipmentId: 'bad' }, 400, 'VALIDATION_ERROR'], // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    ['/api/loans', { employeeId: UNKNOWN, equipmentId: X }, 404, 'EMPLOYEE_NOT_FOUND'], // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    ['/api/loans', { employeeId: A, equipmentId: UNKNOWN }, 404, 'EQUIPMENT_NOT_FOUND'], // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    ['/api/loans', { employeeId: A, equipmentId: X, quantity: 2 }, 400, 'VALIDATION_ERROR'], // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    ['/api/loans/bad/return', { employeeId: A }, 400, 'VALIDATION_ERROR'], // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    [`/api/loans/${UNKNOWN}/return`, { employeeId: A }, 404, 'LOAN_NOT_FOUND'], // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  ]; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  for (const [url, data, status, code] of cases) { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    const response = await request.post(url, { data }); expect(response.status()).toBe(status); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    expect((await response.json()).error.code).toBe(code); expect(await snapshot()).toEqual(before); await invariant(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const malformed = await request.post('/api/loans', { headers: { 'Content-Type': 'application/json' }, data: '{broken' }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(malformed.status()).toBe(400); expect((await malformed.json()).error.code).toBe('VALIDATION_ERROR'); expect(await snapshot()).toEqual(before); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H02 Backend متوقف: فشل مفهوم وقفل ثم Retry ناجح بلا POST مكرر', async ({ page }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); const before = await snapshot(); let posts = 0; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  page.on('request', (r) => { if (r.method() === 'POST' && r.url().endsWith('/api/loans')) posts++; }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await control('backend/down'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.getByRole('button', { name: 'استعارة متعدد', exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByText('تعذر تأكيد نتيجة العملية', { exact: true })).toBeVisible(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: 'إعادة تحميل المعدات', exact: true })).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('combobox')).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeDisabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(await snapshot()).toEqual(before); await control('backend/up'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.getByRole('button', { name: 'إعادة تحميل المعدات', exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); expect(posts).toBe(1); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H03 اتصال PostgreSQL مقطوع عن API فقط ثم تعاف دون تغيير البيانات', async ({ page }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); const before = await snapshot(); await control('database/down'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.getByRole('button', { name: 'استعارة متعدد', exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByText('تعذر تأكيد نتيجة العملية', { exact: true })).toBeVisible(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: 'إعادة تحميل المعدات', exact: true })).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('combobox')).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(await snapshot()).toEqual(before); await control('database/up'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.getByRole('button', { name: 'إعادة تحميل المعدات', exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H04 خطأ INSERT حقيقي بعد خصم المخزون يتراجع ذريًا ويعرض 500 آمنًا', async ({ page }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); const before = await snapshot(); await trigger('borrow'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  try { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    const responsePromise = page.waitForResponse((r) => r.url().endsWith('/api/loans') && r.request().method() === 'POST'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await page.getByRole('button', { name: 'استعارة متعدد', exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    const response = await responsePromise; expect(response.status()).toBe(500); expect(await response.text()).not.toMatch(/phase05-private-error|Prisma|postgresql:/); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await expect(page.getByText('تعذر تأكيد نتيجة العملية', { exact: true })).toBeVisible(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    expect(await snapshot()).toEqual(before); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  } finally { await removeTrigger(); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const loan = await borrow(page); await giveBack(page, loan); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H05 فشل زيادة المخزون الحقيقي يتراجع عن returnedAt ولا يدعي نجاح الإرجاع', async ({ page }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); const loan = await borrow(page); const before = await snapshot(); await trigger('return'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  try { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    const responsePromise = page.waitForResponse((r) => r.url().endsWith(`/api/loans/${loan.id}/return`)); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await page.getByRole('button', { name: 'إرجاع متعدد', exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    expect((await responsePromise).status()).toBe(500); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await expect(page.getByText('تعذر تأكيد نتيجة العملية', { exact: true })).toBeVisible(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toBeEnabled(); expect(await snapshot()).toEqual(before); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await expect(page.getByText('تم الإرجاع بنجاح', { exact: true })).toHaveCount(0); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  } finally { await removeTrigger(); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await giveBack(page, loan); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H06 انقطاع رد الشبكة بعد commit: GET يصالح الواقع بلا إعادة POST', async ({ page }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); let posts = 0; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.route('**/api/loans', async (route) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    posts++; const response = await route.fetch(); expect(response.status()).toBe(201); await response.dispose(); await route.abort('failed'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.getByRole('button', { name: 'استعارة متعدد', exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByText('تعذر تأكيد نتيجة العملية', { exact: true })).toBeVisible(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(await stock()).toBe(1); expect(posts).toBe(1); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByText('تمت الاستعارة بنجاح', { exact: true })).toHaveCount(0); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H07 Pending يمنع النقر المكرر وتغيير الموظف حتى نجاح الطلب وإعادة الجلب', async ({ page }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); let release; let seen; const arrived = new Promise((done) => { seen = done; }); const gate = new Promise((done) => { release = done; }); let posts = 0; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.route('**/api/loans', async (route) => { posts++; seen(); await gate; await route.continue(); }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  try { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await page.getByRole('button', { name: 'استعارة متعدد', exact: true }).evaluate((button) => { button.click(); button.click(); }); await arrived; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await expect(page.getByRole('combobox')).toBeDisabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toHaveCount(0); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    expect(await stock()).toBe(2); expect(posts).toBe(1); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  } finally { release(); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('combobox')).toBeEnabled(); expect(await stock()).toBe(1); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H08 قوائم فارغة حقيقية من PostgreSQL وتمييز حالة الموظف', async ({ page }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await db.query('DELETE FROM "Equipment"'); await openEmpty(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  async function openEmpty() { await page.goto('/'); await expect(page.getByRole('option', { name: 'أ', exact: true })).toBeAttached(); await page.getByRole('combobox').selectOption(A); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('heading', { name: 'لا توجد معدات حاليًا' })).toBeVisible(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await db.query('DELETE FROM "Employee"'); await page.getByRole('button', { name: 'تحديث قائمة الموظفين', exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByText('لا يوجد موظفون في القائمة حاليًا.')).toBeVisible(); await expect(page.getByRole('combobox')).toBeDisabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H09 activeLoan موجود قبل فتح الشاشة ويخص الموظف الصحيح', async ({ page, request }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const result = await request.post('/api/loans', { data: { employeeId: A, equipmentId: X } }); expect(result.status()).toBe(201); await invariant(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.goto('/'); await expect(page.getByRole('option', { name: 'أ', exact: true })).toBeAttached(); await page.getByRole('combobox').selectOption(A); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.getByRole('combobox').selectOption(B); await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  expect(await stock()).toBe(1); await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toHaveCount(0); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H10 تحقق API حقيقي في الواجهة بعد حذف النوع أثناء عرض القائمة', async ({ page }) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await open(page); await db.query('DELETE FROM "Equipment" WHERE id=$1', [X]); const before = await snapshot(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await page.getByRole('button', { name: 'استعارة متعدد', exact: true }).click(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('alert').filter({ hasText: 'EQUIPMENT_NOT_FOUND' })).toContainText('EQUIPMENT_NOT_FOUND'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await expect(page.getByRole('article', { name: 'متعدد', exact: true })).toHaveCount(0); expect(await snapshot()).toEqual(before); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
test('H11 نجاح mutation مع فشل refresh يبقي نجاح العملية ويحظر التكرار حتى GET مؤكد', async ({ page }) => { // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  await open(page); let rejectRead = true; let posts = 0; // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  page.on('request', (r) => { if (r.method() === 'POST' && r.url().endsWith('/api/loans')) posts++; }); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  await page.route('**/api/equipment?*', async (route) => { if (rejectRead) await route.abort('failed'); else await route.continue(); }); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  await page.getByRole('button', { name: 'استعارة متعدد', exact: true }).click(); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  await expect(page.getByText('تمت الاستعارة، وتعذر تحديث العرض', { exact: true })).toBeVisible(); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  await expect(page.getByRole('button', { name: 'إعادة تحميل المعدات', exact: true })).toBeEnabled(); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeDisabled(); expect(await stock()).toBe(1); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  rejectRead = false; await page.getByRole('button', { name: 'إعادة تحميل المعدات', exact: true }).click(); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toBeEnabled(); expect(posts).toBe(1); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
}); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
test('H12 رد معدات الموظف A المتأخر لا يلوث حالة B', async ({ page, request }) => { // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  const result = await request.post('/api/loans', { data: { employeeId: A, equipmentId: X } }); expect(result.status()).toBe(201); await invariant(); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  let release; let seen; const arrived = new Promise((done) => { seen = done; }); const gate = new Promise((done) => { release = done; }); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  await page.route(`**/api/equipment?employeeId=${A}`, async (route) => { // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
    const response = await route.fetch(); seen(); await gate; // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
    try { await route.fulfill({ response }); } catch { await response.dispose(); } // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  }); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  try { // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
    await page.goto('/'); await expect(page.getByRole('option', { name: 'أ', exact: true })).toBeAttached(); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
    await page.getByRole('combobox').selectOption(A); await arrived; // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
    await expect(page.getByRole('status').filter({ hasText: 'جاري تحميل المعدات' })).toBeVisible(); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
    await page.getByRole('combobox').selectOption(B); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
    await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  } finally { release(); } // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  await expect(page.getByRole('combobox')).toHaveValue(B); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
  await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toHaveCount(0); expect(await stock()).toBe(1); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
}); // التحقق من تعافي القراءة وعزل استجابات الموظفين مع API حقيقي
