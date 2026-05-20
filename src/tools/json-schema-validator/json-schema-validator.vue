<script setup lang="ts">
import { validateJsonSchema } from './json-schema-validator.service';

const jsonInput = ref(`{
  "name": "John",
  "age": 30,
  "email": "john@example.com"
}`);

const schemaInput = ref(`{
  "type": "object",
  "required": ["name", "age"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "number", "minimum": 0, "maximum": 150 },
    "email": { "type": "string", "format": "email" }
  }
}`);

const result = computed(() => {
  if (!jsonInput.value.trim() && !schemaInput.value.trim()) {
    return null;
  }
  return validateJsonSchema(jsonInput.value, schemaInput.value);
});
</script>

<template>
  <div class="validator-root">
    <!-- Validation result — always rendered, full width -->
    <div class="result-bar">
      <template v-if="result">
        <template v-if="result.valid">
          <n-tag type="success" size="large">
            Valid
          </n-tag>
          <span class="result-msg">JSON is valid according to the provided schema.</span>
        </template>
        <template v-else>
          <n-tag type="error" size="large">
            Invalid
          </n-tag>
          <span class="result-msg">{{ result.errors.length }} error{{ result.errors.length > 1 ? 's' : '' }} found</span>
          <div class="error-list">
            <div
              v-for="(error, index) in result.errors"
              :key="index"
              class="error-row"
            >
              {{ error }}
            </div>
          </div>
        </template>
      </template>
      <span v-else class="result-placeholder">Validation result will appear here</span>
    </div>

    <!-- Editors — 50 / 50 -->
    <div class="editors-row">
      <c-card title="JSON Input" class="editor-card">
        <c-input-text
          v-model:value="jsonInput"

          :rows="18"
          placeholder="Paste your JSON here..."

          multiline raw-text font-mono
        />
      </c-card>

      <c-card title="JSON Schema" class="editor-card">
        <c-input-text
          v-model:value="schemaInput"

          :rows="18"
          placeholder="Paste your JSON Schema here..."

          multiline raw-text font-mono
        />
      </c-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.validator-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 1 1 100%;
  max-width: 100%;
}

.result-bar {
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  background: rgba(128, 128, 128, 0.04);
  min-height: 52px;
}

.result-msg {
  font-size: 14px;
  align-self: center;
}

.result-placeholder {
  font-size: 13px;
  opacity: 0.3;
  align-self: center;
}

.error-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.error-row {
  font-family: monospace;
  font-size: 12px;
  padding: 6px 10px;
  background: rgba(255, 0, 0, 0.07);
  border-radius: 4px;
  border-left: 3px solid rgba(255, 0, 0, 0.4);
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
