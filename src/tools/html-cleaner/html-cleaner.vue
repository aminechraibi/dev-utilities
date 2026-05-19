<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCopy } from '@/composable/copy';
import { cleanHtml, defaultOptions } from './html-cleaner.service';
import type { CleanOptions } from './html-cleaner.service';

const input = ref(`<div id="main" class="container" style="color: red;">
  <!-- page header -->
  <h1 class="title" style="font-size:24px;">Hello <b>World</b></h1>
  <p id="intro" style="margin:0;">This is a <span style="color:blue;">sample</span> paragraph with&nbsp;&nbsp;&nbsp;multiple non-breaking spaces.</p>
  <p>&nbsp;</p>
  <a href="https://example.com" class="btn">Click here</a>
  <img src="photo.jpg" alt="photo" class="img-fluid">
  <table class="table">
    <tr><td>Cell 1</td><td>Cell 2</td></tr>
  </table>
  <p class="empty"></p>
</div>`);

const opts = ref<CleanOptions>({ ...defaultOptions });

const output = computed(() => cleanHtml(input.value, opts.value));

const { copy } = useCopy({ source: output, text: 'Cleaned HTML copied!' });

const options: { key: keyof CleanOptions; label: string }[] = [
  { key: 'removeTagAttributes', label: 'Remove tag attributes' },
  { key: 'removeInlineStyles', label: 'Remove inline styles' },
  { key: 'removeClassesAndIds', label: 'Remove classes and IDs' },
  { key: 'removeAllTags', label: 'Remove all tags' },
  { key: 'removeSuccessiveNbsp', label: 'Remove successive &amp;nbsp;s' },
  { key: 'convertBoldItalic', label: 'Convert &lt;b&gt; to &lt;strong&gt;, &lt;i&gt; to &lt;em&gt;' },
  { key: 'removeEmptyTags', label: 'Remove empty tags' },
  { key: 'removeNbspOnlyTags', label: 'Remove tags with one &amp;nbsp;' },
  { key: 'removeSpanTags', label: 'Remove span tags' },
  { key: 'removeImages', label: 'Remove images' },
  { key: 'removeLinks', label: 'Remove links' },
  { key: 'removeTables', label: 'Remove tables' },
  { key: 'replaceTablesWithDivs', label: 'Replace table tags with &lt;div&gt;s' },
  { key: 'removeComments', label: 'Remove comments' },
  { key: 'setNewLinesAndIndent', label: 'Set new lines and text indents' },
];
</script>

<template>
  <div class="cleaner-root">
    <!-- Options panel -->
    <div class="options-panel">
      <div class="options-title">
        Cleaning options
      </div>
      <label
        v-for="opt in options"
        :key="opt.key"
        class="option-row"
      >
        <input
          v-model="opts[opt.key]"
          type="checkbox"
          class="opt-checkbox"
        >
        <span class="opt-label" v-html="opt.label" />
      </label>
    </div>

    <!-- Editors -->
    <div class="editors-row">
      <c-card title="HTML Input" class="editor-card">
        <c-input-text
          v-model:value="input"
          multiline
          :rows="22"
          placeholder="Paste your HTML here..."
          font-mono
          raw-text
        />
      </c-card>

      <c-card title="Cleaned Output" class="editor-card">
        <c-input-text
          :value="output"
          multiline
          :rows="22"
          placeholder="Cleaned HTML will appear here..."
          font-mono
          readonly
          raw-text
        />
        <div flex justify-end mt-2>
          <c-button size="small" @click="copy()">
            Copy
          </c-button>
        </div>
      </c-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.cleaner-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 1 1 100%;
  max-width: 100%;
}

.options-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  background: rgba(128, 128, 128, 0.04);
  align-items: center;
}

.options-title {
  width: 100%;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.4;
  margin-bottom: 4px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  white-space: nowrap;
}

.opt-checkbox {
  width: 15px;
  height: 15px;
  cursor: pointer;
  flex-shrink: 0;
  accent-color: #3b82f6;
}

.opt-label {
  opacity: 0.85;
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
