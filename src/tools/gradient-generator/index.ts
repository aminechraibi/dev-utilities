import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Gradient generator',
  path: '/gradient-generator',
  description: 'Generate CSS linear, radial, and conic gradients with live preview',
  keywords: ['gradient', 'css', 'generator', 'linear', 'radial', 'conic', 'color', 'background'],
  component: () => import('./gradient-generator.vue'),
  icon: Palette,
  createdAt: new Date('2026-05-17'),
});
