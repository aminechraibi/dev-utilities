import { Clock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Duration calculator',
  path: '/duration-calculator',
  description: 'Add and subtract time durations, convert between duration units',
  keywords: ['duration', 'calculator', 'time', 'add', 'subtract', 'hours', 'minutes', 'seconds'],
  component: () => import('./duration-calculator.vue'),
  icon: Clock,
  createdAt: new Date('2026-05-17'),
});
