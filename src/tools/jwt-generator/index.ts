import { Key } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JWT generator',
  path: '/jwt-generator',
  description: 'Generate and sign JSON Web Tokens (JWT) with custom header, payload, and secret',
  keywords: ['jwt', 'json', 'web', 'token', 'generator', 'sign', 'hs256', 'hmac'],
  component: () => import('./jwt-generator.vue'),
  icon: Key,
  createdAt: new Date('2026-05-17'),
});
