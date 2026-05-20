<script setup lang="ts">
import { minifyHtml } from './html-minifier.service';
import { useCopy } from '@/composable/copy';

const inputHtml = ref('<html>\n  <!-- Page comment -->\n  <body>\n    <h1>Hello   World</h1>\n    <p>This is a   paragraph.</p>\n  </body>\n</html>');

const removeComments = ref(true);
const collapseWhitespace = ref(true);

const outputHtml = computed(() =>
  minifyHtml(inputHtml.value, {
    removeComments: removeComments.value,
    collapseWhitespace: collapseWhitespace.value,
  }),
);

const inputSize = computed(() => new TextEncoder().encode(inputHtml.value).byteLength);
const outputSize = computed(() => new TextEncoder().encode(outputHtml.value).byteLength);
const savings = computed(() => {
  if (inputSize.value === 0) {
    return '0';
  }
  return (((inputSize.value - outputSize.value) / inputSize.value) * 100).toFixed(1);
});

const { copy } = useCopy({ source: outputHtml, text: 'Minified HTML copied to clipboard' });
</script>

<template>
  <div class="minifier-root">
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <n-form-item label="Remove comments" label-placement="left" :show-feedback="false">
        <n-switch v-model:value="removeComments" />
      </n-form-item>
      <n-form-item label="Collapse whitespace" label-placement="left" :show-feedback="false">
        <n-switch v-model:value="collapseWhitespace" />
      </n-form-item>
      <div style="display:flex;gap:24px;margin-left:auto">
        <div text-center>
          <div text-sm op-60>
            Input
          </div>
          <div font-mono>
            {{ inputSize }} bytes
          </div>
        </div>
        <div text-center>
          <div text-sm op-60>
            Output
          </div>
          <div font-mono>
            {{ outputSize }} bytes
          </div>
        </div>
        <div text-center>
          <div text-sm op-60>
            Savings
          </div>
          <div font-mono>
            {{ savings }}%
          </div>
        </div>
      </div>
    </div>

    <div class="editors-row">
      <c-card title="HTML Input" class="editor-card">
        <c-input-text
          v-model:value="inputHtml"
          placeholder="Paste your HTML here..."

          :rows="20"

          multiline raw-text font-mono
        />
      </c-card>

      <c-card title="Minified HTML" class="editor-card">
        <c-input-text
          :value="outputHtml"
          placeholder="Minified output will appear here..."

          :rows="20"

          multiline readonly raw-text font-mono
        />
        <div mt-2 flex justify-end>
          <c-button size="small" @click="copy()">
            Copy
          </c-button>
        </div>
      </c-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.minifier-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 1 1 100%;
  max-width: 100%;
}

.editors-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
}

.editor-card {
  flex: 1 1 0;
  min-width: 0;
}
</style>
