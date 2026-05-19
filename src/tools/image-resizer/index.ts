import { Photo } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image resizer',
  path: '/image-resizer',
  description: 'Resize images with aspect ratio lock and custom fill color for letterboxing',
  keywords: ['image', 'resize', 'crop', 'scale', 'canvas', 'png', 'jpeg', 'webp', 'letterbox'],
  component: () => import('./image-resizer.vue'),
  icon: Photo,
  createdAt: new Date('2026-05-19'),
});
