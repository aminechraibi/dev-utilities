import { FileZip } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML minifier',
  path: '/html-minifier',
  description: 'Minify HTML by removing whitespace and comments',
  keywords: ['html', 'minifier', 'minify', 'compress', 'optimize', 'whitespace'],
  component: () => import('./html-minifier.vue'),
  icon: FileZip,
  createdAt: new Date('2026-05-17'),
});
