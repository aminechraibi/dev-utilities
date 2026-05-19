import { Briefcase } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Business days calculator',
  path: '/business-days-calculator',
  description: 'Count business days between dates and add business days',
  keywords: ['business', 'days', 'calculator', 'workdays', 'holidays', 'weekdays'],
  component: () => import('./business-days-calculator.vue'),
  icon: Briefcase,
  createdAt: new Date('2026-05-17'),
});
