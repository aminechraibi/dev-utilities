import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown ↔ HTML',
  path: '/markdown-html-converter',
  description: 'Convert Markdown to HTML and HTML back to Markdown',
  keywords: ['markdown', 'html', 'converter', 'marked', 'md', 'markup'],
  component: () => import('./markdown-html-converter.vue'),
  icon: Markdown,
  createdAt: new Date('2026-05-19'),
});
