import forge from 'node-forge';

export interface CertificateInfo {
  subject: Record<string, string>;
  issuer: Record<string, string>;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  publicKeyBits: number;
  subjectAltNames: string[];
  fingerprint: {
    sha1: string;
    sha256: string;
  };
  isCA: boolean;
  version: number;
}

function rdnToRecord(rdnSet: forge.pki.CertificateField[]): Record<string, string> {
  const result: Record<string, string> = {};
  const shortNames: Record<string, string> = {
    C: 'Country',
    ST: 'State/Province',
    L: 'Locality',
    O: 'Organization',
    OU: 'Organizational Unit',
    CN: 'Common Name',
    emailAddress: 'Email',
  };
  for (const rdn of rdnSet) {
    const key = shortNames[rdn.shortName ?? ''] ?? rdn.name ?? rdn.shortName ?? 'Unknown';
    result[key] = String(rdn.value);
  }
  return result;
}

function getAlgorithmName(oid: string): string {
  const map: Record<string, string> = {
    '1.2.840.113549.1.1.5': 'SHA1withRSA',
    '1.2.840.113549.1.1.11': 'SHA256withRSA',
    '1.2.840.113549.1.1.12': 'SHA384withRSA',
    '1.2.840.113549.1.1.13': 'SHA512withRSA',
    '1.2.840.10040.4.3': 'SHA1withDSA',
    '1.2.840.10045.4.3.2': 'SHA256withECDSA',
    '1.2.840.10045.4.3.3': 'SHA384withECDSA',
    '1.2.840.10045.4.3.4': 'SHA512withECDSA',
    '1.2.840.113549.1.1.1': 'RSA',
    '1.2.840.10045.2.1': 'EC',
  };
  return map[oid] ?? oid;
}

export function decodeCertificate(pem: string): CertificateInfo {
  const cleaned = pem.trim();
  const cert = forge.pki.certificateFromPem(cleaned);

  const subjectAltNames: string[] = [];
  const sanExt = cert.getExtension('subjectAltName') as
    | { altNames: { type: number; value: string; ip?: string }[] }
    | null;
  if (sanExt?.altNames) {
    for (const alt of sanExt.altNames) {
      if (alt.type === 2) {
        subjectAltNames.push(`DNS: ${alt.value}`);
      }
      else if (alt.type === 7) {
        subjectAltNames.push(`IP: ${alt.ip ?? alt.value}`);
      }
      else if (alt.type === 1) {
        subjectAltNames.push(`Email: ${alt.value}`);
      }
      else {
        subjectAltNames.push(alt.value);
      }
    }
  }

  const bcExt = cert.getExtension('basicConstraints') as { cA?: boolean } | null;
  const isCA = bcExt?.cA === true;

  const certDer = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();
  const sha1 = forge.md.sha1.create();
  sha1.update(certDer);
  const sha256 = forge.md.sha256.create();
  sha256.update(certDer);

  const formatFingerprint = (hex: string) => hex.match(/.{2}/g)?.join(':').toUpperCase() ?? hex;

  let publicKeyAlgorithm = 'RSA';
  let publicKeyBits = 0;
  try {
    const rsaKey = cert.publicKey as forge.pki.rsa.PublicKey;
    if (rsaKey.n) {
      publicKeyBits = rsaKey.n.bitLength();
      publicKeyAlgorithm = 'RSA';
    }
  }
  catch {
    publicKeyAlgorithm = 'EC';
  }

  const sigAlgOid = (cert as any).signatureOid as string | undefined;
  const signatureAlgorithm = sigAlgOid ? getAlgorithmName(sigAlgOid) : cert.siginfo?.algorithmOid ? getAlgorithmName(cert.siginfo.algorithmOid) : 'Unknown';

  return {
    subject: rdnToRecord(cert.subject.attributes),
    issuer: rdnToRecord(cert.issuer.attributes),
    serialNumber: cert.serialNumber,
    validFrom: cert.validity.notBefore.toUTCString(),
    validTo: cert.validity.notAfter.toUTCString(),
    signatureAlgorithm,
    publicKeyAlgorithm,
    publicKeyBits,
    subjectAltNames,
    fingerprint: {
      sha1: formatFingerprint(sha1.digest().toHex()),
      sha256: formatFingerprint(sha256.digest().toHex()),
    },
    isCA,
    version: cert.version + 1,
  };
}
