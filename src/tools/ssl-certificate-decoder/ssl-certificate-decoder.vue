<script setup lang="ts">
import { type CertificateInfo, decodeCertificate } from './ssl-certificate-decoder.service';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';

const pemInput = ref('');

const certInfo = computed<CertificateInfo | null>(() =>
  withDefaultOnError(() => (pemInput.value.trim() ? decodeCertificate(pemInput.value) : null), null),
);

const validation = useValidation({
  source: pemInput,
  rules: [
    {
      validator: (value) => {
        if (!value.trim()) {
          return true;
        }
        try {
          decodeCertificate(value);
          return true;
        }
        catch {
          return false;
        }
      },
      message: 'Invalid PEM certificate',
    },
  ],
});
</script>

<template>
  <div flex flex-col gap-3>
    <c-card>
      <c-input-text
        v-model:value="pemInput"

        rows="8"
        label="PEM Certificate"
        :validation="validation"
        placeholder="Paste your PEM certificate here (-----BEGIN CERTIFICATE----- ...)"

        multiline raw-text autofocus font-mono
      />
    </c-card>

    <template v-if="certInfo">
      <c-card title="Subject">
        <c-key-value-list
          :items="Object.entries(certInfo.subject).map(([label, value]) => ({ label, value }))"
        />
      </c-card>

      <c-card title="Issuer">
        <c-key-value-list
          :items="Object.entries(certInfo.issuer).map(([label, value]) => ({ label, value }))"
        />
      </c-card>

      <c-card title="Validity">
        <c-key-value-list
          :items="[
            { label: 'Not Before', value: certInfo.validFrom },
            { label: 'Not After', value: certInfo.validTo },
          ]"
        />
      </c-card>

      <c-card title="Certificate Details">
        <c-key-value-list
          :items="[
            { label: 'Version', value: String(certInfo.version) },
            { label: 'Serial Number', value: certInfo.serialNumber },
            { label: 'Signature Algorithm', value: certInfo.signatureAlgorithm },
            { label: 'Public Key', value: certInfo.publicKeyBits ? `${certInfo.publicKeyAlgorithm} ${certInfo.publicKeyBits}-bit` : certInfo.publicKeyAlgorithm },
            { label: 'CA Certificate', value: certInfo.isCA ? 'Yes' : 'No' },
          ]"
        />
      </c-card>

      <c-card v-if="certInfo.subjectAltNames.length > 0" title="Subject Alternative Names">
        <c-key-value-list
          :items="certInfo.subjectAltNames.map((san, i) => ({ label: `SAN ${i + 1}`, value: san }))"
        />
      </c-card>

      <c-card title="Fingerprints">
        <c-key-value-list
          :items="[
            { label: 'SHA-1', value: certInfo.fingerprint.sha1, showCopyButton: true },
            { label: 'SHA-256', value: certInfo.fingerprint.sha256, showCopyButton: true },
          ]"
        />
      </c-card>
    </template>
  </div>
</template>
