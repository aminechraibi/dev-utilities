<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { generateCode128Svg } from './barcode-generator.service';

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
    <div flex gap-4 flex-wrap items-center>
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
    <div v-if="svgOutput" flex justify-center p-4 bg-white rounded-lg v-html="svgOutput" />
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
