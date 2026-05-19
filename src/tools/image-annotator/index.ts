import { Pencil } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image annotator',
  path: '/image-annotator',
  description: 'Annotate images with text, arrows, and shapes',
  keywords: ['image', 'annotator', 'annotate', 'draw', 'text', 'arrow', 'canvas'],
  component: () => import('./image-annotator.vue'),
  icon: Pencil,
  createdAt: new Date('2026-05-17'),
});
