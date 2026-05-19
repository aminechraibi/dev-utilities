import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'PDF to text',
  path: '/pdf-to-text',
  description: 'Extract text content from PDF files',
  keywords: ['pdf', 'text', 'extract', 'converter', 'reader', 'content'],
  component: () => import('./pdf-to-text.vue'),
  icon: FileText,
  createdAt: new Date('2026-05-17'),
});
