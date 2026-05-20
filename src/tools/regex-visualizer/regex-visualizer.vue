<script setup lang="ts">
import type { ShadowRootExpose } from 'vue-shadow-dom';
import { render } from '@regexper/render';
import { isValidRegex, tokenizeRegex } from './regex-visualizer.service';

const regexInput = ref('([a-z]+)\\d{2,4}@[\\w.-]+\\.[a-z]{2,}');
const error = ref('');

const isValid = computed(() => isValidRegex(regexInput.value));

const tokens = computed(() => {
  if (!isValid.value || !regexInput.value) {
    return [];
  }
  return tokenizeRegex(regexInput.value);
});

const tokenColors: Record<string, string> = {
  literal: '#4a9eff',
  charClass: '#f0a500',
  group: '#7c4dff',
  anchor: '#e91e63',
  alternation: '#ff5722',
  dot: '#00bcd4',
  escape: '#4caf50',
};

const visualizerSVG = ref<ShadowRootExpose>();

const examples = [
  { label: 'Email', value: '([a-z]+)\\d{2,4}@[\\w.-]+\\.[a-z]{2,}' },
  { label: 'URL', value: 'https?:\\/\\/([\\w-]+\\.)+[\\w]{2,}(\\/[\\w.\\/]*)?' },
  { label: 'Date (YYYY-MM-DD)', value: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])' },
  { label: 'IPv4', value: '(?:\\d{1,3}\\.){3}\\d{1,3}' },
];

watchEffect(async () => {
  const pattern = regexInput.value;
  error.value = '';
  const visualizer = visualizerSVG.value?.shadow_root;
  if (!visualizer) {
    return;
  }

  while (visualizer.lastChild) {
    visualizer.removeChild(visualizer.lastChild);
  }

  if (!pattern) {
    return;
  }

  if (!isValidRegex(pattern)) {
    error.value = 'Invalid regular expression';
    return;
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  try {
    await render(pattern, svg);
    visualizer.appendChild(svg);
  }
  catch (e) {
    error.value = `Could not render diagram: ${e instanceof Error ? e.message : String(e)}`;
  }
});
</script>

<template>
  <div class="rv-root">
    <c-card title="Regular expression">
      <c-input-text
        v-model:value="regexInput"
        label="Enter a regex pattern:"
        placeholder="e.g. ([a-z]+)\d{2,4}"

        mb-3 font-mono
      />
      <div flex flex-wrap gap-2>
        <span self-center text-sm op-60>Examples:</span>
        <c-button
          v-for="ex in examples"
          :key="ex.label"
          size="small"
          @click="regexInput = ex.value"
        >
          {{ ex.label }}
        </c-button>
      </div>
    </c-card>

    <c-alert v-if="error" type="error">
      {{ error }}
    </c-alert>

    <c-card v-if="regexInput && isValid" title="Railroad diagram">
      <div style="overflow-x:auto;width:100%">
        <shadow-root ref="visualizerSVG">
          &nbsp;
        </shadow-root>
      </div>
    </c-card>

    <c-card v-if="tokens.length > 0" title="Token breakdown">
      <div flex flex-wrap gap-2>
        <div
          v-for="(token, idx) in tokens"
          :key="idx"
          flex flex-col items-center gap-1
          style="min-width:60px;"
        >
          <div
            rounded px-2 py-1 text-sm font-mono
            :style="`background:${tokenColors[token.type] ?? '#888'}22;border:1px solid ${tokenColors[token.type] ?? '#888'};color:${tokenColors[token.type] ?? '#888'}`"
          >
            {{ token.value }}
          </div>
          <span text-center text-xs op-60>{{ token.label }}</span>
        </div>
      </div>
      <div mt-3 flex flex-wrap gap-3 pt-3 style="border-top:1px solid #8882;">
        <div v-for="(color, type) in tokenColors" :key="type" flex items-center gap-1>
          <div :style="`width:12px;height:12px;border-radius:3px;background:${color}`" />
          <span text-xs capitalize op-70>{{ type }}</span>
        </div>
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.rv-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 1 1 100%;
  max-width: 100%;
}
</style>
