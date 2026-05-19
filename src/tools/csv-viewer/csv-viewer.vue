<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { parseCsv, detectDelimiter } from './csv-viewer.service';

const csvInput = useStorage('csv-viewer--input', 'Name,Age,City\nAlice,30,New York\nBob,25,London\nCharlie,35,Paris');
const hasHeader = useStorage('csv-viewer--has-header', true);
const delimiterChoice = useStorage<string>('csv-viewer--delimiter', 'auto');

const delimiterOptions = [
  { label: 'Auto-detect', value: 'auto' },
  { label: 'Comma (,)', value: ',' },
  { label: 'Semicolon (;)', value: ';' },
  { label: 'Tab (\\t)', value: '\t' },
  { label: 'Pipe (|)', value: '|' },
];

const resolvedDelimiter = computed(() => {
  if (delimiterChoice.value === 'auto') {
    return detectDelimiter(csvInput.value);
  }
  return delimiterChoice.value;
});

const parsed = computed(() => parseCsv(csvInput.value, resolvedDelimiter.value, hasHeader.value));

const columns = computed(() =>
  parsed.value.headers.map((header, index) => ({
    title: header || `Col ${index + 1}`,
    key: `col_${index}`,
    ellipsis: { tooltip: true },
    minWidth: 80,
  })),
);

const tableData = computed(() =>
  parsed.value.rows.map((row, rowIndex) => {
    const obj: Record<string, string> = { _key: String(rowIndex) };
    parsed.value.headers.forEach((_, colIndex) => {
      obj[`col_${colIndex}`] = row[colIndex] ?? '';
    });
    return obj;
  }),
);

const detectedDelimiterLabel = computed(() => {
  if (delimiterChoice.value !== 'auto') return null;
  const d = resolvedDelimiter.value;
  if (d === '\t') return 'Tab';
  if (d === ';') return 'Semicolon';
  if (d === '|') return 'Pipe';
  return 'Comma';
});
</script>

<template>
  <c-card title="CSV Input">
    <div flex gap-3 mb-3 style="flex-wrap: wrap; align-items: center">
      <div flex gap-2 items-center>
        <span text-sm op-70>Delimiter:</span>
        <c-select
          v-model:value="delimiterChoice"
          :options="delimiterOptions"
          style="min-width: 160px"
        />
        <n-tag v-if="detectedDelimiterLabel" size="small" type="info">
          Detected: {{ detectedDelimiterLabel }}
        </n-tag>
      </div>
      <div flex gap-2 items-center>
        <span text-sm op-70>Has header row:</span>
        <n-switch v-model:value="hasHeader" />
      </div>
    </div>

    <c-input-text
      v-model:value="csvInput"
      multiline
      :rows="8"
      placeholder="Paste your CSV data here..."
      font-mono
      raw-text
    />
  </c-card>

  <c-card v-if="csvInput.trim()">
    <div flex gap-3 mb-3 items-center>
      <n-tag type="info">
        {{ parsed.rows.length }} rows
      </n-tag>
      <n-tag type="info">
        {{ parsed.headers.length }} columns
      </n-tag>
    </div>

    <div v-if="parsed.headers.length > 0" style="overflow-x: auto">
      <n-data-table
        :columns="columns"
        :data="tableData"
        :row-key="row => row._key"
        :max-height="400"
        virtual-scroll
        size="small"
        striped
      />
    </div>
    <div v-else op-50 text-center py-4>
      No data to display
    </div>
  </c-card>
</template>
