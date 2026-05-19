import { Hash } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Number to words',
  path: '/number-to-words',
  description: 'Convert numbers to their English word representation',
  keywords: ['number', 'words', 'convert', 'english', 'spelling', 'ordinal'],
  component: () => import('./number-to-words.vue'),
  icon: Hash,
  createdAt: new Date('2026-05-17'),
});
