import { LetterCase } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Base32 encoder/decoder',
  path: '/base32-encoder',
  description: 'Encode and decode Base32 strings (RFC 4648)',
  keywords: ['base32', 'encoder', 'decoder', 'encode', 'decode', 'rfc4648'],
  component: () => import('./base32-encoder.vue'),
  icon: LetterCase,
  createdAt: new Date('2026-05-17'),
});
