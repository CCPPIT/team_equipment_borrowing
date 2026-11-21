import { execFileSync } from 'node:child_process'; // تشغيل خطوات النشر دون قذيفة فرعية
const run = (command, args, env = {}) => execFileSync(command, args, { stdio: 'inherit', cwd: process.cwd(), env: { ...process.env, ...env } }); // تعريف أداة إطلاق الخطوات بوراثة البيئة
const vercelEnv = process.env.VERCEL_ENV ?? 'development'; // قراءة بيئة Vercel؛ غيابها يعني بناءً محليًا
console.log(`[vercel-build] VERCEL_ENV=${vercelEnv}`); // سجل تشغيلي دون أسرار
console.log('[vercel-build] بناء حزمة العقد المشتركة @team/contract'); // خطوة تأسيسية يحتاجها الـapi والواجهة معًا
run('npm', ['run', 'contract:build']); // بناء نظيف لحزمة العقد قبل أي توليد أو بناء آخر
const placeholder = 'postgresql://build:build@127.0.0.1:5432/build'; // قيمة صورية لتمرير تحققات الصيغة فقط دون اتصال
const generateEnv = process.env.DATABASE_URL ? {} : { DATABASE_URL: placeholder }; // توليد العميل لا يحتاج اتصالًا فعليًا
console.log('[vercel-build] توليد Prisma Client'); // سجل تشغيلي دون أسرار
run('npx', ['prisma', 'generate', '--schema', 'apps/api/prisma/schema.prisma'], generateEnv); // توليد العميل قبل بناء الواجهة
if (vercelEnv === 'production' && process.env.DATABASE_URL) { // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  console.log('[vercel-build] تطبيق الترحيل على قاعدة الإنتاج'); // سجل تشغيلي دون أسرار
  run('npm', ['run', 'db:migrate']); // تطبيق SQL migrations على DATABASE_URL
  console.log('[vercel-build] بذر البيانات الأولية دون تصفير المخزون'); // سجل تشغيلي دون أسرار
  run('npm', ['run', 'db:seed']); // إدخال الموظفين والأنواع إن لم تكن موجودة
} else if (vercelEnv === 'production') { // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  console.log('[vercel-build] تحذير: DATABASE_URL غير مضبوط؛ ستنجح الواجهة لكن استدعاءات /api ستفشل حتى تُضاف القاعدة'); // إفصاح واضح بدل فشل مبهم
} else { // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
  console.log('[vercel-build] تخطي الترحيل والبذر لهذه البيئة'); // إبقاء المعاينات بلا لمس قاعدة الإنتاج
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
