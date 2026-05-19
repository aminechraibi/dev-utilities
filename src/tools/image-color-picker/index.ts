import { Droplet } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image color picker',
  path: '/image-color-picker',
  description: 'Pick and identify colors from any image',
  keywords: ['image', 'color', 'picker', 'eyedropper', 'hex', 'rgb', 'palette'],
  component: () => import('./image-color-picker.vue'),
  icon: Droplet,
  createdAt: new Date('2026-05-17'),
});
