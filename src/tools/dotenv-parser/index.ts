import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Dotenv parser',
  path: '/dotenv-parser',
  description: 'Parse and inspect .env file contents',
  keywords: ['dotenv', 'env', 'parser', 'environment', 'variables', 'config'],
  component: () => import('./dotenv-parser.vue'),
  icon: FileText,
  createdAt: new Date('2026-05-17'),
});