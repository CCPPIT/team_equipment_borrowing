import { spawnSync } from 'node:child_process'; // تجهيز ترحيل قاعدة الاختبار فقط بعد التحقق من عزلها
import { fileURLToPath } from 'node:url'; // تجهيز ترحيل قاعدة الاختبار فقط بعد التحقق من عزلها
import { loadTestEnv } from '../src/config/env.js'; // تجهيز ترحيل قاعدة الاختبار فقط بعد التحقق من عزلها
const env = loadTestEnv(); // تجهيز ترحيل قاعدة الاختبار فقط بعد التحقق من عزلها
const result = spawnSync('npm', ['run', 'db:migrate'], { cwd: fileURLToPath(new URL('../', import.meta.url)), env: { ...process.env, DATABASE_URL: env.databaseUrl }, stdio: 'inherit' }); // تجهيز ترحيل قاعدة الاختبار فقط بعد التحقق من عزلها
if (result.error) throw result.error; // تجهيز ترحيل قاعدة الاختبار فقط بعد التحقق من عزلها
process.exitCode = result.status ?? 1; // تجهيز ترحيل قاعدة الاختبار فقط بعد التحقق من عزلها
