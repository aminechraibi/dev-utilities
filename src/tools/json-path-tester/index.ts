import { Search } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSONPath tester',
  path: '/json-path-tester',
  description: 'Test JSONPath expressions against JSON data',
  keywords: ['json', 'path', 'tester', 'jsonpath', 'query', 'expression'],
  component: () => import('./json-path-tester.vue'),
  icon: Search,
  createdAt: new Date('2026-05-17'),
});
