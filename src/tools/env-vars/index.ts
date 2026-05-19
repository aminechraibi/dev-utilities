import { Variable } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Env variables commands',
  path: '/env-vars',
  description: 'Generate ready-to-use commands to set environment variables for Bash, Zsh, Fish, PowerShell, CMD and .env files',
  keywords: ['env', 'environment', 'variables', 'export', 'shell', 'bash', 'powershell', 'cmd', 'dotenv', 'set'],
  component: () => import('./env-vars.vue'),
  icon: Variable,
  createdAt: new Date('2026-05-19'),
});