<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCopy } from '@/composable/copy';
import type { BodyType, HttpMethod, KV } from './http-request-builder.service';
import { buildUrl, toAxios, toCurl, toFetch, toGo, toPhpCurl, toPython } from './http-request-builder.service';

const method = ref<HttpMethod>('GET');
const url = ref('https://api.example.com/users');
const params = ref<KV[]>([{ key: '', value: '', enabled: true }]);
const headers = ref<KV[]>([{ key: 'Accept', value: 'application/json', enabled: true }]);
const bodyType = ref<BodyType>('none');
const bodyJson = ref('{\n  "name": "John",\n  "email": "john@example.com"\n}');
const bodyText = ref('');
const bodyForm = ref<KV[]>([{ key: '', value: '', enabled: true }]);

const codeTab = ref<'curl' | 'fetch' | 'axios' | 'python' | 'php' | 'go'>('curl');
const activeSection = ref<'params' | 'headers' | 'body'>('params');

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const methodColors: Record<string, string> = {
  GET: '#16a34a', POST: '#2563eb', PUT: '#ca8a04',
  PATCH: '#9333ea', DELETE: '#dc2626', HEAD: '#0891b2', OPTIONS: '#6b7280',
};

const codeTabs = [
  { label: 'cURL', value: 'curl' },
  { label: 'fetch', value: 'fetch' },
  { label: 'axios', value: 'axios' },
  { label: 'Python', value: 'python' },
  { label: 'PHP cURL', value: 'php' },
  { label: 'Go', value: 'go' },
];

const bodyTypes = [
  { label: 'None', value: 'none' },
  { label: 'JSON', value: 'json' },
  { label: 'Form', value: 'form' },
  { label: 'Text', value: 'text' },
];

function addRow(list: KV[]) { list.push({ key: '', value: '', enabled: true }); }
function removeRow(list: KV[], i: number) { if (list.length > 1) list.splice(i, 1); }

const cfg = computed(() => ({
  method: method.value,
  url: url.value,
  params: params.value,
  headers: headers.value,
  bodyType: bodyType.value,
  bodyJson: bodyJson.value,
  bodyText: bodyText.value,
  bodyForm: bodyForm.value,
}));

const resolvedUrl = computed(() => buildUrl(url.value, params.value));

const code = computed(() => {
  const c = cfg.value;
  if (codeTab.value === 'curl') return toCurl(c);
  if (codeTab.value === 'fetch') return toFetch(c);
  if (codeTab.value === 'axios') return toAxios(c);
  if (codeTab.value === 'python') return toPython(c);
  if (codeTab.value === 'php') return toPhpCurl(c);
  return toGo(c);
});

const activeParamCount = computed(() => params.value.filter(p => p.enabled && p.key.trim()).length);
const activeHeaderCount = computed(() => headers.value.filter(h => h.enabled && h.key.trim()).length);

const { copy, isJustCopied } = useCopy({ source: code, text: 'Copied!' });
</script>

<template>
  <div class="hrb-root">
    <div class="hrb-layout">
      <!-- Left: request builder -->
      <div class="hrb-left">
        <!-- Method + URL -->
        <c-card mb-3>
          <div flex gap-2 items-center>
            <div class="method-select">
              <button
                v-for="m in methods"
                :key="m"
                class="method-btn"
                :class="{ active: method === m }"
                :style="method === m ? `color: ${methodColors[m]}; border-color: ${methodColors[m]}` : ''"
                @click="method = m"
              >
                {{ m }}
              </button>
            </div>
          </div>
          <div mt-2>
            <c-input-text v-model:value="url" font-mono placeholder="https://api.example.com/endpoint" raw-text />
          </div>
          <div v-if="resolvedUrl !== url" mt-1 text-xs font-mono op-40 style="word-break:break-all">
            → {{ resolvedUrl }}
          </div>
        </c-card>

        <!-- Tabs: Params / Headers / Body -->
        <c-card>
          <div flex gap-1 mb-3>
            <button
              v-for="sec in (['params', 'headers', 'body'] as const)"
              :key="sec"
              class="sec-tab"
              :class="{ active: activeSection === sec }"
              @click="activeSection = sec"
            >
              {{ sec.charAt(0).toUpperCase() + sec.slice(1) }}
              <span v-if="sec === 'params' && activeParamCount" class="badge">{{ activeParamCount }}</span>
              <span v-if="sec === 'headers' && activeHeaderCount" class="badge">{{ activeHeaderCount }}</span>
              <span v-if="sec === 'body' && bodyType !== 'none'" class="badge">·</span>
            </button>
          </div>

          <!-- Params -->
          <div v-if="activeSection === 'params'">
            <div v-for="(row, i) in params" :key="i" flex gap-2 items-center mb-2>
              <n-switch v-model:value="row.enabled" size="small" />
              <c-input-text v-model:value="row.key" placeholder="Key" raw-text style="flex:1" />
              <c-input-text v-model:value="row.value" placeholder="Value" raw-text style="flex:1" />
              <button class="del-btn" @click="removeRow(params, i)">
                ×
              </button>
            </div>
            <c-button size="small" @click="addRow(params)">
              + Add
            </c-button>
          </div>

          <!-- Headers -->
          <div v-if="activeSection === 'headers'">
            <div v-for="(row, i) in headers" :key="i" flex gap-2 items-center mb-2>
              <n-switch v-model:value="row.enabled" size="small" />
              <c-input-text v-model:value="row.key" placeholder="Header name" raw-text style="flex:1" />
              <c-input-text v-model:value="row.value" placeholder="Value" raw-text style="flex:1" />
              <button class="del-btn" @click="removeRow(headers, i)">
                ×
              </button>
            </div>
            <c-button size="small" @click="addRow(headers)">
              + Add
            </c-button>
          </div>

          <!-- Body -->
          <div v-if="activeSection === 'body'">
            <div flex gap-2 mb-3>
              <button
                v-for="bt in bodyTypes"
                :key="bt.value"
                class="body-type-btn"
                :class="{ active: bodyType === bt.value }"
                @click="bodyType = bt.value as BodyType"
              >
                {{ bt.label }}
              </button>
            </div>

            <div v-if="bodyType === 'json'">
              <c-input-text v-model:value="bodyJson" multiline :rows="8" font-mono raw-text placeholder="{}" />
            </div>
            <div v-else-if="bodyType === 'text'">
              <c-input-text v-model:value="bodyText" multiline :rows="8" font-mono raw-text placeholder="Plain text body" />
            </div>
            <div v-else-if="bodyType === 'form'">
              <div v-for="(row, i) in bodyForm" :key="i" flex gap-2 items-center mb-2>
                <n-switch v-model:value="row.enabled" size="small" />
                <c-input-text v-model:value="row.key" placeholder="Key" raw-text style="flex:1" />
                <c-input-text v-model:value="row.value" placeholder="Value" raw-text style="flex:1" />
                <button class="del-btn" @click="removeRow(bodyForm, i)">
                  ×
                </button>
              </div>
              <c-button size="small" @click="addRow(bodyForm)">
                + Add
              </c-button>
            </div>
            <div v-else op-40 text-sm>
              No body
            </div>
          </div>
        </c-card>
      </div>

      <!-- Right: generated code -->
      <div class="hrb-right">
        <c-card style="height: 100%">
          <div flex gap-2 flex-wrap mb-3>
            <button
              v-for="t in codeTabs"
              :key="t.value"
              class="code-tab"
              :class="{ active: codeTab === t.value }"
              @click="codeTab = t.value as any"
            >
              {{ t.label }}
            </button>
          </div>

          <c-input-text
            :value="code"
            multiline
            :rows="24"
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
  </div>
</template>

<style lang="less" scoped>
.hrb-root {
  flex: 1 1 100%;
  max-width: 100%;
}

.hrb-layout {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.hrb-left {
  flex: 0 0 420px;
  min-width: 0;
}

.hrb-right {
  flex: 1 1 0;
  min-width: 0;
}

.method-select {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.method-btn {
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  font-family: monospace;
  border: 1px solid rgba(128, 128, 128, 0.25);
  background: rgba(128, 128, 128, 0.05);
  color: inherit;
  cursor: pointer;
  transition: all 0.1s;
  outline: none;

  &.active {
    background: rgba(59, 130, 246, 0.08);
  }

  &:hover { opacity: 0.8; }
}

.sec-tab {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid transparent;
  background: rgba(128, 128, 128, 0.06);
  color: inherit;
  cursor: pointer;
  transition: all 0.12s;
  outline: none;
  display: flex;
  align-items: center;
  gap: 5px;

  &.active {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.4);
    color: #3b82f6;
  }
}

.badge {
  font-size: 10px;
  background: #3b82f6;
  color: #fff;
  border-radius: 10px;
  padding: 0 5px;
  font-weight: 700;
}

.code-tab {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(128, 128, 128, 0.25);
  background: rgba(128, 128, 128, 0.06);
  color: inherit;
  cursor: pointer;
  transition: all 0.12s;
  outline: none;

  &.active {
    background: rgba(59, 130, 246, 0.12);
    border-color: #3b82f6;
    color: #3b82f6;
    font-weight: 600;
  }
}

.body-type-btn {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(128, 128, 128, 0.25);
  background: rgba(128, 128, 128, 0.06);
  color: inherit;
  cursor: pointer;
  transition: all 0.12s;
  outline: none;

  &.active {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.5);
    color: #3b82f6;
  }
}

.del-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
  padding: 0;

  &:hover { background: rgba(239, 68, 68, 0.2); }
}
</style>
