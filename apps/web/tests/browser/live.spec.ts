import { test, expect } from '@playwright/test'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import AxeBuilder from '@axe-core/playwright'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
const A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
const X = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
test('B01 API حقيقي: اختيار واستعارة وإرجاع ومصالحة المخزون', async ({ page, request }) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  test.skip(process.env.RUN_LIVE_API !== '1', 'يتطلب خادمًا مخصصًا متصلًا بقاعدة اختبار معزولة'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const beforeResponse = await request.get(`/api/equipment?employeeId=${A}`); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(beforeResponse.ok()).toBe(true); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const before = await beforeResponse.json(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const initial = before.data.equipment.find((item: { id: string }) => item.id === X); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  expect(initial.activeLoan).toBeNull(); expect(initial.availableQuantity).toBeGreaterThan(0); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message)); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await page.goto('/'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await expect(page.getByRole('option', { name: 'أ', exact: true })).toBeAttached(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await page.getByRole('combobox').selectOption(A); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  await expect(page.getByRole('button', { name: 'استعارة نافد', exact: true })).toBeDisabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  let loanId: string | null = null; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  try { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const borrowResponse = page.waitForResponse((response) => response.url().endsWith('/api/loans') && response.request().method() === 'POST'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await page.getByRole('button', { name: 'استعارة متعدد', exact: true }).click(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const response = await borrowResponse; expect(response.status()).toBe(201); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const body = await response.json(); loanId = body.data.loan.id; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const during = await (await request.get(`/api/equipment?employeeId=${A}`)).json(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(during.data.equipment.find((item: { id: string }) => item.id === X).availableQuantity).toBe(initial.availableQuantity - 1); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const returnResponse = page.waitForResponse((result) => result.url().endsWith(`/api/loans/${loanId}/return`)); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await page.getByRole('button', { name: 'إرجاع متعدد', exact: true }).click(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect((await returnResponse).status()).toBe(200); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const after = await (await request.get(`/api/equipment?employeeId=${A}`)).json(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const finalItem = after.data.equipment.find((item: { id: string }) => item.id === X); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(finalItem.availableQuantity).toBe(initial.availableQuantity); expect(finalItem.activeLoan).toBeNull(); loanId = null; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(errors).toEqual([]); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  } finally { if (loanId) await request.post(`/api/loans/${loanId}/return`, { data: { employeeId: A } }); } // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
}); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
for (const width of [360, 768, 1440]) { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  test(`B02 RTL responsive وaxe عند عرض ${width}`, async ({ page }) => { // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    test.skip(process.env.RUN_LIVE_API !== '1', 'يتطلب بيئة API المعزولة'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await page.setViewportSize({ width, height: 1000 }); await page.goto('/'); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(page.getByRole('option', { name: 'أ', exact: true })).toBeAttached(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await page.getByRole('combobox').selectOption(A); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    await page.screenshot({ path: `test-results/rtl-${width}.png`, fullPage: true }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze(); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
    expect(audit.violations).toEqual([]); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
  }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
} // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
