import pg from 'pg'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import { expect } from '@playwright/test'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import { connectionString } from './environment.mjs'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
export const A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export const B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export const X = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export const Y = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export const Z = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export const UNKNOWN = 'ffffffff-ffff-4fff-8fff-ffffffffffff'; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export const db = new pg.Pool({ connectionString, max: 4 }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export async function guard() { const result = await db.query('SELECT current_database() AS name'); expect(result.rows[0].name).toMatch(/_phase05_test$/); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export async function reset() { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await guard(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const client = await db.connect(); // تثبيت اتصال واحد لكل معاملة تجهيز حتى لا تتوزع على المجمع
  await client.query('BEGIN'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  try { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await client.query('DELETE FROM "Loan"'); await client.query('DELETE FROM "Equipment"'); await client.query('DELETE FROM "Employee"'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await client.query('INSERT INTO "Employee" (id,name) VALUES ($1,$2),($3,$4)', [A, 'أ', B, 'ب']); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await client.query('INSERT INTO "Equipment" (id,name,"totalQuantity","availableQuantity") VALUES ($1,$2,2,2),($3,$4,1,1),($5,$6,0,0)', [X, 'متعدد', Y, 'أخير', Z, 'نافد']); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await client.query('COMMIT'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export async function snapshot() { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const result = await db.query(`SELECT json_build_object('equipment', (SELECT json_agg(e ORDER BY e.id) FROM "Equipment" e), 'loans', (SELECT json_agg(l ORDER BY l.id) FROM "Loan" l)) AS value`); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  return result.rows[0].value; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export async function invariant() { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const result = await db.query('SELECT e.id,e."totalQuantity" AS total,e."availableQuantity" AS available,count(l.id)::int AS active,count(DISTINCT l."employeeId")::int AS employees FROM "Equipment" e LEFT JOIN "Loan" l ON l."equipmentId"=e.id AND l."returnedAt" IS NULL GROUP BY e.id ORDER BY e.id'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  for (const row of result.rows) { expect(row.available).toBeGreaterThanOrEqual(0); expect(row.available + row.active).toBe(row.total); expect(row.active).toBe(row.employees); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  return result.rows; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export async function stock(id = X) { await invariant(); const result = await db.query('SELECT "availableQuantity" AS available FROM "Equipment" WHERE id=$1', [id]); return result.rows[0].available; } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export async function control(path) { const response = await fetch(`http://127.0.0.1:3016/${path}`, { method: 'POST' }); expect(response.status).toBe(200); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export async function trigger(mode) { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  await guard(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  if (mode === 'borrow') { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await db.query(`CREATE FUNCTION phase05_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'phase05-private-error'; END; $$`); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await db.query('CREATE TRIGGER phase05_failure BEFORE INSERT ON "Loan" FOR EACH ROW EXECUTE FUNCTION phase05_fail()'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  } else { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await db.query(`CREATE FUNCTION phase05_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."availableQuantity" > OLD."availableQuantity" THEN RAISE EXCEPTION 'phase05-private-error'; END IF; RETURN NEW; END; $$`); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    await db.query('CREATE TRIGGER phase05_failure BEFORE UPDATE ON "Equipment" FOR EACH ROW EXECUTE FUNCTION phase05_fail()'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
export async function removeTrigger() { await guard(); await db.query('DROP TRIGGER IF EXISTS phase05_failure ON "Loan"'); await db.query('DROP TRIGGER IF EXISTS phase05_failure ON "Equipment"'); await db.query('DROP FUNCTION IF EXISTS phase05_fail()'); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
