<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { rgbToHex, rgbToHsl } from './image-color-picker.service';
import { useCopy } from '@/composable/copy';
import CloseIcon from '~icons/mdi/close';
import ImageIcon from '~icons/mdi/image-outline';

interface PickedColor { hex: string; r: number; g: number; b: number }

const canvasRef = ref<HTMLCanvasElement | null>(null);
const magnifierRef = ref<HTMLCanvasElement | null>(null);
const imageLoaded = ref(false);
const hoveredColor = ref<PickedColor | null>(null);
const pickedColors = ref<PickedColor[]>([]);
const selectedHistory = ref<PickedColor | null>(null);
const fileName = ref('');
const magnifierHasData = ref(false);

const MAG_SIZE = 150;
const MAG_ZOOM = 6;

const { copy } = useCopy({ createToast: true });

function colorFormats(c: PickedColor) {
  const { h, s, l } = rgbToHsl(c.r, c.g, c.b);
  return [
    { label: 'HEX', value: c.hex },
    { label: 'RGB', value: `rgb(${c.r}, ${c.g}, ${c.b})` },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: 'RGBA', value: `rgba(${c.r}, ${c.g}, ${c.b}, 1)` },
    { label: 'CSS', value: `color: ${c.hex};` },
  ];
}

function reset() {
  imageLoaded.value = false;
  hoveredColor.value = null;
  pickedColors.value = [];
  selectedHistory.value = null;
  magnifierHasData.value = false;
  fileName.value = '';
}

function onFileUpload(file: File) {
  fileName.value = file.name;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = async () => {
      pickedColors.value = [];
      hoveredColor.value = null;
      selectedHistory.value = null;
      magnifierHasData.value = false;
      imageLoaded.value = true;
      await nextTick();
      const canvas = canvasRef.value!;
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
    };
    img.src = ev.target!.result as string;
  };
  reader.readAsDataURL(file);
}

function getCanvasCoords(e: MouseEvent) {
  const canvas = canvasRef.value!;
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor((e.clientX - rect.left) * (canvas.width / rect.width)),
    y: Math.floor((e.clientY - rect.top) * (canvas.height / rect.height)),
  };
}

function getPixelColor(x: number, y: number): PickedColor | null {
  const canvas = canvasRef.value;
  if (!canvas) {
    return null;
  }
  const d = canvas.getContext('2d')!.getImageData(x, y, 1, 1).data;
  return { r: d[0], g: d[1], b: d[2], hex: rgbToHex(d[0], d[1], d[2]) };
}

function drawMagnifier(x: number, y: number) {
  const mag = magnifierRef.value;
  const canvas = canvasRef.value;
  if (!mag || !canvas) {
    return;
  }
  const srcSize = Math.floor(MAG_SIZE / MAG_ZOOM);
  const sx = Math.max(0, x - Math.floor(srcSize / 2));
  const sy = Math.max(0, y - Math.floor(srcSize / 2));
  const src = canvas.getContext('2d')!.getImageData(sx, sy, srcSize, srcSize);
  const tmp = document.createElement('canvas');
  tmp.width = srcSize;
  tmp.height = srcSize;
  tmp.getContext('2d')!.putImageData(src, 0, 0);
  const ctx = mag.getContext('2d')!;
  ctx.clearRect(0, 0, MAG_SIZE, MAG_SIZE);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, 0, 0, srcSize, srcSize, 0, 0, MAG_SIZE, MAG_SIZE);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(MAG_SIZE / 2, 0);
  ctx.lineTo(MAG_SIZE / 2, MAG_SIZE);
  ctx.moveTo(0, MAG_SIZE / 2);
  ctx.lineTo(MAG_SIZE, MAG_SIZE / 2);
  ctx.stroke();
  magnifierHasData.value = true;
}

function onMouseMove(e: MouseEvent) {
  if (!imageLoaded.value) {
    return;
  }
  const { x, y } = getCanvasCoords(e);
  hoveredColor.value = getPixelColor(x, y);
  drawMagnifier(x, y);
}

function onMouseLeave() {
  hoveredColor.value = null;
}

function onCanvasClick(e: MouseEvent) {
  if (!imageLoaded.value) {
    return;
  }
  const { x, y } = getCanvasCoords(e);
  const color = getPixelColor(x, y);
  if (color) {
    pickedColors.value = [color, ...pickedColors.value.filter(c => c.hex !== color.hex)].slice(0, 20);
    selectedHistory.value = color;
  }
}

const displayColor = computed(() => hoveredColor.value ?? selectedHistory.value);
</script>

<template>
  <!-- negative margin to escape the tool layout's padding and use full width -->
  <div class="picker-root">
    <!-- No image -->
    <div v-if="!imageLoaded" class="upload-wrapper">
      <c-file-upload accept="image/*" style="padding:10px 20px" @file-upload="onFileUpload">
        Drop an image here or click to browse
      </c-file-upload>
    </div>

    <!-- Has image -->
    <template v-else>
      <!-- Top bar -->
      <div class="image-bar">
        <ImageIcon class="bar-icon" />
        <span class="image-name" :title="fileName">{{ fileName }}</span>
        <span class="bar-hint">Hover to inspect · Click to pick color</span>
        <button class="reset-btn" title="Load a different image" @click="reset">
          <CloseIcon />
        </button>
      </div>

      <!-- Picked colors strip — above canvas, always visible -->
      <div class="history-strip">
        <span class="history-strip-label">Picked</span>
        <div v-if="pickedColors.length" class="history-strip-swatches">
          <div
            v-for="color in pickedColors"
            :key="color.hex"
            class="history-swatch"
            :class="{ active: selectedHistory?.hex === color.hex && !hoveredColor }"
            :style="{ background: color.hex }"
            :title="color.hex"
            @click="selectedHistory = color"
          />
        </div>
        <span v-else class="history-strip-empty">Click on the image to save colors here</span>
      </div>

      <!-- Two-column layout — controls-col is FIXED width, canvas-col fills rest -->
      <div class="picker-layout">
        <!-- Left: canvas -->
        <div class="canvas-col">
          <canvas
            ref="canvasRef"
            class="image-canvas"
            @mousemove="onMouseMove"
            @mouseleave="onMouseLeave"
            @click="onCanvasClick"
          />
        </div>

        <!-- Right: controls — fixed 230px, no reflow -->
        <div class="controls-col">
          <!-- Magnifier — always rendered, stable height -->
          <div class="panel-card mag-card">
            <div class="mag-ring">
              <canvas ref="magnifierRef" :width="MAG_SIZE" :height="MAG_SIZE" class="mag-canvas" />
              <div v-show="!magnifierHasData" class="mag-empty">
                Move cursor<br>over image
              </div>
            </div>
            <div class="mag-zoom-label">
              ×{{ MAG_ZOOM }} zoom
            </div>
          </div>

          <!-- Color panel — always rendered, fixed min-height prevents reflow -->
          <div class="panel-card color-panel">
            <template v-if="displayColor">
              <div class="color-header">
                <div class="color-swatch" :style="{ background: displayColor.hex }" />
                <div>
                  <div class="color-hex">
                    {{ displayColor.hex }}
                  </div>
                  <div class="color-sub">
                    {{ hoveredColor ? 'Hover — click to save' : 'From history' }}
                  </div>
                </div>
              </div>
              <div class="fmt-list">
                <div v-for="fmt in colorFormats(displayColor)" :key="fmt.label" class="fmt-row">
                  <span class="fmt-label">{{ fmt.label }}</span>
                  <code class="fmt-value">{{ fmt.value }}</code>
                  <span class="fmt-copy" @click="copy(fmt.value)">Copy</span>
                </div>
              </div>
            </template>
            <div v-else class="no-color-msg">
              Hover over the image<br>to inspect pixel colors
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
/* Break out of the tool layout's max-width */
.picker-root {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upload-wrapper {
  max-width: 600px;
}

/* Bar */
.image-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  background: rgba(128, 128, 128, 0.05);
}

.bar-icon { font-size: 16px; opacity: 0.45; flex-shrink: 0; }

.image-name {
  font-size: 13px;
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
}

.bar-hint {
  flex: 1;
  font-size: 11px;
  opacity: 0.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reset-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.4;
  font-size: 20px;
  line-height: 1;
  padding: 2px;
  display: flex;
  align-items: center;
  color: inherit;
  flex-shrink: 0;
  border-radius: 50%;
  transition: opacity 0.15s;
  &:hover { opacity: 1; }
}

/* Layout */
.picker-layout {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
}

/* Canvas column — flexible, fills remaining space */
.canvas-col {
  flex: 1 1 0;
  min-width: 0;
  /* Fixed width so hover doesn't cause reflow */
  width: 0; /* flex will stretch it */
}

.image-canvas {
  width: 100%;
  height: auto;
  display: block;
  cursor: crosshair;
  border-radius: 6px;
}

/* Controls column — hard-fixed width, never recalculates */
.controls-col {
  flex: 0 0 230px;
  width: 230px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Panel cards */
.panel-card {
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.18);
  padding: 12px;
  background: rgba(128, 128, 128, 0.03);
}

/* Magnifier */
.mag-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  /* Fixed height = ring + label + padding */
  min-height: 190px;
  justify-content: center;
}

.mag-ring {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(128, 128, 128, 0.25);
  flex-shrink: 0;
}

.mag-canvas { display: block; width: 150px; height: 150px; }

.mag-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  opacity: 0.35;
  text-align: center;
  line-height: 1.5;
  pointer-events: none;
}

.mag-zoom-label { font-size: 11px; opacity: 0.3; }

/* Color panel — min-height prevents reflow when content switches */
.color-panel {
  min-height: 190px;
}

.color-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.color-swatch {
  width: 44px;
  height: 44px;
  border-radius: 7px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  flex-shrink: 0;
}

.color-hex { font-weight: 700; font-size: 14px; }
.color-sub { font-size: 10px; opacity: 0.4; margin-top: 2px; }

.no-color-msg {
  height: 100%;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0.3;
  font-size: 12px;
  line-height: 1.7;
}

.fmt-list { display: flex; flex-direction: column; }

.fmt-row {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 0;
  border-bottom: 1px solid rgba(128, 128, 128, 0.1);
  &:last-child { border-bottom: none; }
}

.fmt-label {
  font-size: 9px;
  font-weight: 800;
  opacity: 0.4;
  width: 30px;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fmt-value {
  flex: 1;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fmt-copy {
  font-size: 9px;
  opacity: 0.4;
  cursor: pointer;
  padding: 1px 5px;
  border: 1px solid currentColor;
  border-radius: 3px;
  flex-shrink: 0;
  user-select: none;
  transition: opacity 0.1s;
  &:hover { opacity: 1; }
}

/* History strip — horizontal row above canvas */
.history-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.15);
  background: rgba(128, 128, 128, 0.03);
  min-height: 44px;
  flex-wrap: wrap;
}

.history-strip-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.35;
  flex-shrink: 0;
}

.history-strip-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  flex: 1;
}

.history-strip-empty {
  font-size: 11px;
  opacity: 0.3;
}

.history-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.1s;
  flex-shrink: 0;

  &:hover { transform: scale(1.12); }

  &.active {
    border-color: rgba(255, 255, 255, 0.85);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  }
}
</style>
