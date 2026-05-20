<script setup lang="ts">
import { ref } from 'vue';

const file = ref<File | null>(null);
const targetW = ref(800);
const targetH = ref(600);
const keepAspect = ref(true);
const fillColor = ref('#ffffff');
const outputFormat = ref<'png' | 'jpeg' | 'webp'>('png');
const quality = ref(92);

const originalW = ref(0);
const originalH = ref(0);
const preview = ref('');
const processing = ref(false);

const formatOptions = [
  { label: 'PNG', value: 'png' },
  { label: 'JPEG', value: 'jpeg' },
  { label: 'WebP', value: 'webp' },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function render() {
  if (!file.value) {
    return;
  }
  processing.value = true;
  const url = URL.createObjectURL(file.value);
  try {
    const img = await loadImage(url);
    originalW.value = img.naturalWidth;
    originalH.value = img.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = targetW.value;
    canvas.height = targetH.value;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = fillColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let dw = targetW.value;
    let dh = targetH.value;
    let dx = 0;
    let dy = 0;

    if (keepAspect.value) {
      const srcR = img.naturalWidth / img.naturalHeight;
      const tgtR = targetW.value / targetH.value;
      if (srcR > tgtR) {
        dh = targetW.value / srcR;
        dy = (targetH.value - dh) / 2;
      }
      else {
        dw = targetH.value * srcR;
        dx = (targetW.value - dw) / 2;
      }
    }

    ctx.drawImage(img, dx, dy, dw, dh);
    const q = outputFormat.value === 'png' ? undefined : quality.value / 100;
    preview.value = canvas.toDataURL(`image/${outputFormat.value}`, q);
  }
  finally {
    URL.revokeObjectURL(url);
    processing.value = false;
  }
}

function onFiles(f: File) {
  if (!f) {
    return;
  }
  file.value = f;
  const img = new Image();
  const url = URL.createObjectURL(f);
  img.onload = () => {
    originalW.value = img.naturalWidth;
    originalH.value = img.naturalHeight;
    URL.revokeObjectURL(url);
    render();
  };
  img.src = url;
}

function download() {
  if (!preview.value) {
    return;
  }
  const a = document.createElement('a');
  const name = file.value?.name.replace(/\.[^.]+$/, '') ?? 'resized';
  a.download = `${name}-${targetW.value}x${targetH.value}.${outputFormat.value === 'jpeg' ? 'jpg' : outputFormat.value}`;
  a.href = preview.value;
  a.click();
}
</script>

<template>
  <div class="ir-root">
    <div flex gap-3>
      <!-- Left: controls -->
      <c-card style="flex: 0 0 280px; align-self: flex-start;">
        <div mb-3>
          <c-file-upload accept="image/*" @file-upload="onFiles" />
          <div v-if="originalW" mt-2 text-xs op-50>
            Original: {{ originalW }} × {{ originalH }}px
          </div>
        </div>

        <n-divider style="margin: 12px 0" />

        <div class="field-row" mb-2>
          <label class="field-label">Width (px)</label>
          <n-input-number v-model:value="targetW" :min="1" :max="8000" w-full />
        </div>

        <div class="field-row" mb-2>
          <label class="field-label">Height (px)</label>
          <n-input-number v-model:value="targetH" :min="1" :max="8000" w-full />
        </div>

        <div mb-3 flex items-center gap-2>
          <n-switch v-model:value="keepAspect" size="small" />
          <span text-sm>Fit image (letterbox)</span>
        </div>

        <div class="field-row" mb-2>
          <label class="field-label">Fill color</label>
          <div flex items-center gap-2>
            <input v-model="fillColor" type="color" class="color-picker" :disabled="!keepAspect" :style="!keepAspect ? 'opacity:0.3;pointer-events:none' : ''">
            <span text-xs font-mono op-60>{{ fillColor }}</span>
            <span v-if="!keepAspect" text-xs op-30>(no letterbox)</span>
          </div>
        </div>

        <div class="field-row" mb-2>
          <label class="field-label">Format</label>
          <c-select v-model:value="outputFormat" :options="formatOptions" w-full />
        </div>

        <div v-if="outputFormat !== 'png'" class="field-row" mb-3>
          <label class="field-label">Quality ({{ quality }}%)</label>
          <n-slider v-model:value="quality" :min="10" :max="100" :step="1" />
        </div>

        <div mt-2 flex gap-2>
          <c-button :disabled="!file" flex-1 @click="render">
            Resize
          </c-button>
          <c-button :disabled="!preview" flex-1 @click="download">
            Download
          </c-button>
        </div>
      </c-card>

      <!-- Right: preview -->
      <c-card style="flex: 1 1 0; min-width: 0; align-self: flex-start;">
        <div v-if="processing" flex items-center justify-center p-8>
          <n-spin size="medium" />
        </div>
        <div v-else-if="preview" class="preview-wrap">
          <div mb-2 text-xs op-50>
            Output: {{ targetW }} × {{ targetH }}px &nbsp;·&nbsp; {{ outputFormat.toUpperCase() }}
          </div>
          <img :src="preview" class="preview-img" alt="Preview">
        </div>
        <div v-else flex items-center justify-center p-8 text-sm op-30>
          Upload an image to preview
        </div>
      </c-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ir-root {
  flex: 1 1 100%;
  max-width: 100%;
}

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.5;
  margin-bottom: 4px;
}

.color-picker {
  width: 32px;
  height: 28px;
  padding: 2px;
  border: 1px solid rgba(128, 128, 128, 0.25);
  border-radius: 4px;
  background: none;
  cursor: pointer;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.preview-wrap {
  width: 100%;
  overflow: auto;
}

.preview-img {
  max-width: 100%;
  display: block;
  border-radius: 4px;
  border: 1px solid rgba(128, 128, 128, 0.12);
}
</style>
