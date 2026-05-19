import { FileCode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'XML to YAML',
  path: '/xml-to-yaml',
  description: 'Convert XML to YAML format',
  keywords: ['xml', 'yaml', 'converter', 'format', 'transform'],
  component: () => import('./xml-to-yaml.vue'),
  icon: FileCode,
  createdAt: new Date('2026-05-17'),
});
