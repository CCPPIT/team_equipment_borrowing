import net from 'node:net'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import http from 'node:http'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import { spawn } from 'node:child_process'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import { buildApp } from '../../apps/api/build/app.js'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import { root, connectionString, target, proxyDatabaseUrl } from './environment.mjs'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
import pg from 'pg'; // استيراد أداة الاختبار المطلوبة دون إضافة اعتماد جديد
const guard = new pg.Client({ connectionString }); await guard.connect(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
const identity = await guard.query('SELECT current_database() AS name'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
if (!identity.rows[0].name.endsWith('_phase05_test')) throw new Error('رفض خدمة قاعدة غير مخصصة'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
await guard.end(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
let databaseDown = false; let api; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
const sockets = new Set(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
const proxy = net.createServer((incoming) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  incoming.on('error', () => {}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  if (databaseDown) { incoming.destroy(); return; } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  const outgoing = net.connect(target.port, target.hostname); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  sockets.add(incoming); sockets.add(outgoing); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  outgoing.on('error', () => incoming.destroy()); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  incoming.on('close', () => { sockets.delete(incoming); outgoing.destroy(); }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  outgoing.on('close', () => { sockets.delete(outgoing); incoming.destroy(); }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  incoming.pipe(outgoing); outgoing.pipe(incoming); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
await new Promise((resolve, reject) => { proxy.once('error', reject); proxy.listen(5545, '127.0.0.1', resolve); }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
async function apiUp() { if (!api) { api = await buildApp({ nodeEnv: 'test', apiPort: 3011, databaseUrl: proxyDatabaseUrl }); await api.listen({ host: '127.0.0.1', port: 3011 }); } } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
await apiUp(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
const control = http.createServer(async (request, response) => { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  try { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    if (request.method !== 'POST') { response.writeHead(405); response.end(); return; } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    if (request.url === '/database/down') { databaseDown = true; for (const socket of sockets) socket.destroy(); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    else if (request.url === '/database/up') databaseDown = false; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    else if (request.url === '/backend/down') { if (api) await api.close(); api = undefined; } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    else if (request.url === '/backend/up') await apiUp(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    else { response.writeHead(404); response.end(); return; } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
    response.writeHead(200, { 'Content-Type': 'application/json' }); response.end('{"ok":true}'); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  } catch { response.writeHead(500); response.end('{"ok":false}'); } // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
}); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
await new Promise((resolve, reject) => { control.once('error', reject); control.listen(3016, '127.0.0.1', resolve); }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
const browserEnv = { ...process.env, NODE_ENV: 'production', API_BASE_URL: 'http://127.0.0.1:3011', WEB_PORT: '3010' }; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
for (const key of Object.keys(browserEnv)) if (/DATABASE|PGPASSWORD|SECRET|TOKEN/.test(key)) delete browserEnv[key]; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
const web = spawn(process.execPath, ['scripts/run-next.mjs', 'start'], { cwd: `${root}apps/web`, env: browserEnv, stdio: 'inherit' }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
web.on('error', () => { process.exitCode = 1; }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
web.on('exit', (status) => { if (!stopping) { process.exitCode = status || 1; void shutdown(); } }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
let stopping = false; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
async function shutdown() { // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  if (stopping) return; stopping = true; databaseDown = false; // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  web.kill('SIGTERM'); if (api) await api.close(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  for (const socket of sockets) socket.destroy(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
  proxy.close(); control.close(); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
} // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { void shutdown(); }); // تنسيق التحقق المعزول وحماية البيانات أثناء اختبار التكامل
