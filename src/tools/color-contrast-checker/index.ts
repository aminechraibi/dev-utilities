import { Eye } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Color contrast checker',
  path: '/color-contrast-checker',
  description: 'Check WCAG color contrast ratios for accessibility',
  keywords: ['color', 'contrast', 'checker', 'wcag', 'accessibility', 'a11y'],
  component: () => import('./color-contrast-checker.vue'),
  icon: Eye,
  createdAt: new Date('2026-05-17'),
});
