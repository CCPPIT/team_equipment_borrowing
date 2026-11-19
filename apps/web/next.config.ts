import type { NextConfig } from 'next'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
const apiBaseRaw = process.env.API_BASE_URL ?? (process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:3001' : undefined); // تفعيل الوكيل الخارجي عند ضبطه أو في التطوير فقط
if (apiBaseRaw) { // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
  const apiBase = new URL(apiBaseRaw); // تعريف قيمة محلية واضحة النوع لهذا المسار
  if (!['http:', 'https:'].includes(apiBase.protocol) || apiBase.username || apiBase.password || apiBase.pathname !== '/' || apiBase.search || apiBase.hash) throw new Error('API_BASE_URL يجب أن يكون origin للخادم دون أسرار أو مسار'); // التحقق من الشرط لمنع حالة غير صالحة أو استجابة متقادمة
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
const proxyOrigin = apiBaseRaw ? new URL(apiBaseRaw).origin : null; // origin الخادم الخارجي المعتمد عندما يكون الوضع وكيلًا
const config: NextConfig = { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  poweredByHeader: false, // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
  allowedDevOrigins: ['*.e2b.app', '*.vercel.app'], // إتاحة المعاينة من بيئات Arena وVercel دون توسعة سطح الهجوم
  experimental: { cpus: 2, extensionAlias: { '.js': ['.ts', '.tsx', '.js'], '.mjs': ['.mts', '.mjs'] } }, // حل استيرادات ESM من مصدر TypeScript في مساحة العمل
  async rewrites() { // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
    const proxy = proxyOrigin ? [{ source: '/api/:path*', destination: `${proxyOrigin}/api/:path*` }] : []; // غياب API_BASE_URL يفعّل معالج الداخلية بدل الوكيل
    return { beforeFiles: proxy, afterFiles: [], fallback: [] }; // أولوية الوكيل في وضع التطوير مع بقاء المعالج الداخلي للإنتاج
  }, // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
}; // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
export default config; // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
