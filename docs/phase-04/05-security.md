# التبعيات والقيود الأمنية
`npm audit --omit=dev` = 0، و`npm audit` = 16 high، دون critical. النتائج الكاملة في evidence. تشمل Vitest وVite وeslint-config-next وسلسلة glob/picomatch؛ ليست 16 ثغرة مستقلة، بل حزم متأثرة عبر شجرة الأدوات.

المصدر المبلغ عنه في audit: picomatch ReDoS عبر repeated extglobs، GHSA-fc5q-39xc-vjpf. تجنب patterns غير موثوقة أو تعريض أدوات التطوير لخدمة عامة. الفحص محلي في تاريخ التنفيذ وليس ضمانًا مستقبليًا.

لم أنفذ audit fix --force: التوصيات الحالية تتضمن خفض eslint-config-next إلى 14 وVitest إلى 3، ما يكسر توافق Next16 أو يعيد مخاطر تاريخية. إبقاء النسخ المتوافقة مقصود لكنه **قيد غير محلول** وليس قبولًا ضمنيًا من المالك. ESLint9 يصدر تنبيه انتهاء دعم؛ الانتقال إلى10 يحتاج توافق plugin-react، خارج الإصلاح القسري الآمن الحالي.

لا مكتبات auth ولا أسرار في الواجهة؛ API_BASE_URL خادمي فقط. لا تغيير backend لتجاوز قيود العقد. اختيار موظف ليس authorization. الاعتماد النهائي والنشر العام يحتاجان مراجعة هذه المخاطر؛ لم ننفذ مرحلة أمان/نشر مستقلة.

## الحزم المتأثرة بحسب التقرير
- `@next/eslint-plugin-next`: high
- `@typescript-eslint/eslint-plugin`: high
- `@typescript-eslint/parser`: high
- `@typescript-eslint/type-utils`: high
- `@typescript-eslint/typescript-estree`: high
- `@typescript-eslint/utils`: high
- `eslint-config-next`: high
- `eslint-import-resolver-typescript`: high
- `fast-glob`: high
- `fdir`: high
- `micromatch`: high
- `picomatch`: high
- `tinyglobby`: high
- `typescript-eslint`: high
- `vite`: high
- `vitest`: high
