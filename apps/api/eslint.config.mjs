import tseslint from 'typescript-eslint'; // إعادة استخدام محلل وقواعد TypeScript المثبتة بالفعل ضمن أدوات المشروع
export default [ // تجميع إعداد فحص الخلفية دون تحميل قواعد صفحات Next الخاصة بالواجهة
  { ignores: ['build/**', 'node_modules/**', 'coverage/**'] }, // استبعاد الملفات المولدة والتبعيات من مراجعة المصدر
  ...tseslint.configs.recommended, // تفعيل قواعد TypeScript الموصى بها ومنع any الصريح والاستيرادات الميتة
  { rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }] } }, // السماح فقط بالأسماء المبدوءة بشرطة سفلية التي تعلن إهمال قيمة عمدًا مثل createdAt عند تشكيل DTO
]; // إغلاق الإعداد دون تعطيل قواعد منطق العمل أو أي فحص للأنواع
