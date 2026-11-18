import { defineConfig } from 'vitest/config'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
export default defineConfig({ test: { include: ['tests/**/*.test.ts'], fileParallelism: false, testTimeout: 15000, hookTimeout: 15000 } }); // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
