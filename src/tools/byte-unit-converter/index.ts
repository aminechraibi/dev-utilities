import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Byte unit converter',
  path: '/byte-unit-converter',
  description: 'Convert between byte units (B, KB, MB, GB, TB - decimal and binary)',
  keywords: ['byte', 'converter', 'kb', 'mb', 'gb', 'tb', 'kib', 'mib', 'gib', 'storage', 'unit'],
  component: () => import('./byte-unit-converter.vue'),
  icon: Database,
  createdAt: new Date('2026-05-17'),
});
