<script setup lang="ts">
import { generateCode128Svg } from './barcode-generator.service';
import { useCopy } from '@/composable/copy';

const text = ref('Hello World 123');
const barWidth = ref(2);
const height = ref(80);
const showText = ref(true);
const error = ref('');

const svgOutput = computed(() => {
  try {
    error.value = '';
    return generateCode128Svg(text.value, { barWidth: barWidth.value, height: height.value, showText: showText.value });
  }
  catch (e) {
    error.value = (e as Error).message;
    return '';
  }
});

const { copy } = useCopy({ source: svgOutput, text: 'SVG copied to clipboard' });

function download() {
  const blob = new Blob([svgOutput.value], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'barcode.svg';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div flex flex-col gap-3>
    <c-input-text v-model:value="text" label="Text to encode" placeholder="Enter text..." autofocus />
    <c-alert v-if="error" type="error">
      {{ error }}
    </c-alert>
    <div flex flex-wrap items-center gap-4>
      <div flex flex-col gap-1>
        <label text-sm op-70>Bar width: {{ barWidth }}px</label>
        <n-slider v-model:value="barWidth" :min="1" :max="4" :step="1" style="width:120px" />
      </div>
      <div flex flex-col gap-1>
        <label text-sm op-70>Height: {{ height }}px</label>
        <n-slider v-model:value="height" :min="40" :max="150" style="width:120px" />
      </div>
      <div flex items-center gap-2>
        <n-checkbox v-model:checked="showText">
          Show text
        </n-checkbox>
      </div>
    </div>
    <div v-if="svgOutput" flex justify-center rounded-lg bg-white p-4 v-html="svgOutput" />
    <div flex justify-center gap-3>
      <c-button :disabled="!svgOutput" @click="copy()">
        Copy SVG
      </c-button>
      <c-button :disabled="!svgOutput" @click="download()">
        Download SVG
      </c-button>
    </div>
  </div>
</template>
