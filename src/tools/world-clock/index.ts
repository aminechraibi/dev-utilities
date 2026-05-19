import { World } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'World clock',
  path: '/world-clock',
  description: 'View current time in multiple timezones simultaneously',
  keywords: ['world', 'clock', 'timezone', 'time', 'international'],
  component: () => import('./world-clock.vue'),
  icon: World,
  createdAt: new Date('2026-05-17'),
});
