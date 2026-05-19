<script setup lang="ts">
import { ref, computed } from 'vue';
import { getGitignoreTemplates, combineTemplates } from './gitignore-generator.service';
import { useCopy } from '@/composable/copy';

const templates = getGitignoreTemplates();
const templateKeys = Object.keys(templates);

const selectedKeys = ref<string[]>([]);
const searchQuery = ref('');

const filteredKeys = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return templateKeys;
  return templateKeys.filter(k => k.toLowerCase().includes(q));
});

const preview = computed(() => combineTemplates(selectedKeys.value));

const { copy } = useCopy({ source: preview, text: '.gitignore copied to clipboard!' });

function downloadGitignore() {
  const blob = new Blob([preview.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '.gitignore';
  a.click();
  URL.revokeObjectURL(url);
}

function toggleAll() {
  if (selectedKeys.value.length === filteredKeys.value.length) {
    selectedKeys.value = selectedKeys.value.filter(k => !filteredKeys.value.includes(k));
  }
  else {
    const toAdd = filteredKeys.value.filter(k => !selectedKeys.value.includes(k));
    selectedKeys.value = [...selectedKeys.value, ...toAdd];
  }
}
</script>

<template>
  <div>
    <c-card title="Select templates" mb-3>
      <div mb-3 flex gap-3 items-center>
        <c-input-text
          v-model:value="searchQuery"
          placeholder="Filter templates..."
          style="flex: 1"
        />
        <c-button @click="toggleAll">
          {{ selectedKeys.length === filteredKeys.length ? 'Deselect all' : 'Select all' }}
        </c-button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <n-tag
          v-for="key in filteredKeys"
          :key="key"
          :type="selectedKeys.includes(key) ? 'primary' : 'default'"
          style="cursor: pointer;"
          @click="selectedKeys.includes(key)
            ? (selectedKeys = selectedKeys.filter(k => k !== key))
            : selectedKeys.push(key)"
        >
          {{ key }}
        </n-tag>
      </div>

      <div v-if="selectedKeys.length > 0" mt-3 style="color: var(--n-text-color-3); font-size: 13px;">
        Selected: {{ selectedKeys.join(', ') }}
      </div>
    </c-card>

    <c-card title="Preview">
      <c-input-text
        :value="preview || '# Select templates above to generate .gitignore content'"
        multiline
        rows="20"
        readonly
        font-mono
      />
      <div mt-3 flex justify-end gap-3>
        <c-button :disabled="!preview" @click="copy()">
          Copy
        </c-button>
        <c-button :disabled="!preview" @click="downloadGitignore">
          Download .gitignore
        </c-button>
      </div>
    </c-card>
  </div>
</template>
