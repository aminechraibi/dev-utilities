<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCopy } from '@/composable/copy';
import { parseCurl, toAxios, toFetch, toNodeFetch, toPython } from './curl-converter.service';

const input = ref(`curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer my-token" \\
  -d '{"name": "John", "email": "john@example.com"}'`);

const tab = ref<'fetch' | 'axios' | 'python' | 'node'>('fetch');

const tabs = [
  { label: 'fetch', value: 'fetch' },
  { label: 'axios', value: 'axios' },
  { label: 'Python requests', value: 'python' },
  { label: 'Node fetch', value: 'node' },
];

const parsed = computed(() => {
  try { return parseCurl(input.value); }
  catch { return null; }
});

const output = computed(() => {
  if (!parsed.value) return '// Could not parse cURL command';
  if (tab.value === 'fetch') return toFetch(parsed.value);
  if (tab.value === 'axios') return toAxios(parsed.value);
  if (tab.value === 'python') return toPython(parsed.value);
  return toNodeFetch(parsed.value);
});

const lang = computed(() => tab.value === 'python' ? 'python' : 'javascript');

const { copy, isJustCopied } = useCopy({ source: output, text: 'Copied!' });
</script>

<template>
  <div class="cc-root">
    <div flex gap-3 flex-col>
      <c-card title="cURL command">
        <c-input-text
          v-model:value="input"
          multiline
          :rows="6"
          font-mono
          raw-text
          placeholder="Paste your curl command here..."
        />
      </c-card>

      <c-card>
        <div flex gap-2 flex-wrap mb-3>
          <button
            v-for="t in tabs"
            :key="t.value"
            class="lang-tab"
            :class="{ active: tab === t.value }"
            @click="tab = t.value as any"
          >
            {{ t.label }}
          </button>
        </div>

        <div v-if="parsed" class="meta-row" mb-3>
          <span class="method-badge" :class="`method-${parsed.method.toLowerCase()}`">{{ parsed.method }}</span>
          <span class="url-text">{{ parsed.url }}</span>
        </div>

        <c-input-text
          :value="output"
          multiline
          :rows="14"
          font-mono
          readonly
          raw-text
        />

        <div flex justify-end mt-2>
          <c-button @click="copy()">
            {{ isJustCopied ? 'Copied!' : 'Copy' }}
          </c-button>
        </div>
      </c-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.cc-root {
  flex: 1 1 100%;
  max-width: 100%;
}

.lang-tab {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(128, 128, 128, 0.25);
  background: rgba(128, 128, 128, 0.06);
  color: inherit;
  cursor: pointer;
  transition: all 0.12s;
  outline: none;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
  &.active { background: rgba(59,130,246,0.12); border-color: #3b82f6; color: #3b82f6; font-weight: 600; }
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.method-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  font-family: monospace;
  flex-shrink: 0;

  &.method-get    { background: rgba(34,197,94,0.15);  color: #16a34a; }
  &.method-post   { background: rgba(59,130,246,0.15); color: #2563eb; }
  &.method-put    { background: rgba(234,179,8,0.15);  color: #ca8a04; }
  &.method-patch  { background: rgba(168,85,247,0.15); color: #9333ea; }
  &.method-delete { background: rgba(239,68,68,0.15);  color: #dc2626; }
}

.url-text {
  font-family: monospace;
  font-size: 12px;
  opacity: 0.7;
  word-break: break-all;
}
</style>
