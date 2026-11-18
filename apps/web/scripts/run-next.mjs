import { spawn } from 'node:child_process'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import { createRequire } from 'node:module'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
const require = createRequire(import.meta.url); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
const mode = process.argv[2]; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
if (mode !== 'dev' && mode !== 'start') throw new Error('وضع تشغيل الواجهة غير صالح'); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
const port = process.env.WEB_PORT ?? '3000'; // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) throw new Error('WEB_PORT غير صالح'); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), mode, '--hostname', '0.0.0.0', '--port', port], { stdio: 'inherit', env: process.env }); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
child.on('error', () => { console.error('تعذر بدء الواجهة.'); process.exitCode = 1; }); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
child.on('exit', (status) => { process.exitCode = status ?? 1; }); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { child.kill(signal); }); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
