import { defineConfig, globalIgnores } from 'eslint/config'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import nextVitals from 'eslint-config-next/core-web-vitals'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
import nextTs from 'eslint-config-next/typescript'; // استيراد الاعتماد المطلوب مع فصل العرض عن الاتصال بالخادم
export default defineConfig([...nextVitals, ...nextTs, globalIgnores(['.next/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**'])]); // إتاحة تعريف واضح الأنواع لبقية الواجهة أو الاختبارات
