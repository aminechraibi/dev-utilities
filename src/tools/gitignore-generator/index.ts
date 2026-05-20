import { GitBranch } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Gitignore generator',
  path: '/gitignore-generator',
  description: 'Generate .gitignore files for your project\'s languages and frameworks',
  keywords: ['gitignore', 'git', 'ignore', 'generator', 'node', 'python', 'java'],
  component: () => import('./gitignore-generator.vue'),
  icon: GitBranch,
  createdAt: new Date('2026-05-17'),
});
