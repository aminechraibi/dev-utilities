import { BrandJavascript } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JavaScript formatter',
  path: '/javascript-formatter',
  description: 'Format and beautify JavaScript and TypeScript code',
  keywords: ['javascript', 'formatter', 'beautify', 'format', 'js', 'typescript', 'code'],
  component: () => import('./javascript-formatter.vue'),
  icon: BrandJavascript,
  createdAt: new Date('2026-05-17'),
});
