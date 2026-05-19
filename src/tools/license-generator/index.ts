import { FileCertificate } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'License generator',
  path: '/license-generator',
  description: 'Generate open source license files',
  keywords: ['license', 'generator', 'mit', 'gpl', 'apache', 'bsd', 'open source'],
  component: () => import('./license-generator.vue'),
  icon: FileCertificate,
  createdAt: new Date('2026-05-17'),
});
