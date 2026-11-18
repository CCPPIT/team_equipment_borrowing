import '@testing-library/jest-dom/vitest'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import { cleanup } from '@testing-library/react'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
import { afterEach, vi } from 'vitest'; // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); }); // اختبار سلوك الواجهة أو تجهيز بياناته دون استبدال تحقق التكامل الحقيقي
