import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CSS formatter',
  path: '/css-formatter',
  description: 'Format or minify CSS stylesheets',
  keywords: ['css', 'formatter', 'minifier', 'beautify', 'format', 'minify', 'style'],
  component: () => import('./css-formatter.vue'),
  icon: Palette,
  createdAt: new Date('2026-05-17'),
});
