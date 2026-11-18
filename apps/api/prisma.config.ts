import { defineConfig } from 'prisma/config'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
import { loadEnv } from './src/config/env.js'; // استيراد الاعتماد المحدد دون تكرار المسؤوليات
export default defineConfig({ schema: 'prisma/schema.prisma', migrations: { path: 'prisma/migrations', seed: 'tsx prisma/seed.ts' }, datasource: { url: loadEnv().databaseUrl } }); // إتاحة تعريف محدد الأنواع لبقية التطبيق أو الاختبارات
