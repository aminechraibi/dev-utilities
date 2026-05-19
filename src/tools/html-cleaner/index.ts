import { Eraser } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML cleaner',
  path: '/html-cleaner',
  description: 'Clean and sanitize HTML — remove styles, classes, tags, comments, tables, links, and more',
  keywords: ['html', 'cleaner', 'sanitize', 'strip', 'remove', 'styles', 'tags', 'attributes'],
  component: () => import('./html-cleaner.vue'),
  icon: Eraser,
  createdAt: new Date('2026-05-19'),
});