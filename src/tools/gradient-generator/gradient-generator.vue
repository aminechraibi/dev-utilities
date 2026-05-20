<script setup lang="ts">
import { type ColorStop, generateGradientCss } from './gradient-generator.service';
import { useCopy } from '@/composable/copy';

const gradientType = ref<'linear' | 'radial' | 'conic'>('linear');
const angle = ref(90);
const shape = ref<'ellipse' | 'circle'>('ellipse');

const stops = ref<ColorStop[]>([
  { color: '#6366f1', position: 0 },
  { color: '#ec4899', position: 100 },
]);

const gradientCss = computed(() =>
  generateGradientCss(gradientType.value, stops.value, angle.value, shape.value),
);

const cssProperty = computed(() => `background: ${gradientCss.value};`);

const { copy } = useCopy({ source: cssProperty, text: 'CSS copied to clipboard!' });

function addStop() {
  if (stops.value.length >= 8) {
    return;
  }
  const lastPos = stops.value[stops.value.length - 1]?.position ?? 100;
  const newPos = Math.min(100, Math.round((lastPos + 100) / 2));
  stops.value.push({ color: '#ffffff', position: newPos });
}

function removeStop(index: number) {
  if (stops.value.length <= 2) {
    return;
  }
  stops.value.splice(index, 1);
}

const typeOptions = [
  { label: 'Linear', value: 'linear' },
  { label: 'Radial', value: 'radial' },
  { label: 'Conic', value: 'conic' },
];

const shapeOptions = [
  { label: 'Ellipse', value: 'ellipse' },
  { label: 'Circle', value: 'circle' },
];
</script>

<template>
  <c-card>
    <div flex flex-col gap-4>
      <!-- Controls -->
      <div flex flex-wrap gap-3>
        <div min-w-150px flex-1>
          <c-select
            v-model:value="gradientType"
            label="Type:"
            label-position="top"
            :options="typeOptions"
          />
        </div>

        <div v-if="gradientType === 'radial'" min-w-150px flex-1>
          <c-select
            v-model:value="shape"
            label="Shape:"
            label-position="top"
            :options="shapeOptions"
          />
        </div>

        <div v-if="gradientType !== 'radial'" min-w-150px flex-1>
          <n-form-item label="Angle:" label-placement="top" :show-feedback="false">
            <n-input-number v-model:value="angle" :min="0" :max="360" :step="1" w-full>
              <template #suffix>
                °
              </template>
            </n-input-number>
          </n-form-item>
        </div>
      </div>

      <!-- Color stops -->
      <div>
        <div mb-2 font-medium>
          Color stops
        </div>
        <div flex flex-col gap-2>
          <div
            v-for="(stop, index) in stops"
            :key="index"
            flex items-center gap-3
          >
            <input
              v-model="stop.color"
              type="color"
              style="width:40px;height:36px;border:none;border-radius:6px;cursor:pointer;padding:2px;"
            >
            <span w-18 text-sm font-mono>{{ stop.color }}</span>
            <n-slider
              v-model:value="stop.position"
              :min="0"
              :max="100"
              :step="1"
              style="flex:1"
            />
            <span w-10 text-right text-sm font-mono>{{ stop.position }}%</span>
            <c-button
              type="error"
              size="small"
              :disabled="stops.length <= 2"
              @click="removeStop(index)"
            >
              ✕
            </c-button>
          </div>
        </div>
        <div mt-2>
          <c-button
            :disabled="stops.length >= 8"
            @click="addStop"
          >
            + Add stop
          </c-button>
        </div>
      </div>

      <!-- Preview -->
      <div>
        <div mb-2 font-medium>
          Preview
        </div>
        <div
          style="height:120px;border-radius:10px;width:100%;"
          :style="{ background: gradientCss }"
        />
      </div>

      <!-- CSS Output -->
      <div>
        <div mb-2 font-medium>
          CSS Output
        </div>
        <pre
          style="background:var(--n-code-bg,#f5f5f5);padding:12px;border-radius:8px;font-size:13px;overflow-x:auto;word-break:break-all;white-space:pre-wrap;"
        >{{ cssProperty }}</pre>
      </div>

      <div flex justify-center>
        <c-button @click="copy()">
          Copy CSS
        </c-button>
      </div>
    </div>
  </c-card>
</template>
