<script setup lang="ts">
import { isValidXML } from '../xml-formatter/xml-formatter.service';
import { withDefaultOnError } from '@/utils/defaults';
import { xmlToYaml } from './xml-to-yaml.service';
import type { UseValidationRule } from '@/composable/validation';

const defaultXml = `<root>
  <person id="1">
    <name>Alice</name>
    <age>30</age>
  </person>
</root>`;

const xmlInput = useStorage('xml-to-yaml:input', defaultXml);

const yamlOutput = computed(() =>
  withDefaultOnError(() => (xmlInput.value.trim() ? xmlToYaml(xmlInput.value) : ''), ''),
);

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidXML,
    message: 'Provided XML is not valid.',
  },
];
</script>

<template>
  <div flex flex-col gap-3>
    <c-input-text
      v-model:value="xmlInput"
      multiline
      :validation-rules="rules"
      placeholder="Paste your XML content here..."
      label="XML input"
      raw-text
      rows="10"
      autofocus
    />
    <c-input-text
      :value="yamlOutput"
      multiline
      readonly
      placeholder="YAML output will appear here..."
      label="YAML output"
      raw-text
      rows="10"
      font-mono
    />
  </div>
</template>
