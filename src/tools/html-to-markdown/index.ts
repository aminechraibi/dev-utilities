import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML to Markdown',
  path: '/html-to-markdown',
  description: 'Convert HTML to Markdown format',
  keywords: ['html', 'markdown', 'converter', 'md'],
  component: () => import('./html-to-markdown.vue'),
  icon: FileText,
  createdAt: new Date('2026-05-17'),
});
