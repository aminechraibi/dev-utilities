<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useCopy } from '@/composable/copy';
import { evaluateJsonPath } from './json-path-tester.service';

const mounted = ref(false);
onMounted(() => { mounted.value = true; });
onBeforeUnmount(() => { mounted.value = false; });

const defaultJson = `{
  "store": {
    "book": [
      { "title": "Sayings of the Century", "price": 8.95, "category": "reference" },
      { "title": "Sword of Honour", "price": 12.99, "category": "fiction" },
      { "title": "Moby Dick", "price": 8.99, "category": "fiction" },
      { "title": "The Lord of the Rings", "price": 22.99, "category": "fiction" }
    ],
    "bicycle": { "color": "red", "price": 19.95 }
  }
}`;

const jsonInput = useStorage('json-path-tester:json', defaultJson);
const pathInput = useStorage('json-path-tester:path', '$.store.book[0].title');

const examples = [
  { label: 'First book title', path: '$.store.book[0].title' },
  { label: 'All book prices', path: '$.store.book[*].price' },
  { label: 'All prices (recursive)', path: '$..price' },
  { label: 'Bicycle color', path: '$.store.bicycle.color' },
];

const result = computed(() => {
  if (!jsonInput.value.trim() || !pathInput.value.trim()) {
    return { results: null, error: null };
  }
  try {
    const results = evaluateJsonPath(jsonInput.value, pathInput.value);
    return { results, error: null };
  }
  catch (e) {
    return { results: null, error: (e instanceof Error) ? e.message : String(e) };
  }
});

const resultStr = computed(() => {
  if (!result.value.results) return '';
  return JSON.stringify(result.value.results, null, 2);
});

const { copy, isJustCopied } = useCopy({ source: resultStr, text: 'Results copied to clipboard' });
</script>

<template>
  <div v-if="mounted" flex flex-col gap-3>
    <c-card title="JSON input">
      <c-input-text
        v-model:value="jsonInput"
        label="JSON data:"
        placeholder="Paste your JSON here..."
        multiline
        rows="10"
        font-mono
      />
    </c-card>

    <c-card title="JSONPath expression">
      <c-input-text
        v-model:value="pathInput"
        label="JSONPath:"
        placeholder="$.store.book[*].title"
        font-mono
        mb-3
      />
      <div flex gap-2 flex-wrap items-center>
        <span text-sm op-60>Examples:</span>
        <c-button
          v-for="ex in examples"
          :key="ex.label"
          size="small"
          @click="pathInput = ex.path"
        >
          {{ ex.label }}
        </c-button>
      </div>
    </c-card>

    <c-alert v-if="result.error" type="error">
      {{ result.error }}
    </c-alert>

    <c-card v-if="result.results !== null" title="Results">
      <div flex justify-between items-center mb-3>
        <span text-sm op-70>{{ result.results.length }} result{{ result.results.length !== 1 ? 's' : '' }} found</span>
        <c-button size="small" @click="copy()">
          {{ isJustCopied ? 'Copied!' : 'Copy' }}
        </c-button>
      </div>
      <c-alert v-if="result.results.length === 0" type="warning">
        No results matched the given path.
      </c-alert>
      <div v-else flex flex-col gap-2>
        <div
          v-for="(item, idx) in result.results"
          :key="idx"
          flex gap-2
        >
          <span font-mono text-xs op-50 pt-1 style="min-width:2rem;text-align:right;">[{{ idx }}]</span>
          <pre font-mono text-sm p-2 rounded w-full style="background:var(--n-code-color,#f5f5f5);overflow-x:auto;margin:0;">{{ JSON.stringify(item, null, 2) }}</pre>
        </div>
      </div>
    </c-card>
  </div>
</template>
