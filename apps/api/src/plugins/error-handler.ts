import type { FastifyInstance, FastifyError } from 'fastify'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { classifyError, DomainError } from '../lib/errors.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { ERROR_MESSAGES } from '@team/contract'; // قراءة نصوص الرموز المشتركة من العقد دون تكرارها يدويًا
export function registerErrorHandler(app: FastifyInstance): void { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  app.setErrorHandler<FastifyError>((error, request, reply) => { // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
    const badRequest = error.validation !== undefined || error.code === 'FST_ERR_CTP_INVALID_JSON_BODY' || error.code === 'FST_ERR_CTP_EMPTY_JSON_BODY'; // تعريف قيمة محلية واضحة النوع لهذا المسار
    const mapped = badRequest ? new DomainError('VALIDATION_ERROR', 400) : classifyError(error); // تعريف قيمة محلية واضحة النوع لهذا المسار
    const status = error.statusCode === 415 ? 415 : mapped.status; // تعريف قيمة محلية واضحة النوع لهذا المسار
    const fields = error.validation ? Object.fromEntries(error.validation.map((issue) => [issue.instancePath || String(issue.params.missingProperty ?? issue.params.additionalProperty ?? 'request'), issue.keyword === 'required' ? 'هذا الحقل مطلوب.' : issue.keyword === 'additionalProperties' ? 'هذا الحقل غير مدعوم.' : 'صيغة القيمة غير صالحة.'])) : undefined; // تجهيز تفاصيل حقول آمنة دون كشف المخطط أو المدخلات الحساسة
    const safeError = status === 415 ? { code: 'UNSUPPORTED_MEDIA_TYPE', message: ERROR_MESSAGES.UNSUPPORTED_MEDIA_TYPE } : { code: mapped.code, message: mapped.message, ...(fields ? { fields } : {}) }; // تعريف قيمة محلية واضحة النوع لهذا المسار
    if (status >= 500) request.log.error({ category: mapped.code, requestId: request.id, errorName: error.name, errorCode: error.code }, 'فشل طلب دون تسجيل أسرار أو استعلامات'); // التحقق من الشرط قبل متابعة التنفيذ وحماية صحة الحالة
    return reply.code(status).send({ success: false, error: safeError }); // إرجاع النتيجة بعد اكتمال التحقق المطلوب
  }); // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
  app.setNotFoundHandler((_request, reply) => reply.code(404).send({ success: false, error: { code: 'ROUTE_NOT_FOUND', message: ERROR_MESSAGES.ROUTE_NOT_FOUND } })); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
