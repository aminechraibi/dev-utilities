import { Fingerprint } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'UUID inspector',
  path: '/uuid-inspector',
  description: 'Inspect and decode UUID to extract version, variant, and embedded metadata',
  keywords: ['uuid', 'inspector', 'decode', 'version', 'v1', 'v4', 'v7', 'guid'],
  component: () => import('./uuid-inspector.vue'),
  icon: Fingerprint,
  createdAt: new Date('2026-05-17'),
});
