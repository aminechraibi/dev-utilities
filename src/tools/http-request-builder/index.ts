import { Api } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTTP Request Builder',
  path: '/http-request-builder',
  description: 'Build HTTP requests visually and generate code in cURL, fetch, axios, Python, PHP, and Go',
  keywords: ['http', 'request', 'builder', 'curl', 'fetch', 'axios', 'python', 'php', 'go', 'api', 'rest'],
  component: () => import('./http-request-builder.vue'),
  icon: Api,
  createdAt: new Date('2026-05-19'),
});
