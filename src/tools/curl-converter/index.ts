import { Terminal2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'cURL converter',
  path: '/curl-converter',
  description: 'Convert cURL commands to fetch, axios, Python requests or Node.js',
  keywords: ['curl', 'fetch', 'axios', 'python', 'requests', 'http', 'converter'],
  component: () => import('./curl-converter.vue'),
  icon: Terminal2,
  createdAt: new Date('2026-05-19'),
});
