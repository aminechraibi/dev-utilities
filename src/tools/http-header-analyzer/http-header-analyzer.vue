<script setup lang="ts">
import { type ParsedHeader, parseHeaders } from './http-header-analyzer.service';

const EXAMPLE_HEADERS = `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache, no-store, must-revalidate
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
Access-Control-Allow-Origin: *
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
Server: nginx/1.24.0
Date: Sat, 17 May 2026 12:00:00 GMT`;

const rawHeaders = ref('');

const parsedHeaders = computed<ParsedHeader[]>(() =>
  rawHeaders.value.trim() ? parseHeaders(rawHeaders.value) : [],
);

const groupedHeaders = computed(() => {
  const groups: Record<string, ParsedHeader[]> = {};
  for (const header of parsedHeaders.value) {
    if (!groups[header.category]) {
      groups[header.category] = [];
    }
    groups[header.category].push(header);
  }
  return groups;
});

function loadExample() {
  rawHeaders.value = EXAMPLE_HEADERS;
}

const categoryColors: Record<string, string> = {
  Security: 'error',
  CORS: 'warning',
  Caching: 'info',
  Content: 'success',
  Authentication: 'error',
  Cookies: 'warning',
  Server: 'default',
  Connection: 'default',
  Request: 'default',
  Redirect: 'info',
  Other: 'default',
};
</script>

<template>
  <div flex flex-col gap-3>
    <c-card>
      <c-input-text
        v-model:value="rawHeaders"

        rows="10"
        label="Raw HTTP headers"
        placeholder="Paste your HTTP response headers here..."

        multiline raw-text autofocus font-mono
      />
      <div mt-3 flex justify-center>
        <c-button @click="loadExample">
          Load example
        </c-button>
      </div>
    </c-card>

    <template v-if="parsedHeaders.length > 0">
      <c-card v-for="(headers, category) in groupedHeaders" :key="category" :title="String(category)">
        <div flex flex-col gap-3>
          <div
            v-for="header in headers"
            :key="header.name"
            class="header-item"

            rounded p-3
          >
            <div mb-1 flex items-center gap-2>
              <span font-bold font-mono>{{ header.name }}</span>
              <n-tag :type="categoryColors[header.category] as any" size="small">
                {{ header.category }}
              </n-tag>
            </div>
            <div mb-1 text-sm font-mono op-80 style="word-break: break-all;">
              {{ header.value }}
            </div>
            <div text-sm op-60>
              {{ header.description }}
            </div>
          </div>
        </div>
      </c-card>
    </template>

    <c-alert v-else-if="!rawHeaders.trim()" type="info">
      Paste HTTP response headers above to analyze them. Click "Load example" to see a demo.
    </c-alert>

    <c-alert v-else type="warning">
      No headers could be parsed from the input.
    </c-alert>
  </div>
</template>

<style lang="less" scoped>
.header-item {
  border: 1px solid rgba(128, 128, 128, 0.2);
  background: rgba(128, 128, 128, 0.04);
}
</style>
