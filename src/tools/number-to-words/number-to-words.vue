<script setup lang="ts">
import { numberToOrdinal, numberToWords } from './number-to-words.service';
import { useCopy } from '@/composable/copy';

const inputValue = ref<number | null>(42);
const showOrdinal = ref(false);

const wordsOutput = computed(() => {
  if (inputValue.value === null || inputValue.value === undefined) {
    return '';
  }
  return numberToWords(inputValue.value);
});

const ordinalOutput = computed(() => {
  if (inputValue.value === null || inputValue.value === undefined) {
    return '';
  }
  return numberToOrdinal(inputValue.value);
});

const { copy: copyWords } = useCopy({ source: wordsOutput, text: 'Words copied to clipboard' });
const { copy: copyOrdinal } = useCopy({ source: ordinalOutput, text: 'Ordinal copied to clipboard' });
</script>

<template>
  <div flex flex-col gap-3>
    <c-card>
      <div mb-3 flex items-center gap-3>
        <n-input-number
          v-model:value="inputValue"
          style="flex: 1"
          placeholder="Enter a number..."
          :show-button="false"
          autofocus
        />
      </div>

      <c-input-text
        :value="wordsOutput"
        readonly
        label="In words"
        placeholder="Words will appear here..."
        mb-3
      />
      <div mb-4 flex justify-center>
        <c-button :disabled="!wordsOutput" @click="copyWords()">
          Copy words
        </c-button>
      </div>

      <div mb-3 flex items-center gap-2>
        <n-switch v-model:value="showOrdinal" />
        <span>Show ordinal form</span>
      </div>

      <template v-if="showOrdinal">
        <c-input-text
          :value="ordinalOutput"
          readonly
          label="Ordinal form"
          placeholder="Ordinal will appear here..."
          mb-3
        />
        <div flex justify-center>
          <c-button :disabled="!ordinalOutput || ordinalOutput === 'not applicable'" @click="copyOrdinal()">
            Copy ordinal
          </c-button>
        </div>
      </template>
    </c-card>
  </div>
</template>
