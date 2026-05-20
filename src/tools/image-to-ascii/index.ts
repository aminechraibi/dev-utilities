import { Photo } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image to ascii',
  path: '/image-to-ascii',
  description: '',
  keywords: ['image', 'to', 'ascii'],
  component: () => import('./image-to-ascii.vue'),
  icon: Photo,
  createdAt: new Date('2026-05-17'),
});
