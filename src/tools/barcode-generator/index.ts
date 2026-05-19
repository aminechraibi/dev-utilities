import { Barcode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Barcode generator',
  path: '/barcode-generator',
  description: 'Generate CODE128 barcodes as SVG',
  keywords: ['barcode', 'generator', 'code128', 'svg', 'scan'],
  component: () => import('./barcode-generator.vue'),
  icon: Barcode,
  createdAt: new Date('2026-05-17'),
});
