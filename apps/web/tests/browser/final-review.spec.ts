import { test, expect } from '@playwright/test'; // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
import AxeBuilder from '@axe-core/playwright'; // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
const A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'; // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
const X = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'; // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
test('Q01 استخدام لوحة المفاتيح: اختيار واستعارة وإرجاع وإعادة استعارة', async ({ page, request }) => { // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  test.skip(process.env.RUN_LIVE_API !== '1', 'يتطلب API حقيقيًا على قاعدة اختبار منفصلة'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await page.goto('/'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await expect(page.getByRole('option', { name: 'أ', exact: true })).toBeAttached(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await page.keyboard.press('Tab'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await expect(page.getByRole('link', { name: 'انتقل إلى المحتوى' })).toBeFocused(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await page.keyboard.press('Enter'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await expect(page).toHaveURL(/#main-content$/); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  for (let step = 0; step < 15 && await page.evaluate(() => document.activeElement?.id) !== 'employee-select'; step++) await page.keyboard.press('Tab'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await expect(page.getByRole('combobox')).toBeFocused(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await page.keyboard.press('Home'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await expect(page.getByRole('combobox')).toHaveValue(A); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  for (let step = 0; step < 15 && await page.evaluate(() => document.activeElement?.getAttribute('aria-label')) !== 'استعارة متعدد'; step++) await page.keyboard.press('Tab'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeFocused(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  try { // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    await page.keyboard.press('Enter'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toBeEnabled(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toBeFocused(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    await page.keyboard.press('Space'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    await page.keyboard.press('Enter'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    await expect(page.getByRole('button', { name: 'إرجاع متعدد', exact: true })).toBeEnabled(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    const data = await (await request.get(`/api/equipment?employeeId=${A}`)).json(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    expect(data.data.equipment.find((item: { id: string }) => item.id === X).availableQuantity).toBe(1); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    await page.screenshot({ path: 'test-results/keyboard-focus.png', fullPage: true }); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  } finally { // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    const data = await (await request.get(`/api/equipment?employeeId=${A}`)).json(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    const item = data.data.equipment.find((entry: { id: string }) => entry.id === X); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
    if (item?.activeLoan) expect((await request.post(`/api/loans/${item.activeLoan.id}/return`, { data: { employeeId: A } })).status()).toBe(200); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  } // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
}); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
test('Q02 شاشة ضيقة 320 بكسل: RTL وتحكم واضح دون تجاوز أفقي ومراجعة axe', async ({ page }) => { // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  test.skip(process.env.RUN_LIVE_API !== '1', 'يتطلب البيئة المعزولة نفسها'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await page.setViewportSize({ width: 320, height: 900 }); await page.goto('/'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await expect(page.getByRole('option', { name: 'أ', exact: true })).toBeAttached(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await page.getByRole('combobox').selectOption(A); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await expect(page.getByRole('button', { name: 'استعارة متعدد', exact: true })).toBeEnabled(); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl'); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  await page.screenshot({ path: 'test-results/rtl-320.png', fullPage: true }); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
}); // التحقق الفعلي من سهولة الاستخدام والوصول عبر المتصفح دون تعديل قواعد المنتج
