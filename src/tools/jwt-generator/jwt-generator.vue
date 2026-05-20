<script setup lang="ts">
import { type JwtAlgorithm, generateJwt } from './jwt-generator.service';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';

const DEFAULT_HEADER = JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2);
const DEFAULT_PAYLOAD = JSON.stringify(
  { sub: '1234567890', name: 'John Doe', iat: 1516239022 },
  null,
  2,
);

const header = ref(DEFAULT_HEADER);
const payload = ref(DEFAULT_PAYLOAD);
const secret = ref('your-256-bit-secret');
const algorithm = ref<JwtAlgorithm>('HS256');

const algorithmOptions = [
  { label: 'HS256', value: 'HS256' },
  { label: 'HS384', value: 'HS384' },
  { label: 'HS512', value: 'HS512' },
];

const jwt = computed(() =>
  withDefaultOnError(
    () =>
      generateJwt({
        header: header.value,
        payload: payload.value,
        secret: secret.value,
        algorithm: algorithm.value,
      }),
    '',
  ),
);

const headerError = computed(() => {
  try {
    JSON.parse(header.value);
    return '';
  }
  catch {
    return 'Invalid JSON in header';
  }
});

const payloadError = computed(() => {
  try {
    JSON.parse(payload.value);
    return '';
  }
  catch {
    return 'Invalid JSON in payload';
  }
});

const { copy } = useCopy({ source: jwt, text: 'JWT copied to clipboard' });
</script>

<template>
  <div flex flex-col gap-3>
    <c-card title="Algorithm">
      <c-select
        v-model:value="algorithm"
        :options="algorithmOptions"
        label="Signing algorithm"
      />
    </c-card>

    <c-card title="Header">
      <c-input-text
        v-model:value="header"
        multiline
        raw-text
        rows="4"
        label="Header JSON"
        font-mono
        :validation-message="headerError || undefined"
      />
    </c-card>

    <c-card title="Payload">
      <c-input-text
        v-model:value="payload"
        multiline
        raw-text
        rows="6"
        label="Payload JSON"
        font-mono
        :validation-message="payloadError || undefined"
      />
    </c-card>

    <c-card title="Secret">
      <c-input-text
        v-model:value="secret"
        label="HMAC secret"
        placeholder="your-secret-key"
      />
    </c-card>

    <c-card title="Generated JWT">
      <c-input-text
        :value="jwt"
        readonly
        multiline
        rows="5"
        label="Signed JWT"
        font-mono
        placeholder="JWT will appear here..."
      />
      <div mt-3 flex justify-center>
        <c-button :disabled="!jwt" @click="copy()">
          Copy JWT
        </c-button>
      </div>
    </c-card>
  </div>
</template>
