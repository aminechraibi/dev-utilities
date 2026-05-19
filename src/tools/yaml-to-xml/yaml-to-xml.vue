<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { useCopy } from '@/composable/copy';
import { yamlToXml } from './yaml-to-xml.service';

const yamlInput = useStorage('yaml-to-xml:input', 'name: John\nage: 30\ncity: Paris\nhobbies:\n  - reading\n  - coding');
const includeDeclaration = ref(true);
const error = ref('');

const xmlOutput = computed(() => {
  try {
    error.value = '';
    return yamlToXml(yamlInput.value, includeDeclaration.value);
  }
  catch (e) {
    error.value = (e as Error).message;
    return '';
  }
});

const { copy } = useCopy({ source: xmlOutput, text: 'XML copied to clipboard' });
</script>

<template>
  <div flex flex-col gap-3>
    <div flex gap-2 items-center mb-1>
      <n-checkbox v-model:checked="includeDeclaration">
        XML declaration
      </n-checkbox>
    </div>
    <c-input-text v-model:value="yamlInput" multiline :rows="10" label="YAML" placeholder="Paste YAML here..." font-mono raw-text />
    <c-alert v-if="error" type="error">
      {{ error }}
    </c-alert>
    <c-input-text :value="xmlOutput" multiline :rows="10" label="XML" readonly font-mono raw-text />
    <div flex justify-center>
      <c-button :disabled="!xmlOutput" @click="copy()">
        Copy XML
      </c-button>
    </div>
  </div>
</template>
