import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON to SQL',
  path: '/json-to-sql',
  description: 'Generate SQL CREATE TABLE and INSERT statements from JSON data',
  keywords: ['json', 'sql', 'converter', 'insert', 'create', 'table', 'mysql', 'postgresql'],
  component: () => import('./json-to-sql.vue'),
  icon: Database,
  createdAt: new Date('2026-05-17'),
});
