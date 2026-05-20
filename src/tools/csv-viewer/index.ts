import { Table } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Csv viewer',
  path: '/csv-viewer',
  description: 'Paste CSV and view it as a formatted table',
  keywords: ['csv', 'viewer', 'table', 'parse', 'delimiter', 'data'],
  component: () => import('./csv-viewer.vue'),
  icon: Table,
  createdAt: new Date('2026-05-17'),
});
