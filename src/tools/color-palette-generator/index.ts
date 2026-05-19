import { ColorSwatch } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Color palette generator',
  path: '/color-palette-generator',
  description: 'Generate color palettes (complementary, triadic, analogous, monochromatic)',
  keywords: ['color', 'palette', 'generator', 'complementary', 'triadic', 'analogous', 'monochromatic', 'design'],
  component: () => import('./color-palette-generator.vue'),
  icon: ColorSwatch,
  createdAt: new Date('2026-05-17'),
});
