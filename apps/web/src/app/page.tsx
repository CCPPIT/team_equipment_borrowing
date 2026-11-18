import Link from 'next/link'; // استخدام تنقل Next الداخلي دون إعادة تحميل الصفحة
import { BorrowingScreen } from '../features/borrowing/borrowing-screen'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import { Icon } from '../components/icon'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
export default function HomePage() { // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
  return ( // إرجاع نتيجة محسوبة أو عنصر واجهة دون افتراض نجاح عملية خادم
    // بدء العنصر الجذري للواجهة مع الحفاظ على بنية JSX الصحيحة
    <div className="app-shell">
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <header className="site-header"><div className="header-inner"><Link className="brand" href="/" aria-label="معدات الفريق — الصفحة الرئيسية"><span className="brand-mark"><Icon name="box" size={26} /></span><span><strong>معدات الفريق</strong><span lang="en" dir="ltr">Team Equipment Borrowing</span></span></Link><span className="workspace-label"><span className="workspace-dot" aria-hidden="true" />مساحة عمل الموظفين</span></div></header>
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <main id="main-content" className="main-container">
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        <section className="hero" aria-labelledby="page-heading"><div><p className="eyebrow"><span aria-hidden="true" className="eyebrow-line" />معدات مشتركة. عمل أفضل.</p><h1 id="page-heading">كل ما تحتاجه،<br /><span>في مكان واحد.</span></h1><p className="hero-description">تصفّح معدات الفريق، تحقق من المتاح، واستعر ما يساعدك<br className="desktop-break" /> على إنجاز عملك. أعده حين تنتهي، ببساطة.</p></div><div className="hero-art" aria-hidden="true"><div className="art-orbit" /><div className="art-monitor"><Icon name="equipment" size={76} /></div><span className="art-chip"><Icon name="check" size={16} />جاهز لعملك القادم</span><span className="art-square" /></div></section>
        {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
        <BorrowingScreen />
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      </main>
      {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
      <footer className="site-footer"><span>معدات الفريق<span aria-hidden="true"> · </span>مساحة مشتركة، مسؤولية مشتركة.</span><span><Icon name="shield" size={15} />تُحفظ سجلات الاستعارة بعد الإرجاع</span></footer>
    {/* توضيح عربي: عرض هذا الجزء الدلالي من الواجهة وحالته الحالية */}
    </div>
  ); // تنسيق حالة الواجهة أو تنفيذ الخطوة المحددة دون تغيير بيانات الخادم محليًا
} // إغلاق النطاق الحالي بعد إكمال المسؤولية المحددة
