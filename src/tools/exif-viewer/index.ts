import { Camera } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'EXIF viewer',
  path: '/exif-viewer',
  description: 'View EXIF metadata from JPEG images',
  keywords: ['exif', 'viewer', 'jpeg', 'metadata', 'image', 'camera'],
  component: () => import('./exif-viewer.vue'),
  icon: Camera,
  createdAt: new Date('2026-05-17'),
});
