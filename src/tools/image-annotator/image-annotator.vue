<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { IconUpload, IconArrowBack, IconArrowForward, IconTrash, IconDownload, IconCopy } from '@tabler/icons-vue';

type AnnotationTool = 'select' | 'text' | 'rectangle' | 'arrow' | 'number';

interface Annotation {
  type: Exclude<AnnotationTool, 'select'>;
  color: string;
  fontSize?: number;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  text?: string;
  number?: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const imageLoaded = ref(false);
const imageName = ref('');
const activeTool = ref<AnnotationTool>('rectangle');
const annotationColor = ref('#ef4444');
const fontSize = ref(20);
const annotations = ref<Annotation[]>([]);

type DrawTool = Exclude<AnnotationTool, 'select'>;
type RedoStacks = Record<DrawTool, Annotation[]>;
const redoStacks = ref<RedoStacks>({ rectangle: [], arrow: [], text: [], number: [] });

const isDrawing = ref(false);
const currentAnnotation = ref<Annotation | null>(null);
const loadedImage = ref<HTMLImageElement | null>(null);
const pendingTextPos = ref<{ x: number; y: number } | null>(null);
const textInputValue = ref('');
const showTextInput = ref(false);
const textInputStyle = ref({ top: '0px', left: '0px' });
const startNumber = ref(1);

// Select / drag state
const selectedIdx = ref<number | null>(null);
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragOriginal = ref<Annotation | null>(null);
const hoverIdx = ref<number | null>(null);

// Edit panel (synced to selected annotation)
const editText = ref('');
const editFontSize = ref(20);
const editColor = ref('#ef4444');
const editNumber = ref(1);

const selectedAnnotation = computed(() =>
  selectedIdx.value !== null ? annotations.value[selectedIdx.value] ?? null : null,
);

const canvasCursor = computed(() => {
  if (activeTool.value !== 'select') return 'crosshair';
  return hoverIdx.value !== null || isDragging.value ? 'move' : 'default';
});

const canUndo = computed(() => {
  if (activeTool.value === 'select') return false;
  return annotations.value.some(a => a.type === activeTool.value);
});
const canRedo = computed(() => {
  if (activeTool.value === 'select') return false;
  return redoStacks.value[activeTool.value as DrawTool].length > 0;
});

function syncEditFields(ann: Annotation) {
  editColor.value = ann.color;
  editFontSize.value = ann.fontSize ?? 20;
  editText.value = ann.text ?? '';
  editNumber.value = ann.number ?? 1;
}

watch(selectedAnnotation, (ann) => {
  if (ann) syncEditFields(ann);
});

// Apply edit-panel changes back to annotation immediately
watch([editColor, editFontSize, editText, editNumber], () => {
  const idx = selectedIdx.value;
  if (idx === null) return;
  const ann = annotations.value[idx];
  if (!ann) return;
  ann.color = editColor.value;
  ann.fontSize = editFontSize.value;
  if (ann.type === 'text') ann.text = editText.value;
  if (ann.type === 'number') ann.number = editNumber.value;
  redraw();
});

function getCanvasScale(): { scaleX: number; scaleY: number } {
  const canvas = canvasRef.value;
  if (!canvas) return { scaleX: 1, scaleY: 1 };
  const rect = canvas.getBoundingClientRect();
  return { scaleX: canvas.width / rect.width, scaleY: canvas.height / rect.height };
}

function getCanvasCoords(e: MouseEvent): { x: number; y: number } {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const { scaleX, scaleY } = getCanvasScale();
  return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
}

function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function hitTest(ann: Annotation, x: number, y: number): boolean {
  const tol = 8;
  if (ann.type === 'rectangle' && ann.x2 !== undefined && ann.y2 !== undefined) {
    const [minX, maxX] = [Math.min(ann.x, ann.x2), Math.max(ann.x, ann.x2)];
    const [minY, maxY] = [Math.min(ann.y, ann.y2), Math.max(ann.y, ann.y2)];
    return x >= minX - tol && x <= maxX + tol && y >= minY - tol && y <= maxY + tol;
  }
  if (ann.type === 'arrow' && ann.x2 !== undefined && ann.y2 !== undefined) {
    return distToSegment(x, y, ann.x, ann.y, ann.x2, ann.y2) < tol * 2;
  }
  if (ann.type === 'text') {
    const fs = ann.fontSize ?? 20;
    return x >= ann.x - tol && x <= ann.x + 250 && y >= ann.y - fs - tol && y <= ann.y + tol;
  }
  if (ann.type === 'number') {
    const r = Math.max((ann.fontSize ?? 20) * 0.75, 12);
    return Math.hypot(x - ann.x, y - ann.y) <= r + tol;
  }
  return false;
}

function findAnnotationAt(x: number, y: number): number | null {
  for (let i = annotations.value.length - 1; i >= 0; i--) {
    if (hitTest(annotations.value[i], x, y)) return i;
  }
  return null;
}

function moveAnnotation(ann: Annotation, orig: Annotation, dx: number, dy: number) {
  ann.x = orig.x + dx;
  ann.y = orig.y + dy;
  if (orig.x2 !== undefined) ann.x2 = orig.x2 + dx;
  if (orig.y2 !== undefined) ann.y2 = orig.y2 + dy;
}

function redraw() {
  const canvas = canvasRef.value;
  const img = loadedImage.value;
  if (!canvas || !img) return;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  annotations.value.forEach((ann, i) => {
    drawAnnotation(ctx, ann);
    if (i === selectedIdx.value) drawSelectionHighlight(ctx, ann);
  });
  if (currentAnnotation.value) drawAnnotation(ctx, currentAnnotation.value);
}

function drawSelectionHighlight(ctx: CanvasRenderingContext2D, ann: Annotation) {
  ctx.save();
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  const pad = 6;
  if (ann.type === 'rectangle' && ann.x2 !== undefined && ann.y2 !== undefined) {
    const [minX, maxX] = [Math.min(ann.x, ann.x2), Math.max(ann.x, ann.x2)];
    const [minY, maxY] = [Math.min(ann.y, ann.y2), Math.max(ann.y, ann.y2)];
    ctx.strokeRect(minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2);
  }
  else if (ann.type === 'arrow' && ann.x2 !== undefined && ann.y2 !== undefined) {
    ctx.fillStyle = '#2563eb';
    ctx.setLineDash([]);
    for (const [px, py] of [[ann.x, ann.y], [ann.x2, ann.y2]] as [number, number][]) {
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  else if (ann.type === 'text') {
    const fs = ann.fontSize ?? 20;
    ctx.strokeRect(ann.x - pad, ann.y - fs - pad, 250, fs + pad * 2);
  }
  else if (ann.type === 'number') {
    const r = Math.max((ann.fontSize ?? 20) * 0.75, 12) + pad;
    ctx.beginPath();
    ctx.arc(ann.x, ann.y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawAnnotation(ctx: CanvasRenderingContext2D, ann: Annotation) {
  ctx.save();
  ctx.strokeStyle = ann.color;
  ctx.fillStyle = ann.color;
  ctx.lineWidth = 2;
  if (ann.type === 'rectangle' && ann.x2 !== undefined && ann.y2 !== undefined) {
    ctx.strokeRect(ann.x, ann.y, ann.x2 - ann.x, ann.y2 - ann.y);
  }
  else if (ann.type === 'arrow' && ann.x2 !== undefined && ann.y2 !== undefined) {
    drawArrow(ctx, ann.x, ann.y, ann.x2, ann.y2);
  }
  else if (ann.type === 'text' && ann.text) {
    ctx.font = `${ann.fontSize ?? 20}px sans-serif`;
    ctx.fillText(ann.text, ann.x, ann.y);
  }
  else if (ann.type === 'number' && ann.number !== undefined) {
    const r = Math.max((ann.fontSize ?? 20) * 0.75, 12);
    ctx.beginPath();
    ctx.arc(ann.x, ann.y, r, 0, Math.PI * 2);
    ctx.fillStyle = ann.color;
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(r * 1.1)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(ann.number), ann.x, ann.y);
  }
  ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const headLen = 15;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function pushAnnotation(ann: Annotation) {
  annotations.value.push(ann);
  redoStacks.value[ann.type] = [];
}

function onMouseDown(e: MouseEvent) {
  if (!imageLoaded.value) return;
  const { x, y } = getCanvasCoords(e);

  if (activeTool.value === 'select') {
    const idx = findAnnotationAt(x, y);
    selectedIdx.value = idx;
    if (idx !== null) {
      isDragging.value = true;
      dragStartX.value = x;
      dragStartY.value = y;
      dragOriginal.value = { ...annotations.value[idx] };
    }
    redraw();
    return;
  }

  selectedIdx.value = null;

  if (activeTool.value === 'number') {
    pushAnnotation({ type: 'number', color: annotationColor.value, fontSize: fontSize.value, x, y, number: startNumber.value });
    startNumber.value++;
    redraw();
    return;
  }

  if (activeTool.value === 'text') {
    pendingTextPos.value = { x, y };
    textInputValue.value = '';
    showTextInput.value = true;
    const canvas = canvasRef.value!;
    const rect = canvas.getBoundingClientRect();
    const { scaleX, scaleY } = getCanvasScale();
    textInputStyle.value = {
      top: `${(y / scaleY) + rect.top + window.scrollY}px`,
      left: `${(x / scaleX) + rect.left + window.scrollX}px`,
    };
    return;
  }

  isDrawing.value = true;
  currentAnnotation.value = { type: activeTool.value as DrawTool, color: annotationColor.value, fontSize: fontSize.value, x, y, x2: x, y2: y };
}

function onMouseMove(e: MouseEvent) {
  const { x, y } = getCanvasCoords(e);

  if (activeTool.value === 'select') {
    if (isDragging.value && dragOriginal.value !== null && selectedIdx.value !== null) {
      const ann = annotations.value[selectedIdx.value];
      moveAnnotation(ann, dragOriginal.value, x - dragStartX.value, y - dragStartY.value);
      redraw();
    }
    else {
      hoverIdx.value = findAnnotationAt(x, y);
    }
    return;
  }

  if (!isDrawing.value || !currentAnnotation.value) return;
  currentAnnotation.value.x2 = x;
  currentAnnotation.value.y2 = y;
  redraw();
}

function onMouseUp(e: MouseEvent) {
  if (activeTool.value === 'select') {
    isDragging.value = false;
    dragOriginal.value = null;
    return;
  }
  if (!isDrawing.value || !currentAnnotation.value) return;
  const { x, y } = getCanvasCoords(e);
  currentAnnotation.value.x2 = x;
  currentAnnotation.value.y2 = y;
  pushAnnotation({ ...currentAnnotation.value });
  currentAnnotation.value = null;
  isDrawing.value = false;
  redraw();
}

function confirmText() {
  if (textInputValue.value && pendingTextPos.value) {
    pushAnnotation({ type: 'text', color: annotationColor.value, fontSize: fontSize.value, x: pendingTextPos.value.x, y: pendingTextPos.value.y, text: textInputValue.value });
    redraw();
  }
  showTextInput.value = false;
  pendingTextPos.value = null;
  textInputValue.value = '';
}

function cancelText() {
  showTextInput.value = false;
  pendingTextPos.value = null;
  textInputValue.value = '';
}

function deleteSelected() {
  const idx = selectedIdx.value;
  if (idx === null) return;
  annotations.value.splice(idx, 1);
  selectedIdx.value = null;
  redraw();
}

function onFileInputChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) loadFile(file);
}

function loadFile(file: File) {
  imageName.value = file.name;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = async () => {
      loadedImage.value = img;
      imageLoaded.value = true;
      await nextTick();
      const canvas = canvasRef.value;
      if (!canvas) return;
      const maxW = canvas.parentElement?.clientWidth ?? 1200;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      annotations.value = [];
      redoStacks.value = { rectangle: [], arrow: [], text: [], number: [] };
      selectedIdx.value = null;
      redraw();
    };
    img.src = ev.target!.result as string;
  };
  reader.readAsDataURL(file);
}

function undoLast() {
  if (activeTool.value === 'select') return;
  const tool = activeTool.value as DrawTool;
  const lastIdx = annotations.value.map((a, i) => ({ a, i })).filter(({ a }) => a.type === tool).at(-1)?.i;
  if (lastIdx !== undefined) {
    const [removed] = annotations.value.splice(lastIdx, 1);
    redoStacks.value[tool].push(removed);
    if (tool === 'number') startNumber.value = removed.number!;
    if (selectedIdx.value === lastIdx) selectedIdx.value = null;
  }
  redraw();
}

function redoLast() {
  if (activeTool.value === 'select') return;
  const tool = activeTool.value as DrawTool;
  const next = redoStacks.value[tool].pop();
  if (next) {
    annotations.value.push(next);
    if (tool === 'number') startNumber.value = next.number! + 1;
  }
  redraw();
}

function clearAll() {
  annotations.value = [];
  redoStacks.value = { rectangle: [], arrow: [], text: [], number: [] };
  selectedIdx.value = null;
  redraw();
}

function downloadImage() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = imageName.value ? `annotated-${imageName.value}` : 'annotated-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

const copyPngStatus = ref<'idle' | 'ok' | 'err'>('idle');
async function copyAsPng() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      copyPngStatus.value = 'ok';
    }
    catch {
      copyPngStatus.value = 'err';
    }
    setTimeout(() => { copyPngStatus.value = 'idle'; }, 1800);
  }, 'image/png');
}

const TOOLS: { id: AnnotationTool; label: string }[] = [
  { id: 'select', label: '↖ Select' },
  { id: 'rectangle', label: 'Rect' },
  { id: 'arrow', label: 'Arrow' },
  { id: 'text', label: 'Text' },
  { id: 'number', label: '① Number' },
];
</script>

<template>
  <div>
    <!-- Upload row -->
    <div flex items-center gap-3 mb-3>
      <input ref="fileInputRef" type="file" accept="image/*" style="display:none" @change="onFileInputChange">
      <c-button size="small" @click="fileInputRef?.click()">
        <n-icon :component="IconUpload" mr-1 size="15" />
        {{ imageLoaded ? 'Replace image' : 'Upload image' }}
      </c-button>
      <span v-if="imageLoaded" style="font-size:13px;opacity:0.5;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ imageName }}</span>
    </div>

    <c-alert v-if="!imageLoaded" type="info">
      Upload an image to start annotating.
    </c-alert>

    <template v-if="imageLoaded">
      <!-- Toolbar -->
      <div flex flex-wrap items-center gap-2 mb-2>
        <div class="tool-group">
          <button
            v-for="tool in TOOLS"
            :key="tool.id"
            class="tool-btn"
            :style="activeTool === tool.id
              ? { background: '#2563eb', color: '#fff' }
              : { background: 'transparent', color: 'inherit' }"
            @click="activeTool = tool.id"
          >
            {{ tool.label }}
          </button>
        </div>

        <div v-if="activeTool !== 'select'" flex items-center gap-1>
          <span class="label">Color</span>
          <input v-model="annotationColor" type="color" class="color-swatch">
        </div>

        <div v-if="activeTool === 'text' || activeTool === 'number'" flex items-center gap-1>
          <span class="label">Size</span>
          <n-input-number v-model:value="fontSize" :min="8" :max="120" style="width:80px" size="small" />
        </div>

        <div flex-1 />

        <div flex items-center gap-1>
          <c-button size="small" :disabled="!canUndo" title="Undo" @click="undoLast">
            <n-icon :component="IconArrowBack" size="15" />
          </c-button>
          <c-button size="small" :disabled="!canRedo" title="Redo" @click="redoLast">
            <n-icon :component="IconArrowForward" size="15" />
          </c-button>
          <c-button size="small" :disabled="annotations.length === 0" title="Clear all" @click="clearAll">
            <n-icon :component="IconTrash" size="15" />
          </c-button>
          <c-button size="small" :title="copyPngStatus === 'ok' ? 'Copied!' : copyPngStatus === 'err' ? 'Copy failed (HTTPS required)' : 'Copy PNG to clipboard'" @click="copyAsPng">
            <n-icon :component="IconCopy" size="15" />
            <span v-if="copyPngStatus === 'ok'" ml-1 style="font-size:11px">Copied!</span>
            <span v-else-if="copyPngStatus === 'err'" ml-1 style="font-size:11px;color:#d03050">Failed</span>
          </c-button>
          <c-button size="small" title="Download PNG" @click="downloadImage">
            <n-icon :component="IconDownload" size="15" />
          </c-button>
        </div>
      </div>

      <!-- Number tool config -->
      <div v-if="activeTool === 'number'" class="config-panel" mb-2>
        <div flex items-center gap-4 flex-wrap>
          <div flex items-center gap-2>
            <span class="label">Next number</span>
            <n-input-number v-model:value="startNumber" :min="0" :max="9999" style="width:80px" size="small" />
            <span class="bubble-preview" :style="{ background: annotationColor }">{{ startNumber }}</span>
          </div>
          <span style="font-size:12px;opacity:0.55">Auto-increments on each click · edit to jump to any number</span>
        </div>
      </div>

      <!-- Select tool edit panel -->
      <div v-if="activeTool === 'select' && selectedAnnotation" class="config-panel edit-panel" mb-2>
        <div flex items-center gap-3 flex-wrap>
          <span class="type-badge">{{ selectedAnnotation.type }}</span>

          <div flex items-center gap-1>
            <span class="label">Color</span>
            <input v-model="editColor" type="color" class="color-swatch">
          </div>

          <template v-if="selectedAnnotation.type === 'text'">
            <div flex items-center gap-1>
              <span class="label">Text</span>
              <input v-model="editText" style="border:1px solid rgba(128,128,128,0.3);border-radius:4px;padding:2px 6px;font-size:13px;background:transparent;color:inherit;min-width:120px">
            </div>
            <div flex items-center gap-1>
              <span class="label">Size</span>
              <n-input-number v-model:value="editFontSize" :min="8" :max="120" style="width:80px" size="small" />
            </div>
          </template>

          <template v-else-if="selectedAnnotation.type === 'number'">
            <div flex items-center gap-1>
              <span class="label">Number</span>
              <n-input-number v-model:value="editNumber" :min="0" :max="9999" style="width:80px" size="small" />
            </div>
            <div flex items-center gap-1>
              <span class="label">Size</span>
              <n-input-number v-model:value="editFontSize" :min="8" :max="120" style="width:80px" size="small" />
            </div>
          </template>

          <c-button size="small" style="margin-left:auto;color:#d03050" @click="deleteSelected">
            Delete
          </c-button>
        </div>
        <div style="font-size:12px;opacity:0.45;margin-top:6px">Drag annotation on canvas to reposition</div>
      </div>

      <div v-else-if="activeTool === 'select' && !selectedAnnotation" class="config-panel" mb-2 style="opacity:0.6">
        <span style="font-size:13px">Click an annotation to select · drag to move · edit properties above</span>
      </div>

      <!-- Canvas -->
      <div class="canvas-wrapper">
        <canvas
          ref="canvasRef"
          class="annotator-canvas"
          :style="{ cursor: canvasCursor }"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseUp"
        />

        <div
          v-if="showTextInput"
          style="position:fixed;z-index:1000;background:white;padding:8px;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.2)"
          :style="textInputStyle"
        >
          <input
            v-model="textInputValue"
            placeholder="Type annotation…"
            style="border:1px solid #ccc;padding:4px;border-radius:4px;width:200px"
            autofocus
            @keyup.enter="confirmText"
            @keyup.esc="cancelText"
          >
          <div flex gap-2 mt-2>
            <c-button size="small" @click="confirmText">
              Add
            </c-button>
            <c-button size="small" @click="cancelText">
              Cancel
            </c-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.label {
  font-size: 12px;
  opacity: 0.55;
  white-space: nowrap;
}

.tool-group {
  display: flex;
  border: 1px solid rgba(128,128,128,0.25);
  border-radius: 6px;
  overflow: hidden;

  .tool-btn {
    padding: 4px 12px;
    font-size: 13px;
    border: none;
    border-right: 1px solid rgba(128,128,128,0.2);
    cursor: pointer;
    transition: background 0.15s;

    &:last-child { border-right: none; }
    &:hover { background: rgba(128,128,128,0.1) !important; }
  }
}

.color-swatch {
  width: 32px;
  height: 26px;
  padding: 0;
  border: 1px solid rgba(128,128,128,0.3);
  border-radius: 4px;
  cursor: pointer;
}

.config-panel {
  background: rgba(37, 99, 235, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.18);
  border-radius: 8px;
  padding: 10px 14px;
}

.edit-panel {
  background: rgba(37, 99, 235, 0.09);
  border-color: rgba(37, 99, 235, 0.3);
}

.type-badge {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(37, 99, 235, 0.15);
  color: #2563eb;
}

.bubble-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.canvas-wrapper {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  background: repeating-conic-gradient(rgba(128,128,128,0.08) 0% 25%, transparent 0% 50%) 0 0 / 16px 16px;
}

.annotator-canvas {
  display: block;
  width: 100%;
  height: auto;
}
</style>
