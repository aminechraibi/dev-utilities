<script setup lang="ts">
import { computed, ref } from 'vue';
import { type SqlDialect, jsonToSql } from './json-to-sql.service';
import { useCopy } from '@/composable/copy';

const sampleJson = `[
  {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "age": 30,
    "active": true,
    "score": 9.5,
    "created_at": "2024-01-15T10:00:00"
  },
  {
    "id": 2,
    "name": "Bob",
    "email": "bob@example.com",
    "age": 25,
    "active": false,
    "score": 7.2,
    "created_at": "2024-02-20T14:30:00"
  }
]`;

const jsonInput = ref(sampleJson);
const tableName = ref('my_table');
const dialect = ref<SqlDialect>('mysql');

const dialectOptions = [
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'mssql', label: 'MSSQL / SQL Server' },
];

const result = computed(() => {
  if (!jsonInput.value.trim()) {
    return '';
  }
  try {
    return jsonToSql(jsonInput.value, tableName.value || 'my_table', dialect.value);
  }
  catch (e) {
    return `-- Error: ${(e as Error).message}`;
  }
});

const { copy } = useCopy({ source: result, text: 'SQL copied to clipboard!' });
</script>

<template>
  <div>
    <c-card title="Input" mb-3>
      <div mb-3 flex gap-3>
        <c-input-text
          v-model:value="tableName"
          label="Table name"
          placeholder="my_table"
          style="flex: 1"
        />
        <c-select
          v-model:value="dialect"
          :options="dialectOptions"
          label="SQL dialect"
          style="flex: 1"
        />
      </div>
      <c-input-text
        v-model:value="jsonInput"
        multiline
        rows="10"
        placeholder="Paste your JSON array here..."
        label="JSON input (array of objects)"
        font-mono
      />
    </c-card>

    <c-card title="SQL Output">
      <c-input-text
        :value="result"
        multiline
        rows="15"
        readonly
        placeholder="SQL will appear here..."
        font-mono
      />
      <div mt-3 flex justify-end>
        <c-button :disabled="!result || result.startsWith('-- Error')" @click="copy()">
          Copy SQL
        </c-button>
      </div>
    </c-card>
  </div>
</template>
