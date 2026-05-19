import { GitCompare } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Semver comparator',
  path: '/semver-comparator',
  description: 'Parse, compare, and validate semantic version strings (semver)',
  keywords: ['semver', 'version', 'compare', 'semantic', 'range', 'npm'],
  component: () => import('./semver-comparator.vue'),
  icon: GitCompare,
  createdAt: new Date('2026-05-17'),
});
