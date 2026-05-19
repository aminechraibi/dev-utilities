import { Clock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Cron expression parser',
  path: '/cron-expression-parser',
  description: 'Parse cron expressions and show human-readable description with next run times',
  keywords: ['cron', 'expression', 'parser', 'schedule', 'human', 'readable', 'next', 'run'],
  component: () => import('./cron-expression-parser.vue'),
  icon: Clock,
  createdAt: new Date('2026-05-17'),
});