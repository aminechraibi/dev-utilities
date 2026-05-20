import { Table } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Csv to json',
  path: '/csv-to-json',
  description: '',
  keywords: ['csv', 'to', 'json'],
  component: () => import('./csv-to-json.vue'),
  icon: Table,
  createdAt: new Date('2026-05-17'),
});
