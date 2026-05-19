import { CalendarStats } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Date difference calculator',
  path: '/date-difference-calculator',
  description: 'Calculate difference between two dates',
  keywords: ['date', 'difference', 'calculator', 'days', 'weeks', 'months', 'years'],
  component: () => import('./date-difference-calculator.vue'),
  icon: CalendarStats,
  createdAt: new Date('2026-05-17'),
});
