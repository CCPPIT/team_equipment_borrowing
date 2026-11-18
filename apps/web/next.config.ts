import type { NextConfig } from 'next'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
const apiBase = new URL(process.env.API_BASE_URL ?? 'http://127.0.0.1:3001'); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
if (!['http:', 'https:'].includes(apiBase.protocol) || apiBase.username || apiBase.password || apiBase.pathname !== '/' || apiBase.search || apiBase.hash) throw new Error('API_BASE_URL يجب أن يكون origin للخادم دون أسرار أو مسار'); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
const config: NextConfig = { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  poweredByHeader: false, // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  allowedDevOrigins: ['*.e2b.app'], // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  experimental: { cpus: 2 }, // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  async rewrites() { return [{ source: '/api/:path*', destination: `${apiBase.origin}/api/:path*` }]; }, // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
}; // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export default config; // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
