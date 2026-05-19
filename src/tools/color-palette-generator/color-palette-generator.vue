<script setup lang="ts">
import { ref, computed } from 'vue';
import { useClipboard } from '@vueuse/core';
import { generatePalettes, hexToHsl, hexToRgb, hexToHsb, hexToCmyk } from './color-palette-generator.service';

type CopyFormat = 'hex' | 'rgb' | 'hsl' | 'hsb' | 'cmyk';

const seedColor = ref('#3b82f6');
const copyFormat = ref<CopyFormat>('hex');
const { copy } = useClipboard();
const copiedKey = ref('');

const palettes = computed(() => generatePalettes(seedColor.value));

const paletteList = computed(() => [
  { name: 'Monochromatic', desc: '9-step lightness scale', colors: palettes.value.monochromatic, cols: 3 },
  { name: 'Complementary', desc: 'Opposite hues — dark, base, light variants', colors: palettes.value.complementary, cols: 3 },
  { name: 'Triadic', desc: '3 equidistant hues with tints', colors: palettes.value.triadic, cols: 3 },
  { name: 'Analogous', desc: '6 neighboring hues', colors: palettes.value.analogous, cols: 3 },
  { name: 'Split-Complementary', desc: '2 near-complements with tints', colors: palettes.value.splitComplementary, cols: 3 },
  { name: 'Tetradic', desc: '4 hues at 90° intervals', colors: palettes.value.tetradic, cols: 4 },
]);

const formatOptions: { label: string; value: CopyFormat }[] = [
  { label: 'HEX', value: 'hex' },
  { label: 'RGB', value: 'rgb' },
  { label: 'HSL', value: 'hsl' },
  { label: 'HSB', value: 'hsb' },
  { label: 'CMYK', value: 'cmyk' },
];

function getColorValue(hex: string): string {
  switch (copyFormat.value) {
    case 'rgb': return hexToRgb(hex);
    case 'hsl': return hexToHsl(hex);
    case 'hsb': return hexToHsb(hex);
    case 'cmyk': return hexToCmyk(hex);
    default: return hex;
  }
}

async function copyColor(hex: string) {
  const val = getColorValue(hex);
  await copy(val);
  copiedKey.value = `${hex}-${copyFormat.value}`;
  setTimeout(() => { copiedKey.value = ''; }, 1400);
}

function isCopied(hex: string) {
  return copiedKey.value === `${hex}-${copyFormat.value}`;
}

function textColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#000000cc' : '#ffffffcc';
}
</script>

<template>
  <div class="pg-root">
    <!-- Controls -->
    <div class="controls-bar">
      <!-- Color input -->
      <div class="control-group">
        <div class="control-label">Seed Color</div>
        <div flex gap-2 items-center>
          <input
            v-model="seedColor"
            type="color"
            class="color-native"
          >
          <c-input-text
            v-model:value="seedColor"
            placeholder="#3b82f6"
            style="width:130px"
            font-mono
          />
          <span class="hsl-display">{{ hexToHsl(seedColor) }}</span>
        </div>
      </div>

      <!-- Format radio -->
      <div class="control-group">
        <div class="control-label">Copy Format</div>
        <div class="format-radios">
          <label
            v-for="opt in formatOptions"
            :key="opt.value"
            class="format-radio"
            :class="{ active: copyFormat === opt.value }"
          >
            <input v-model="copyFormat" type="radio" :value="opt.value" style="display:none">
            {{ opt.label }}
          </label>
        </div>
      </div>
    </div>

    <!-- Palettes outer grid -->
    <div class="palettes-outer-grid">
      <div v-for="palette in paletteList" :key="palette.name" class="palette-card">
        <div class="palette-header">
          <span class="palette-name">{{ palette.name }}</span>
          <span class="palette-desc">{{ palette.desc }}</span>
        </div>
        <div
          class="palette-grid"
          :style="{ gridTemplateColumns: `repeat(${palette.cols}, 1fr)` }"
        >
          <div
            v-for="color in palette.colors"
            :key="color"
            class="swatch"
            @click="copyColor(color)"
          >
            <div class="swatch-block" :style="{ backgroundColor: color }">
              <div class="swatch-overlay" :style="{ color: textColor(color) }">
                <span v-if="isCopied(color)" class="copied-badge">✓</span>
                <span v-else class="copy-hint">+</span>
              </div>
            </div>
            <div class="swatch-footer">
              <code class="swatch-val" :title="getColorValue(color)">{{ getColorValue(color) }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pg-root {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Controls bar */
.controls-bar {
  display: flex;
  gap: 24px;
  align-items: flex-end;
  flex-wrap: wrap;
  padding: 16px 20px;
  border-radius: 10px;
  border: 1px solid rgba(128, 128, 128, 0.18);
  background: rgba(128, 128, 128, 0.04);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.4;
}

.color-native {
  width: 44px;
  height: 36px;
  border: none;
  padding: 2px;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid rgba(128, 128, 128, 0.2);
}

.hsl-display {
  font-family: monospace;
  font-size: 12px;
  opacity: 0.45;
}

/* Format radio buttons */
.format-radios {
  display: flex;
  gap: 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, 0.25);
}

.format-radio {
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  border-right: 1px solid rgba(128, 128, 128, 0.2);
  opacity: 0.5;
  transition: opacity 0.12s, background 0.12s;

  &:last-child { border-right: none; }

  &:hover { opacity: 0.8; }

  &.active {
    opacity: 1;
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }
}

/* Outer palette grid — 3 palette cards per row */
.palettes-outer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
}

/* Palette card */
.palette-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(128, 128, 128, 0.15);
  background: rgba(128, 128, 128, 0.03);
}

.palette-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.palette-name {
  font-size: 13px;
  font-weight: 700;
}

.palette-desc {
  font-size: 10px;
  opacity: 0.35;
}

/* Inner color grid */
.palette-grid {
  display: grid;
  gap: 4px;
  width: 100%;
}

/* Swatch */
.swatch {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, 0.12);
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    .copy-hint { opacity: 1; }
  }
}

.swatch-block {
  height: 52px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swatch-overlay {
  font-size: 16px;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.copy-hint {
  opacity: 0;
  transition: opacity 0.12s;
}

.copied-badge { opacity: 1; }

.swatch-footer {
  padding: 4px 6px;
  background: rgba(128, 128, 128, 0.05);
  border-top: 1px solid rgba(128, 128, 128, 0.1);
}

.swatch-val {
  font-size: 9px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.6;
  display: block;
  width: 100%;
}
</style>
