<script setup lang="ts">
import { getContrastRatio, getWcagLevel, isValidHex } from './color-contrast-checker.service';

const fg = ref('#000000');
const bg = ref('#ffffff');

const ratio = computed(() => {
  if (!isValidHex(fg.value) || !isValidHex(bg.value)) {
    return null;
  }
  return getContrastRatio(fg.value, bg.value);
});

const levels = computed(() => ratio.value === null
  ? null
  : ({
      normalAA: getWcagLevel(ratio.value, false) !== 'FAIL',
      normalAAA: getWcagLevel(ratio.value, false) === 'AAA',
      largeAA: getWcagLevel(ratio.value, true) !== 'FAIL',
      largeAAA: getWcagLevel(ratio.value, true) === 'AAA',
    }));
</script>

<template>
  <div flex flex-col gap-4>
    <c-card title="Color inputs">
      <div flex flex-wrap gap-6>
        <div flex flex-col gap-2>
          <label text-sm op-70>Foreground color</label>
          <div flex items-center gap-2>
            <input v-model="fg" type="color" style="width:40px;height:40px;border-radius:6px;cursor:pointer;border:none;">
            <c-input-text v-model:value="fg" placeholder="#000000" font-mono style="width:130px;" />
          </div>
        </div>
        <div flex flex-col gap-2>
          <label text-sm op-70>Background color</label>
          <div flex items-center gap-2>
            <input v-model="bg" type="color" style="width:40px;height:40px;border-radius:6px;cursor:pointer;border:none;">
            <c-input-text v-model:value="bg" placeholder="#ffffff" font-mono style="width:130px;" />
          </div>
        </div>
      </div>
    </c-card>

    <c-alert v-if="ratio === null" type="warning">
      Invalid hex color value. Please enter valid colors (e.g. #000000).
    </c-alert>

    <template v-if="ratio !== null && levels !== null">
      <c-card title="Contrast ratio">
        <div mb-3 flex items-center gap-3>
          <span text-4xl font-bold font-mono>{{ ratio }}:1</span>
          <n-tag :type="ratio >= 4.5 ? 'success' : ratio >= 3 ? 'warning' : 'error'" size="large">
            {{ ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large only' : 'FAIL' }}
          </n-tag>
        </div>
        <div flex flex-wrap gap-2>
          <n-tag :type="levels.normalAA ? 'success' : 'error'">
            Normal AA {{ levels.normalAA ? '✓' : '✗' }}
          </n-tag>
          <n-tag :type="levels.normalAAA ? 'success' : 'error'">
            Normal AAA {{ levels.normalAAA ? '✓' : '✗' }}
          </n-tag>
          <n-tag :type="levels.largeAA ? 'success' : 'error'">
            Large AA {{ levels.largeAA ? '✓' : '✗' }}
          </n-tag>
          <n-tag :type="levels.largeAAA ? 'success' : 'error'">
            Large AAA {{ levels.largeAAA ? '✓' : '✗' }}
          </n-tag>
        </div>
      </c-card>

      <c-card title="Preview">
        <div :style="`background:${bg};color:${fg};padding:20px;border-radius:8px;`">
          <p style="font-size:16px;margin:0 0 12px;">
            Normal text — The quick brown fox jumps over the lazy dog.
          </p>
          <p style="font-size:24px;font-weight:bold;margin:0;">
            Large text — The quick brown fox.
          </p>
        </div>
      </c-card>
    </template>
  </div>
</template>
