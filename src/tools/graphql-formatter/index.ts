import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Graphql formatter',
  path: '/graphql-formatter',
  description: 'Format and prettify GraphQL queries and mutations',
  keywords: ['graphql', 'formatter', 'prettify', 'query', 'mutation', 'gql'],
  component: () => import('./graphql-formatter.vue'),
  icon: Braces,
  createdAt: new Date('2026-05-17'),
});