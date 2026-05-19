<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useCopy } from '@/composable/copy';
import { csvToJson } from './csv-to-json.service';

const csvInput = useStorage('csv-to-json:input', 'name,age,city\nAlice,30,Paris\nBob,25,London\nCharlie,35,New York');
const delimiter = useStorage<string>('csv-to-json:delimiter', ',');
const hasHeader = useStorage('csv-to-json:hasHeader', true);

const delimiterOptions = [
  { label: 'Comma (,)', value: ',' },
  { label: 'Semicolon (;)', value: ';' },
  { label: 'Tab (\\t)', value: '\t' },
  { label: 'Pipe (|)', value: '|' },
];

const jsonOutput = computed(() => {
  try {
    return csvToJson(csvInput.value, delimiter.value, hasHeader.value);
  }
  catch {
    return '';
  }
});

const { copy } = useCopy({ source: jsonOutput, text: 'JSON copied to clipboard' });
</script>

<template>
  <div flex flex-col gap-3>
    <c-card title="CSV Input">
      <div flex gap-3 mb-3 flex-wrap items-center>
        <div flex items-center gap-2>
          <span text-sm op-70>Delimiter:</span>
          <c-select
            v-model:value="delimiter"
            :options="delimiterOptions"
            w-40
          />
        </div>
        <n-checkbox v-model:checked="hasHeader">
          First row as header
        </n-checkbox>
      </div>
      <c-input-text
        v-model:value="csvInput"
        multiline
        :rows="10"
        placeholder="Paste your CSV data here..."
        font-mono
        raw-text
      />
    </c-card>

    <c-card title="JSON Output">
      <c-input-text
        :value="jsonOutput"
        multiline
        :rows="12"
        readonly
        font-mono
        raw-text
        placeholder="JSON output will appear here..."
      />
      <div flex justify-center mt-3>
        <c-button :disabled="!jsonOutput" @click="copy()">
          Copy JSON
        </c-button>
      </div>
    </c-card>
  </div>
</template>
