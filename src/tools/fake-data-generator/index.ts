import { Robot } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Fake data generator',
  path: '/fake-data-generator',
  description: 'Generate fake data for testing: names, emails, addresses',
  keywords: ['fake', 'data', 'generator', 'name', 'email', 'address', 'mock'],
  component: () => import('./fake-data-generator.vue'),
  icon: Robot,
  createdAt: new Date('2026-05-17'),
});
