import { ChartBar } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Statistics calculator',
  path: '/statistics-calculator',
  description: 'Calculate statistics: mean, median, mode, standard deviation',
  keywords: ['statistics', 'calculator', 'mean', 'median', 'mode', 'stddev', 'variance'],
  component: () => import('./statistics-calculator.vue'),
  icon: ChartBar,
  createdAt: new Date('2026-05-17'),
});
