<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { formatCss, minifyCss } from './css-formatter.service';

const inputCss = ref(`body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

h1,
h2 {
  color: #333;
  font-size: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}`);

const mode = ref<'format' | 'minify'>('format');

const outputCss = computed(() => {
  if (mode.value === 'format') {
    return formatCss(inputCss.value);
  }
  return minifyCss(inputCss.value);
});

const inputLength = computed(() => inputCss.value.length);
const outputLength = computed(() => outputCss.value.length);
const diff = computed(() => outputLength.value - inputLength.value);
const diffLabel = computed(() => {
  if (inputLength.value === 0) return '0';
  if (diff.value === 0) return 'No change';
  const sign = diff.value > 0 ? '+' : '';
  const pct = ((Math.abs(diff.value) / inputLength.value) * 100).toFixed(1);
  return `${sign}${diff.value} chars (${diff.value < 0 ? '-' : '+'}${pct}%)`;
});

const { copy } = useCopy({ source: outputCss, text: 'CSS copied to clipboard' });
</script>

<template>
  <div class="css-root">
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <div flex gap-4 items-center>
        <span text-sm font-medium>Mode:</span>
        <n-radio-group v-model:value="mode">
          <n-space>
            <n-radio value="format">
              Format (Beautify)
            </n-radio>
            <n-radio value="minify">
              Minify
            </n-radio>
          </n-space>
        </n-radio-group>
      </div>
      <div style="display:flex;gap:24px;margin-left:auto">
        <div text-center>
          <div text-sm op-60>Input</div>
          <div font-mono>{{ inputLength }} chars</div>
        </div>
        <div text-center>
          <div text-sm op-60>Output</div>
          <div font-mono>{{ outputLength }} chars</div>
        </div>
        <div text-center>
          <div text-sm op-60>Difference</div>
          <div font-mono>{{ diffLabel }}</div>
        </div>
      </div>
    </div>

    <div class="editors-row">
      <c-card title="CSS Input" class="editor-card">
        <c-input-text
          v-model:value="inputCss"
          placeholder="Paste your CSS here..."
          multiline
          :rows="20"
          font-mono
          raw-text
        />
      </c-card>

      <c-card :title="mode === 'format' ? 'Formatted CSS' : 'Minified CSS'" class="editor-card">
        <c-input-text
          :value="outputCss"
          placeholder="Output will appear here..."
          multiline
          :rows="20"
          font-mono
          readonly
          raw-text
        />
        <div flex justify-end mt-2>
          <c-button size="small" @click="copy()">
            Copy
          </c-button>
        </div>
      </c-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.css-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 1 1 100%;
  max-width: 100%;
}

.editors-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
}

.editor-card {
  flex: 1 1 0;
  min-width: 0;
}
</style>
