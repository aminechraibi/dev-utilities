<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCopy } from '@/composable/copy';
import { dataTypes, generateFakeDataMulti } from './fake-data-generator.service';

const selectedTypes = ref<string[]>([dataTypes[0]!]);
const count = ref(10);
const format = ref<'table' | 'plain' | 'json' | 'csv'>('table');
const refreshKey = ref(0);

const formatOptions = [
  { label: 'Table', value: 'table' },
  { label: 'Plain (columns)', value: 'plain' },
  { label: 'JSON array', value: 'json' },
  { label: 'CSV', value: 'csv' },
];

function toggleType(type: string) {
  const idx = selectedTypes.value.indexOf(type);
  if (idx === -1) {
    selectedTypes.value = [...selectedTypes.value, type];
  }
  else if (selectedTypes.value.length > 1) {
    selectedTypes.value = selectedTypes.value.filter(t => t !== type);
  }
}

const rows = computed(() => {
  // eslint-disable-next-line no-unused-expressions
  refreshKey.value;
  if (selectedTypes.value.length === 0) return [];
  return generateFakeDataMulti(selectedTypes.value, count.value);
});

const textOutput = computed(() => {
  if (rows.value.length === 0) return '';
  const types = selectedTypes.value;

  if (format.value === 'json') {
    return JSON.stringify(rows.value, null, 2);
  }

  if (format.value === 'csv') {
    const header = types.map(t => `"${t}"`).join(',');
    const dataRows = rows.value.map(row =>
      types.map(t => `"${(row[t] ?? '').replace(/"/g, '""')}"`).join(','),
    );
    return [header, ...dataRows].join('\n');
  }

  if (format.value === 'plain') {
    const dataRows = rows.value.map(row => types.map(t => row[t] ?? '').join('\t'));
    if (types.length > 1) {
      const header = types.join('\t');
      const divider = types.map(t => '-'.repeat(t.length)).join('\t');
      return [header, divider, ...dataRows].join('\n');
    }
    return dataRows.join('\n');
  }

  return '';
});

const htmlTableOutput = computed(() => {
  if (rows.value.length === 0) return '';
  const types = selectedTypes.value;
  const thead = `<thead><tr>${types.map(t => `<th>${t}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.value.map(row =>
    `<tr>${types.map(t => `<td>${row[t] ?? ''}</td>`).join('')}</tr>`,
  ).join('')}</tbody>`;
  return `<table>\n${thead}\n${tbody}\n</table>`;
});

const copySource = computed(() => format.value === 'table' ? htmlTableOutput.value : textOutput.value);
const { copy } = useCopy({ source: copySource, text: 'Data copied to clipboard' });
</script>

<template>
  <c-card>
    <div mb-1 text-sm font-semibold op-70>
      Data types <span op-40 font-normal ml-1>(click to toggle)</span>
    </div>
    <div flex flex-wrap gap-2 mb-4>
      <button
        v-for="type in dataTypes"
        :key="type"
        class="type-chip"
        :class="{ active: selectedTypes.includes(type) }"
        @click="toggleType(type)"
      >
        {{ type }}
      </button>
    </div>

    <div flex gap-3 flex-wrap items-end mb-4>
      <div>
        <div text-sm op-70 mb-1>
          Count
        </div>
        <n-input-number v-model:value="count" :min="1" :max="1000" w-28 />
      </div>
      <c-select v-model:value="format" :options="formatOptions" label="Format" w-40 />
      <c-button @click="refreshKey++">
        Regenerate
      </c-button>
    </div>

    <!-- Table view -->
    <div v-if="format === 'table'" class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="type in selectedTypes" :key="type">
              {{ type }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td v-for="type in selectedTypes" :key="type">
              {{ row[type] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Text view (Plain / JSON / CSV) -->
    <template v-else>
      <c-input-text :value="textOutput" multiline :rows="15" label="Output" readonly font-mono raw-text />
    </template>

    <div flex justify-center mt-3>
      <c-button :disabled="rows.length === 0" @click="copy()">
        Copy
      </c-button>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.type-chip {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(128, 128, 128, 0.25);
  background: rgba(128, 128, 128, 0.06);
  color: inherit;
  cursor: pointer;
  transition: all 0.12s;
  outline: none;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &.active {
    background: rgba(59, 130, 246, 0.12);
    border-color: #3b82f6;
    color: #3b82f6;
    font-weight: 600;
  }
}

.table-wrap {
  overflow-x: auto;
  width: 100%;
  border-radius: 6px;
  border: 1px solid rgba(128, 128, 128, 0.15);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  white-space: nowrap;

  th {
    text-align: left;
    padding: 7px 14px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    opacity: 0.5;
    border-bottom: 2px solid rgba(128, 128, 128, 0.15);
    background: rgba(128, 128, 128, 0.04);
  }

  td {
    padding: 7px 14px;
    font-family: monospace;
    border-bottom: 1px solid rgba(128, 128, 128, 0.07);
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: rgba(128, 128, 128, 0.04);
  }
}
</style>
