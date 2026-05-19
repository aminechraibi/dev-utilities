import { ChartDots } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Regex visualizer',
  path: '/regex-visualizer',
  description: 'Visualize regular expressions as railroad diagrams',
  keywords: ['regex', 'visualizer', 'railroad', 'diagram', 'regular', 'expression'],
  component: () => import('./regex-visualizer.vue'),
  icon: ChartDots,
  createdAt: new Date('2026-05-17'),
});
