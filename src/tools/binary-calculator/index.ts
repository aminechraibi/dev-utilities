import { Calculator } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Binary calculator',
  path: '/binary-calculator',
  description: 'Perform bitwise operations (AND, OR, XOR, NOT, shifts) with binary/hex/decimal display',
  keywords: ['binary', 'calculator', 'bitwise', 'and', 'or', 'xor', 'not', 'shift', 'hex'],
  component: () => import('./binary-calculator.vue'),
  icon: Calculator,
  createdAt: new Date('2026-05-17'),
});
