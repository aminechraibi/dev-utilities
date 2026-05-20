<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useStorage } from '@vueuse/core';
import { yamlToXml } from './yaml-to-xml.service';
import { useCopy } from '@/composable/copy';

const yamlInput = useStorage('yaml-to-xml:input', 'name: John\nage: 30\ncity: Paris\nhobbies:\n  - reading\n  - coding');
const includeDeclaration = ref(true);
const error = ref('');

const xmlOutput = computed(() => {
  try {
    return yamlToXml(yamlInput.value, includeDeclaration.value);
  }
  catch {
    return '';
  }
});

watch([yamlInput, includeDeclaration], () => {
  try {
    yamlToXml(yamlInput.value, includeDeclaration.value);
    error.value = '';
  }
  catch (e) {
    error.value = (e as Error).message;
  }
}, { immediate: true });

const { copy } = useCopy({ source: xmlOutput, text: 'XML copied to clipboard' });
</script>

<template>
  <div flex flex-col gap-3>
    <div mb-1 flex items-center gap-2>
      <n-checkbox v-model:checked="includeDeclaration">
        XML declaration
      </n-checkbox>
    </div>
    <c-input-text v-model:value="yamlInput" :rows="10" label="YAML" placeholder="Paste YAML here..." multiline raw-text font-mono />
    <c-alert v-if="error" type="error">
      {{ error }}
    </c-alert>
    <c-input-text :value="xmlOutput" :rows="10" label="XML" multiline readonly raw-text font-mono />
    <div flex justify-center>
      <c-button :disabled="!xmlOutput" @click="copy()">
        Copy XML
      </c-button>
    </div>
  </div>
</template>
