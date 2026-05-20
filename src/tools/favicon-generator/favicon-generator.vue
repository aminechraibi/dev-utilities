<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { renderFaviconToCanvas } from './favicon-generator.service';

const faviconText = ref('IT');
const bgColor = ref('#4a90d9');
const textColor = ref('#ffffff');

const sizes = [16, 32, 64, 128];
const canvasRefs = ref<HTMLCanvasElement[]>([]);

function setCanvasRef(el: HTMLCanvasElement | null, idx: number) {
  if (el) {
    canvasRefs.value[idx] = el;
  }
}

function renderAll() {
  for (let i = 0; i < sizes.length; i++) {
    const canvas = canvasRefs.value[i];
    if (!canvas) {
      continue;
    }
    renderFaviconToCanvas(canvas, {
      text: faviconText.value,
      bgColor: bgColor.value,
      textColor: textColor.value,
      size: sizes[i],
    });
  }
}

watch([faviconText, bgColor, textColor], () => {
  renderAll();
});

onMounted(() => {
  renderAll();
});

function downloadPng(size: number) {
  const idx = sizes.indexOf(size);
  const canvas = canvasRefs.value[idx];
  if (!canvas) {
    return;
  }
  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function downloadAllSizes() {
  for (const size of sizes) {
    downloadPng(size);
  }
}
</script>

<template>
  <div>
    <c-card mb-3>
      <n-form label-placement="left" label-width="140">
        <n-form-item label="Text / Emoji">
          <c-input-text
            v-model:value="faviconText"
            placeholder="1–4 characters or emoji"
            style="max-width:200px"
          />
        </n-form-item>
        <n-form-item label="Background color">
          <n-color-picker v-model:value="bgColor" :modes="['hex']" style="max-width:200px" />
        </n-form-item>
        <n-form-item label="Text color">
          <n-color-picker v-model:value="textColor" :modes="['hex']" style="max-width:200px" />
        </n-form-item>
      </n-form>
    </c-card>

    <c-card mb-3>
      <div mb-3 flex items-center justify-between>
        <div font-bold>
          Preview
        </div>
        <c-button @click="downloadAllSizes">
          Download all sizes
        </c-button>
      </div>

      <div flex flex-wrap items-end gap-4>
        <div
          v-for="(size, idx) in sizes"
          :key="size"
          flex flex-col items-center gap-2
        >
          <canvas
            :ref="(el) => setCanvasRef(el as HTMLCanvasElement, idx)"
            style="border:1px solid #e0e0e0;border-radius:4px;image-rendering:pixelated"
            :style="{ width: `${Math.max(size, 64)}px`, height: `${Math.max(size, 64)}px` }"
          />
          <div style="font-size:12px;opacity:0.7">
            {{ size }}×{{ size }}
          </div>
          <c-button @click="downloadPng(size)">
            Download
          </c-button>
        </div>
      </div>
    </c-card>

    <c-alert type="info">
      Enter 1–4 characters or an emoji. The text auto-fits to each size. Download individual sizes or all at once.
    </c-alert>
  </div>
</template>
