import { Radio } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Morse code translator',
  path: '/morse-code-translator',
  description: 'Translate text to Morse code and Morse code to text',
  keywords: ['morse', 'code', 'translator', 'encode', 'decode', 'radio', 'signal'],
  component: () => import('./morse-code-translator.vue'),
  icon: Radio,
  createdAt: new Date('2026-05-17'),
});
