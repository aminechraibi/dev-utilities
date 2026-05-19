<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCopy } from '@/composable/copy';
import { generateBubbleSvg } from './numbering-bubbles.service';
import type { BubbleShape } from './numbering-bubbles.service';
import { textToBase64 } from '@/utils/base64';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const startNum = ref(1);
const endNum = ref(10);
const shape = ref<BubbleShape>('circle');
const size = ref(40);
const bgColor = ref('#4a90d9');
const textColor = ref('#ffffff');

const shapeOptions = [
  { label: 'Circle', value: 'circle' },
  { label: 'Square', value: 'square' },
  { label: 'Diamond', value: 'diamond' },
];

const bubbles = computed(() => {
  const start = Math.max(1, Math.min(startNum.value, 999));
  const end = Math.max(start, Math.min(endNum.value, start + 99));
  const opts = { shape: shape.value, size: size.value, bgColor: bgColor.value, textColor: textColor.value };
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push({ num: i, svg: generateBubbleSvg(i, opts) });
  }
  return result;
});

const allSvgs = computed(() => {
  const padding = 4;
  const cols = Math.min(10, bubbles.value.length);
  const rows = Math.ceil(bubbles.value.length / cols);
  const w = cols * (size.value + padding) + padding;
  const h = rows * (size.value + padding) + padding;

  let innerSvgs = '';
  bubbles.value.forEach(({ svg }, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = col * (size.value + padding) + padding;
    const y = row * (size.value + padding) + padding;
    const inner = svg.replace(/<svg[^>]*>/, '').replace('</svg>', '');
    innerSvgs += `<g transform="translate(${x},${y})">${inner}</g>\n`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n${innerSvgs}</svg>`;
});

const allSvgsBase64 = computed(() => `data:image/svg+xml;base64,${textToBase64(allSvgs.value)}`);

const { download: downloadAll } = useDownloadFileFromBase64({ source: allSvgsBase64, filename: 'numbering-bubbles.svg' });

const { copy } = useCopy({ createToast: true });

function copyBubbleSvg(svg: string) {
  copy(svg);
}

function svgToDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function svgToPngBlob(svg: string, px: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const scale = 2;
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = px * scale;
      canvas.height = px * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, px, px);
      canvas.toBlob((blob) => {
        blob ? resolve(blob) : reject(new Error('toBlob failed'));
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('image load failed'));
    img.src = url;
  });
}

function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  return blob.arrayBuffer().then(buf => new Uint8Array(buf));
}

function crc32(data: Uint8Array): number {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) crc = table[(crc ^ data[i]) & 0xFF]! ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function buildZip(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const enc = new TextEncoder();
  const date = new Date();
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);

  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = enc.encode(file.name);
    const crc = crc32(file.data);
    const sz = file.data.length;

    const local = new Uint8Array(30 + name.length + sz);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034B50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true); // stored
    lv.setUint16(10, dosTime, true);
    lv.setUint16(12, dosDate, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, sz, true);
    lv.setUint32(22, sz, true);
    lv.setUint16(26, name.length, true);
    lv.setUint16(28, 0, true);
    local.set(name, 30);
    local.set(file.data, 30 + name.length);

    const central = new Uint8Array(46 + name.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014B50, true);
    cv.setUint16(4, 0x031E, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, dosTime, true);
    cv.setUint16(14, dosDate, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, sz, true);
    cv.setUint32(24, sz, true);
    cv.setUint16(28, name.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    central.set(name, 46);

    offset += local.length;
    locals.push(local);
    centrals.push(central);
  }

  const cdSize = centrals.reduce((s, c) => s + c.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054B50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const total = offset + cdSize + 22;
  const out = new Uint8Array(total);
  let pos = 0;
  for (const l of locals) { out.set(l, pos); pos += l.length; }
  for (const c of centrals) { out.set(c, pos); pos += c.length; }
  out.set(eocd, pos);
  return out;
}

const downloadPngStatus = ref<'idle' | 'busy' | 'ok' | 'err'>('idle');

async function downloadAllAsPng() {
  if (downloadPngStatus.value === 'busy') return;
  downloadPngStatus.value = 'busy';
  try {
    const px = size.value;
    const files = await Promise.all(
      bubbles.value.map(async ({ num, svg }) => {
        const blob = await svgToPngBlob(svg, px);
        const data = await blobToUint8Array(blob);
        return { name: `bubble-${num}.png`, data };
      }),
    );
    const zip = buildZip(files);
    const url = URL.createObjectURL(new Blob([zip], { type: 'application/zip' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'numbering-bubbles.zip';
    a.click();
    URL.revokeObjectURL(url);
    downloadPngStatus.value = 'ok';
  }
  catch { downloadPngStatus.value = 'err'; }
  setTimeout(() => { downloadPngStatus.value = 'idle'; }, 2000);
}

const copyBubblePngStatus = ref<Record<number, 'idle' | 'ok' | 'err'>>({});

async function copyBubblePng(num: number, svg: string) {
  try {
    const blob = await svgToPngBlob(svg, size.value);
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    copyBubblePngStatus.value = { ...copyBubblePngStatus.value, [num]: 'ok' };
  }
  catch {
    copyBubblePngStatus.value = { ...copyBubblePngStatus.value, [num]: 'err' };
  }
  setTimeout(() => {
    copyBubblePngStatus.value = { ...copyBubblePngStatus.value, [num]: 'idle' };
  }, 1500);
}
</script>

<template>
  <div>
    <c-card mb-3>
      <n-form label-placement="left" label-width="130">
        <div flex flex-wrap gap-3>
          <n-form-item label="Start number" style="flex:1;min-width:180px">
            <n-input-number v-model:value="startNum" :min="1" :max="999" style="width:100%" />
          </n-form-item>
          <n-form-item label="End number" style="flex:1;min-width:180px">
            <n-input-number v-model:value="endNum" :min="startNum" :max="startNum + 99" style="width:100%" />
          </n-form-item>
        </div>
        <div flex flex-wrap gap-3>
          <n-form-item label="Shape" style="flex:1;min-width:180px">
            <n-select v-model:value="shape" :options="shapeOptions" style="width:100%" />
          </n-form-item>
          <n-form-item label="Size (px)" style="flex:1;min-width:180px">
            <n-input-number v-model:value="size" :min="16" :max="128" style="width:100%" />
          </n-form-item>
        </div>
        <div flex flex-wrap gap-3>
          <n-form-item label="Background" style="flex:1;min-width:180px">
            <n-color-picker v-model:value="bgColor" :modes="['hex']" />
          </n-form-item>
          <n-form-item label="Text color" style="flex:1;min-width:180px">
            <n-color-picker v-model:value="textColor" :modes="['hex']" />
          </n-form-item>
        </div>
      </n-form>
    </c-card>

    <c-card mb-3>
      <div flex justify-between items-center mb-3>
        <div font-bold>
          Preview ({{ bubbles.length }} bubbles)
        </div>
        <div flex gap-2>
          <c-button :disabled="downloadPngStatus === 'busy'" @click="downloadAllAsPng">
            {{ downloadPngStatus === 'busy' ? 'Generating…' : downloadPngStatus === 'ok' ? 'Downloaded!' : downloadPngStatus === 'err' ? 'Failed' : 'Download all as PNG' }}
          </c-button>
          <c-button @click="downloadAll">
            Download SVG
          </c-button>
        </div>
      </div>

      <div flex flex-wrap gap-2>
        <div
          v-for="bubble in bubbles"
          :key="bubble.num"
          class="bubble-wrap"
          :title="`#${bubble.num} — click to copy PNG`"
          @click="copyBubblePng(bubble.num, bubble.svg)"
        >
          <img :src="svgToDataUri(bubble.svg)" :width="size" :height="size" :alt="`Bubble ${bubble.num}`">
          <div
            v-if="copyBubblePngStatus[bubble.num] && copyBubblePngStatus[bubble.num] !== 'idle'"
            class="bubble-badge"
            :class="copyBubblePngStatus[bubble.num] === 'ok' ? 'badge-ok' : 'badge-err'"
          >
            {{ copyBubblePngStatus[bubble.num] === 'ok' ? '✓' : '✗' }}
          </div>
        </div>
      </div>

      <div mt-2 style="font-size:12px;opacity:0.6">
        Click any bubble to copy it as PNG
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.bubble-wrap {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  &:hover img { opacity: 0.8; }
}

.bubble-badge {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  border-radius: 4px;
  pointer-events: none;
}

.badge-ok { background: rgba(0, 200, 100, 0.75); color: #fff; }
.badge-err { background: rgba(220, 50, 50, 0.75); color: #fff; }
</style>
