import { FileCheck } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json schema validator',
  path: '/json-schema-validator',
  description: 'Validate JSON data against a JSON Schema',
  keywords: ['json', 'schema', 'validator', 'validate', 'draft', 'jsonschema'],
  component: () => import('./json-schema-validator.vue'),
  icon: FileCheck,
  createdAt: new Date('2026-05-17'),
});