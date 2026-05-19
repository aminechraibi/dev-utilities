<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { withDefaultOnError } from '@/utils/defaults';
import { encodeBase32, decodeBase32, encodeBase32Hex, decodeBase32Hex } from './base32-encoder.service';

type Variant = 'standard' | 'hex';
const variant = ref<Variant>('standard');
const variantOptions = [
  { label: 'Standard (RFC 4648)', value: 'standard' },
  { label: 'Base32 Hex', value: 'hex' },
];

// Encode panel
const encodeInput = ref('Hello, World!');
const encodeOutput = computed(() =>
  withDefaultOnError(() => {
    if (!encodeInput.value) {
      return '';
    }
    return variant.value === 'hex' ? encodeBase32Hex(encodeInput.value) : encodeBase32(encodeInput.value);
  }, 'Error encoding'),
);

// Decode panel
const decodeInput = ref('');
const decodeOutput = computed(() =>
  withDefaultOnError(() => {
    if (!decodeInput.value.trim()) {
      return '';
    }
    return variant.value === 'hex' ? decodeBase32Hex(decodeInput.value) : decodeBase32(decodeInput.value);
  }, 'Error: invalid Base32 input'),
);

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: 'Encoded value copied to clipboard' });
const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: 'Decoded value copied to clipboard' });

function swapToDecoder() {
  decodeInput.value = encodeOutput.value;
}
</script>

<template>
  <div flex flex-col gap-3>
    <div flex justify-center>
      <c-buttons-select
        v-model:value="variant"
        :options="variantOptions"
      />
    </div>

    <c-card title="Encode — Text to Base32">
      <c-input-text
        v-model:value="encodeInput"
        multiline
        label="Plain text input"
        placeholder="Type text to encode..."
        autofocus
        raw-text
        mb-3
      />
      <c-input-text
        :value="encodeOutput"
        multiline
        readonly
        label="Base32 encoded"
        placeholder="Base32 output..."
        mb-3
        font-mono
      />
      <div flex justify-center gap-3>
        <c-button :disabled="!encodeOutput || encodeOutput === 'Error encoding'" @click="copyEncoded()">
          Copy encoded
        </c-button>
        <c-button :disabled="!encodeOutput || encodeOutput === 'Error encoding'" secondary @click="swapToDecoder()">
          Use as decode input
        </c-button>
      </div>
    </c-card>

    <c-card title="Decode — Base32 to Text">
      <c-input-text
        v-model:value="decodeInput"
        multiline
        label="Base32 input"
        placeholder="Paste Base32 to decode..."
        raw-text
        mb-3
        font-mono
      />
      <c-input-text
        :value="decodeOutput"
        multiline
        readonly
        label="Decoded text"
        placeholder="Decoded output..."
        mb-3
      />
      <div flex justify-center>
        <c-button :disabled="!decodeOutput || decodeOutput.startsWith('Error')" @click="copyDecoded()">
          Copy decoded
        </c-button>
      </div>
    </c-card>
  </div>
</template>
