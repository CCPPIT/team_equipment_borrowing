import type { Metadata, Viewport } from 'next'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import type { ReactNode } from 'react'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import './globals.css'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
export const metadata: Metadata = { applicationName: 'معدات الفريق', title: 'معدات الفريق | Team Equipment Borrowing', description: 'مساحة بسيطة لاستعارة معدات الفريق وإرجاعها مع عرض المخزون وحالة الموظف.' }; // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
export const viewport: Viewport = { themeColor: '#182b3b' }; // لون شريط المتصفح من لون الحبر في الهوية
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  return <html lang="ar" dir="rtl"><body><a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>{children}</body></html>; // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
