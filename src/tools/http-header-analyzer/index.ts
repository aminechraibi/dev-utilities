import { World } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTTP header analyzer',
  path: '/http-header-analyzer',
  description: 'Parse and explain HTTP response headers',
  keywords: ['http', 'header', 'analyzer', 'parser', 'response', 'cors', 'security'],
  component: () => import('./http-header-analyzer.vue'),
  icon: World,
  createdAt: new Date('2026-05-17'),
});
