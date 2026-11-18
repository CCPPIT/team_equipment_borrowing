CREATE TABLE "Employee" ( -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "id" UUID NOT NULL, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "name" TEXT NOT NULL, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 CONSTRAINT "Employee_pkey" PRIMARY KEY ("id") -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
); -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
CREATE TABLE "Equipment" ( -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "id" UUID NOT NULL, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "name" TEXT NOT NULL, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "description" TEXT, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "totalQuantity" INTEGER NOT NULL, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "availableQuantity" INTEGER NOT NULL, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id"), -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 CONSTRAINT eq_total_nonnegative CHECK ("totalQuantity" >= 0), -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 CONSTRAINT eq_available_bounds CHECK ("availableQuantity" >= 0 AND "availableQuantity" <= "totalQuantity") -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
); -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
CREATE TABLE "Loan" ( -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "id" UUID NOT NULL, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "employeeId" UUID NOT NULL, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "equipmentId" UUID NOT NULL, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "borrowedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 "returnedAt" TIMESTAMPTZ(3), -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 CONSTRAINT "Loan_pkey" PRIMARY KEY ("id"), -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 CONSTRAINT "Loan_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE RESTRICT, -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
 CONSTRAINT "Loan_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE RESTRICT -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
); -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
CREATE UNIQUE INDEX unique_active_loan_per_employee_equipment ON "Loan" ("employeeId", "equipmentId") WHERE "returnedAt" IS NULL; -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
CREATE INDEX idx_loan_equipment ON "Loan" ("equipmentId"); -- تعريف هيكل البيانات أو قيد السلامة ضمن الترحيل الأول
