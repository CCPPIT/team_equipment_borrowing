import { defineConfig } from 'vitest/config'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
export default defineConfig({ test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'], include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'], fileParallelism: false }, oxc: { jsx: { runtime: 'automatic' } } }); // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
