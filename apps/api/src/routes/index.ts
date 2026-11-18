import type { FastifyInstance } from 'fastify'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { listEmployees, listEquipment } from '../services/equipment.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { borrow, returnLoan } from '../services/loans.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { borrowBody, employeeQuery, emptyQuery, returnParams, type BorrowBody, type EmployeeQuery, type ReturnParams } from '../schemas/requests.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
export async function registerRoutes(app: FastifyInstance): Promise<void> { // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
  app.get('/api/health', { schema: { querystring: emptyQuery } }, async () => ({ success: true, data: { status: 'ok' } })); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  app.get('/api/employees', { schema: { querystring: emptyQuery } }, async () => ({ success: true, data: { employees: await listEmployees(app.prisma) } })); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  app.get<{ Querystring: EmployeeQuery }>('/api/equipment', { schema: { querystring: employeeQuery } }, async (request) => ({ success: true, data: await listEquipment(app.prisma, request.query.employeeId) })); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
  app.post<{ Body: BorrowBody }>('/api/loans', { schema: { body: borrowBody, querystring: emptyQuery } }, async (request, reply) => { // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
    const loan = await borrow(app.prisma, request.body.employeeId, request.body.equipmentId); // تعريف قيمة محلية واضحة النوع لهذا المسار
    return reply.code(201).send({ success: true, data: { loan } }); // إرجاع النتيجة بعد اكتمال التحقق المطلوب
  }); // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
  app.post<{ Body: EmployeeQuery; Params: ReturnParams }>('/api/loans/:loanId/return', { schema: { body: employeeQuery, params: returnParams, querystring: emptyQuery } }, async (request) => ({ success: true, data: { loan: await returnLoan(app.prisma, request.body.employeeId, request.params.loanId) } })); // متابعة التعريف أو الاستدعاء ضمن النطاق الحالي
} // إغلاق النطاق أو البنية الحالية دون تغيير إضافي للحالة
