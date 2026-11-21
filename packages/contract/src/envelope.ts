import type { ErrorCode } from './errors.js'; // استيراد الأكواد بامتداد مطابق لحل NodeNext
// مغلف نجاح موحد: استجابة كل مسار ناجح تحمل success=true وdata بالشكل المطابق للمسار
export interface ApiSuccess<T> { success: true; data: T; } // عقد النجاح المغلف الذي تنتظره الواجهة وتفك ترميزه
// تفاصيل الخطأ؛ fields اختيارية تُملأ فقط عند فشل التحقق على الحقول (VALIDATION_ERROR)
export interface ApiErrorDetail { code: ErrorCode; message: string; fields?: Record<string, string>; } // عقد فشل مغلف دون كشف مسارات داخلية أو أسرار
// مغلف فشل موحد: كل استجابة غير ناجحة تحمل success=false وerror بالتفاصيل كما يبنيها معالج أخطاء الخادم
export interface ApiFailure { success: false; error: ApiErrorDetail; } // عقد الفشل المغلف كما يراه عميل HTTP
export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure; // اتحاد يغطي الحالتين؛ narrowing عبر حقل success دون فحص الحالة الرقمية
