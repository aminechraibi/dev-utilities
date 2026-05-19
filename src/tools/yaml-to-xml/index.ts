import { FileCode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'YAML to XML',
  path: '/yaml-to-xml',
  description: 'Convert YAML to XML format',
  keywords: ['yaml', 'xml', 'converter', 'transform'],
  component: () => import('./yaml-to-xml.vue'),
  icon: FileCode,
  createdAt: new Date('2026-05-17'),
});
