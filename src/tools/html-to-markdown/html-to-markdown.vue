<script setup lang="ts">
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { useCopy } from '@/composable/copy';
import { htmlToMarkdown } from './html-to-markdown.service';

const htmlInput = useStorage('html-to-markdown:input', '<h1>Hello World</h1>\n<p>This is a <strong>bold</strong> and <em>italic</em> text.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>');

const markdownOutput = computed(() => {
  try {
    return htmlToMarkdown(htmlInput.value);
  }
  catch {
    return '';
  }
});

const { copy } = useCopy({ source: markdownOutput, text: 'Markdown copied to clipboard' });
</script>

<template>
  <div flex flex-col gap-3>
    <c-input-text v-model:value="htmlInput" multiline :rows="10" label="HTML" placeholder="Paste HTML here..." font-mono raw-text autofocus />
    <c-input-text :value="markdownOutput" multiline :rows="10" label="Markdown" readonly font-mono raw-text />
    <div flex justify-center>
      <c-button :disabled="!markdownOutput" @click="copy()">
        Copy Markdown
      </c-button>
    </div>
  </div>
</template>
