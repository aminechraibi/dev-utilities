import { ListNumbers } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Numbering bubbles',
  path: '/numbering-bubbles',
  description: 'Generate numbered bubble/badge SVGs for documentation and diagrams',
  keywords: ['numbering', 'bubbles', 'badges', 'svg', 'circles', 'numbered', 'diagram', 'documentation'],
  component: () => import('./numbering-bubbles.vue'),
  icon: ListNumbers,
  createdAt: new Date('2026-05-17'),
});
