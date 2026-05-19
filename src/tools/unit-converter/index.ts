import { Ruler } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Unit converter',
  path: '/unit-converter',
  description: 'Convert between units of length, weight, volume, area, speed and pressure',
  keywords: ['unit', 'converter', 'length', 'weight', 'volume', 'area', 'speed', 'pressure'],
  component: () => import('./unit-converter.vue'),
  icon: Ruler,
  createdAt: new Date('2026-05-17'),
});
