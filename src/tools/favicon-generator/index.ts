import { Star } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Favicon generator',
  path: '/favicon-generator',
  description: 'Generate favicons from text or emoji with custom colors',
  keywords: ['favicon', 'generator', 'icon', 'emoji', 'text', 'website', 'ico', 'png'],
  component: () => import('./favicon-generator.vue'),
  icon: Star,
  createdAt: new Date('2026-05-17'),
});
