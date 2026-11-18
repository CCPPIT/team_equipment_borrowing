import { describe, test, expect, afterEach, vi } from 'vitest'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import { parseEnv, loadTestEnv } from '../../src/config/env.js'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
import { classifyError, DomainError } from '../../src/lib/errors.js'; // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
describe('البيئة ومعالجة الأخطاء', () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  afterEach(() => vi.unstubAllEnvs()); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('U01 إعداد صالح مع المنفذ الافتراضي', () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(parseEnv({ DATABASE_URL: 'postgresql://demo@localhost/dev' }).apiPort).toBe(3001); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test.each([ // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    [{}, 'DATABASE_URL'], [{ DATABASE_URL: 'not-a-url' }, 'DATABASE_URL'], [{ DATABASE_URL: 'http://localhost/db' }, 'PostgreSQL'], // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    [{ DATABASE_URL: 'postgresql://localhost/db', API_PORT: '3.5' }, 'API_PORT'], [{ DATABASE_URL: 'postgresql://localhost/db', API_PORT: '0' }, 'API_PORT'], // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    [{ DATABASE_URL: 'postgresql://localhost/db', API_PORT: '70000' }, 'API_PORT'], [{ DATABASE_URL: 'postgresql://localhost/db', NODE_ENV: 'invalid' }, 'NODE_ENV'], // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  ])('U02 رفض البيئة غير الصالحة %#', (input, message) => { expect(() => parseEnv(input)).toThrow(message); }); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  test('U03 لا تنظيف على قاعدة التطوير أو اسم غير اختباري', () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    vi.stubEnv('DATABASE_URL', 'postgresql://demo@localhost/team_test'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    vi.stubEnv('TEST_DATABASE_URL', 'postgresql://demo@localhost/team_test'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(() => loadTestEnv()).toThrow('تختلف'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    vi.stubEnv('TEST_DATABASE_URL', 'postgresql://demo@localhost/production'); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(() => loadTestEnv()).toThrow('_test'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    vi.stubEnv('TEST_DATABASE_URL', ''); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(() => loadTestEnv()).toThrow('TEST_DATABASE_URL'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('U04 أخطاء النطاق تبقى كما هي', () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const error = new DomainError('OUT_OF_STOCK', 409); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(classifyError(error)).toBe(error); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test('U05 تصنيف unique النشط فقط', () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(classifyError({ code: 'P2002', meta: { target: ['employeeId', 'equipmentId'] } }).code).toBe('ALREADY_BORROWED'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(classifyError({ code: 'P2002', meta: { target: ['name'] } }).status).toBe(500); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(classifyError({ code: '23505', constraint: 'unique_active_loan_per_employee_equipment' }).code).toBe('ALREADY_BORROWED'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
  test.each(['40001', '40P01', 'P2034'])('U06 تصنيف تعارض المعاملة %s', (code) => { expect(classifyError({ cause: { code } }).code).toBe('TRANSACTION_CONFLICT'); }); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  test('U07 خطأ غير معروف لا يسرب الأسرار', () => { // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    const error = classifyError(new Error('secret-postgres-password')); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
    expect(error.status).toBe(500); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
    expect(error.message).not.toContain('secret'); // التحقق من نتيجة الاختبار مقابل الحالة المتوقعة
  }); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
}); // تنسيق بيانات الاختبار أو تنفيذ خطوته المعزولة بوضوح
