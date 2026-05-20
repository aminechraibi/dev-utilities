<script setup lang="ts">
import { computed, ref } from 'vue';
import { htmlToMd, mdToHtml } from './markdown-html-converter.service';
import { useCopy } from '@/composable/copy';

const direction = ref<'md-to-html' | 'html-to-md'>('md-to-html');

const MD_EXAMPLE = `# Hello World

This is **bold** and *italic* text.

## Features

- Item one
- Item two
- Item three

[Visit example](https://example.com)

\`\`\`js
console.log('hello');
\`\`\`
`;

const HTML_EXAMPLE = `<h1>Hello World</h1>

<p>This is <strong>bold</strong> and <em>italic</em> text.</p>

<h2>Features</h2>

<ul>
  <li>Item one</li>
  <li>Item two</li>
  <li>Item three</li>
</ul>

<p><a href="https://example.com">Visit example</a></p>

<pre><code class="language-js">console.log('hello');</code></pre>
`;

const input = ref(MD_EXAMPLE);

const output = computed(() => {
  if (!input.value.trim()) {
    return '';
  }
  try {
    return direction.value === 'md-to-html'
      ? mdToHtml(input.value)
      : htmlToMd(input.value);
  }
  catch {
    return '';
  }
});

const inputLabel = computed(() => direction.value === 'md-to-html' ? 'Markdown' : 'HTML');
const outputLabel = computed(() => direction.value === 'md-to-html' ? 'HTML' : 'Markdown');

function setDirection(dir: 'md-to-html' | 'html-to-md') {
  if (dir === direction.value) {
    return;
  }
  direction.value = dir;
  input.value = dir === 'md-to-html' ? MD_EXAMPLE : HTML_EXAMPLE;
}

function swap() {
  const next = direction.value === 'md-to-html' ? 'html-to-md' : 'md-to-html';
  input.value = output.value || (next === 'md-to-html' ? MD_EXAMPLE : HTML_EXAMPLE);
  direction.value = next;
}

const { copy, isJustCopied } = useCopy({ source: output, text: 'Copied!' });
</script>

<template>
  <div class="mhc-root">
    <div mb-3 flex items-center gap-2>
      <span class="dir-badge" :class="{ active: direction === 'md-to-html' }" @click="setDirection('md-to-html')">Markdown → HTML</span>
      <button class="swap-btn" title="Swap direction" @click="swap">
        ⇄
      </button>
      <span class="dir-badge" :class="{ active: direction === 'html-to-md' }" @click="setDirection('html-to-md')">HTML → Markdown</span>
    </div>

    <div class="editors-row">
      <c-card :title="inputLabel" style="flex: 1 1 0; min-width: 0;">
        <c-input-text
          v-model:value="input"

          :rows="22"

          multiline raw-text font-mono
          :placeholder="`Paste ${inputLabel} here...`"
        />
      </c-card>

      <c-card :title="outputLabel" style="flex: 1 1 0; min-width: 0;">
        <c-input-text
          :value="output"

          :rows="22"

          multiline readonly raw-text font-mono
        />
        <div mt-2 flex justify-end>
          <c-button @click="copy()">
            {{ isJustCopied ? 'Copied!' : 'Copy' }}
          </c-button>
        </div>
      </c-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.mhc-root {
  flex: 1 1 100%;
  max-width: 100%;
}

.editors-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.dir-badge {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(128, 128, 128, 0.25);
  background: rgba(128, 128, 128, 0.06);
  cursor: pointer;
  transition: all 0.12s;
  user-select: none;

  &.active {
    background: rgba(59, 130, 246, 0.12);
    border-color: #3b82f6;
    color: #3b82f6;
    font-weight: 600;
  }
}

.swap-btn {
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.5;
  padding: 2px 4px;
  transition: opacity 0.12s;
  color: inherit;

  &:hover { opacity: 1; }
}
</style>
