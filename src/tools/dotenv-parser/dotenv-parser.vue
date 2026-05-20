<script setup lang="ts">
import { entriesToJson, entriesToShellExports, findDuplicateKeys, parseDotenv } from './dotenv-parser.service';
import { useCopy } from '@/composable/copy';

const envInput = ref(`# App configuration
APP_NAME="My Application"
APP_PORT=3000
DEBUG=true

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER="admin"
DB_PASSWORD='s3cr3t'

# Feature flags
ENABLE_CACHE=false
MAX_CONNECTIONS=100

# Empty value
OPTIONAL_KEY=

# Duplicate example
DB_HOST=production-server.example.com`);

const entries = computed(() => parseDotenv(envInput.value));
const duplicates = computed(() => findDuplicateKeys(entries.value));

const exportFormat = ref<'json' | 'shell'>('json');

const exportOutput = computed(() => {
  if (exportFormat.value === 'json') {
    return entriesToJson(entries.value);
  }
  return entriesToShellExports(entries.value);
});

const { copy: copyExport } = useCopy({ source: exportOutput, text: 'Exported content copied to clipboard' });

const typeTagType: Record<string, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
  string: 'default',
  number: 'info',
  boolean: 'success',
  empty: 'warning',
};

const _columns = computed(() => [
  {
    title: 'Line',
    key: 'line',
    width: 70,
    render: (row: ReturnType<typeof entries.value>[0]) => row.line,
  },
  {
    title: 'Key',
    key: 'key',
  },
  {
    title: 'Value',
    key: 'value',
  },
  {
    title: 'Type',
    key: 'type',
  },
]);

const tableData = computed(() =>
  entries.value.map(e => ({
    ...e,
    isDuplicate: duplicates.value.has(e.key),
  })),
);
</script>

<template>
  <c-card title=".env Input">
    <c-input-text
      v-model:value="envInput"

      :rows="12"
      placeholder="Paste your .env file content here..."

      multiline raw-text font-mono
    />
  </c-card>

  <c-card v-if="envInput.trim()">
    <div mb-3 flex items-center gap-3 style="flex-wrap: wrap">
      <n-tag type="info">
        {{ entries.length }} variables
      </n-tag>
      <n-tag v-if="duplicates.size > 0" type="warning">
        {{ duplicates.size }} duplicate key{{ duplicates.size > 1 ? 's' : '' }}
      </n-tag>
      <n-tag type="default">
        {{ entries.filter(e => e.type === 'string').length }} strings
      </n-tag>
      <n-tag type="info">
        {{ entries.filter(e => e.type === 'number').length }} numbers
      </n-tag>
      <n-tag type="success">
        {{ entries.filter(e => e.type === 'boolean').length }} booleans
      </n-tag>
    </div>

    <div v-if="entries.length > 0" style="overflow-x: auto">
      <n-table size="small" striped>
        <thead>
          <tr>
            <th style="width: 60px">
              Line
            </th>
            <th>Key</th>
            <th>Value</th>
            <th style="width: 90px">
              Type
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in tableData"
            :key="`${entry.line}-${entry.key}`"
            :style="entry.isDuplicate ? 'background: rgba(250,170,0,0.08)' : ''"
          >
            <td style="opacity: 0.5; font-size: 12px; font-family: monospace">
              {{ entry.line }}
            </td>
            <td>
              <span font-mono>{{ entry.key }}</span>
              <n-tag v-if="entry.isDuplicate" size="tiny" type="warning" ml-2>
                duplicate
              </n-tag>
            </td>
            <td>
              <span font-mono style="word-break: break-all">{{ entry.value || '—' }}</span>
            </td>
            <td>
              <n-tag :type="typeTagType[entry.type]" size="small">
                {{ entry.type }}
              </n-tag>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
    <div v-else py-3 text-center op-50>
      No variables found
    </div>
  </c-card>

  <c-card v-if="entries.length > 0" title="Export">
    <div mb-3 flex items-center gap-3>
      <span text-sm op-70>Format:</span>
      <n-radio-group v-model:value="exportFormat">
        <n-radio value="json">
          JSON
        </n-radio>
        <n-radio value="shell">
          Shell exports
        </n-radio>
      </n-radio-group>
    </div>

    <c-input-text
      :value="exportOutput"

      :rows="8"

      multiline readonly raw-text font-mono
    />

    <div mt-3 flex justify-center>
      <c-button @click="copyExport()">
        Copy
      </c-button>
    </div>
  </c-card>
</template>
