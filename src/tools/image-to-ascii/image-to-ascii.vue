<script setup lang="ts">
import { imageDataToAscii } from './image-to-ascii.service';
import { useCopy } from '@/composable/copy';

const asciiOutput = ref('');
const width = ref(80);
const invert = ref(false);
const hasImage = ref(false);
const errorMsg = ref('');

let currentImageEl: HTMLImageElement | null = null;

function renderAscii() {
  if (!currentImageEl) {
    return;
  }
  const img = currentImageEl;
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.drawImage(img, 0, 0);
  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    asciiOutput.value = imageDataToAscii(imageData, width.value, invert.value);
  }
  catch {
    errorMsg.value = 'Could not read image pixels (cross-origin restriction).';
  }
}

watch([width, invert], () => {
  if (hasImage.value) {
    renderAscii();
  }
});

function onFileUpload(file: File) {
  if (!file) {
    return;
  }
  errorMsg.value = '';
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target?.result as string;
    const img = new Image();
    img.onload = () => {
      currentImageEl = img;
      hasImage.value = true;
      renderAscii();
    };
    img.onerror = () => {
      errorMsg.value = 'Failed to load image.';
    };
    img.src = src;
  };
  reader.readAsDataURL(file);
}

const { copy } = useCopy({ source: asciiOutput, text: 'ASCII art copied to clipboard!' });
</script>

<template>
  <c-card>
    <div flex flex-col gap-4>
      <c-file-upload
        accept="image/*"
        style="padding:10px 20px"
        @file-upload="onFileUpload"
      >
        Drop image here or <strong>click to browse</strong>
      </c-file-upload>

      <c-alert v-if="errorMsg" type="error">
        {{ errorMsg }}
      </c-alert>

      <div flex flex-wrap items-end gap-4>
        <div min-w-200px flex-1>
          <n-form-item :label="`Width (columns): ${width}`" label-placement="top" :show-feedback="false">
            <n-slider v-model:value="width" :min="40" :max="200" :step="1" />
          </n-form-item>
        </div>

        <n-form-item label="Invert:" label-placement="left" :show-feedback="false">
          <n-switch v-model:value="invert" />
        </n-form-item>
      </div>

      <div v-if="hasImage && asciiOutput">
        <div mb-2 font-medium>
          ASCII Art Output
        </div>
        <div
          style="background:#1a1a1a;color:#e0e0e0;border-radius:8px;overflow:auto;max-height:500px;padding:12px;"
        >
          <pre style="font-family:monospace;font-size:8px;line-height:1.1;white-space:pre;margin:0;">{{ asciiOutput }}</pre>
        </div>

        <div mt-3 flex justify-center>
          <c-button @click="copy()">
            Copy ASCII art
          </c-button>
        </div>
      </div>
    </div>
  </c-card>
</template>
