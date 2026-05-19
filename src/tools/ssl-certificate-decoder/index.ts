import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'SSL certificate decoder',
  path: '/ssl-certificate-decoder',
  description: 'Decode and inspect SSL/TLS certificates (PEM format)',
  keywords: ['ssl', 'tls', 'certificate', 'decoder', 'pem', 'x509', 'cert'],
  component: () => import('./ssl-certificate-decoder.vue'),
  icon: Certificate,
  createdAt: new Date('2026-05-17'),
});
