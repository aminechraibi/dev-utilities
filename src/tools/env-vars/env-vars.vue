<script setup lang="ts">
import { computed, ref } from 'vue';
import { shells } from './env-vars.service';
import type { EnvVar } from './env-vars.service';
import { useCopy } from '@/composable/copy';

let nextId = 1;

const vars = ref<EnvVar[]>([
  { id: nextId++, key: 'NODE_ENV', value: 'production' },
  { id: nextId++, key: 'PORT', value: '3000' },
]);

const activeShellId = ref('bash');
const activeShell = computed(() => shells.find(s => s.id === activeShellId.value)!);

function addVar() {
  vars.value.push({ id: nextId++, key: '', value: '' });
}

function removeVar(id: number) {
  vars.value = vars.value.filter(v => v.id !== id);
}

const { copy } = useCopy({ createToast: true });

function _copyCmd(cmd: string) {
  copy(cmd);
}

const copiedId = ref<string | null>(null);
function copyWithFeedback(cmd: string, feedbackKey: string) {
  copy(cmd);
  copiedId.value = feedbackKey;
  setTimeout(() => {
    copiedId.value = null;
  }, 1400);
}

const validVars = computed(() => vars.value.filter(v => v.key.trim()));
</script>

<template>
  <div class="ev-root">
    <!-- Shell tabs -->
    <div class="shell-tabs">
      <button
        v-for="sh in shells"
        :key="sh.id"
        class="shell-tab"
        :class="{ active: activeShellId === sh.id }"
        @click="activeShellId = sh.id"
      >
        <span class="tab-label">{{ sh.label }}</span>
        <span class="tab-os">{{ sh.os }}</span>
      </button>
    </div>

    <!-- Variables table -->
    <div class="vars-panel">
      <div class="vars-header">
        <span class="vars-title">Environment Variables</span>
        <c-button size="small" @click="addVar">
          + Add variable
        </c-button>
      </div>

      <div class="vars-list">
        <div v-if="vars.length === 0" class="vars-empty">
          No variables yet — click "Add variable"
        </div>

        <div v-for="v in vars" :key="v.id" class="var-row">
          <c-input-text
            v-model:value="v.key"
            placeholder="KEY"
            font-mono
            style="flex:1;min-width:120px"
          />
          <span class="var-eq">=</span>
          <c-input-text
            v-model:value="v.value"
            placeholder="value"
            font-mono
            style="flex:2;min-width:160px"
          />
          <button class="del-btn" title="Remove" @click="removeVar(v.id)">
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Generated commands per variable -->
    <div class="cmds-panel">
      <div class="cmds-header">
        <span class="cmds-title">Commands — {{ activeShell.label }}</span>
        <button
          class="copy-all-btn"
          :class="{ copied: copiedId === 'all' }"
          @click="copyWithFeedback(activeShell.allCmd(validVars), 'all')"
        >
          {{ copiedId === 'all' ? '✓ Copied all' : 'Copy all' }}
        </button>
      </div>

      <div v-if="validVars.length === 0" class="cmds-empty">
        Add variables above to see commands
      </div>

      <div v-for="v in validVars" :key="v.id" class="cmd-row">
        <div class="cmd-key-badge">
          {{ v.key }}
        </div>
        <code class="cmd-code">{{ activeShell.setCmd(v.key, v.value) }}</code>
        <button
          class="cmd-copy-btn"
          :class="{ copied: copiedId === `set-${v.id}` }"
          @click="copyWithFeedback(activeShell.setCmd(v.key, v.value), `set-${v.id}`)"
        >
          {{ copiedId === `set-${v.id}` ? '✓' : 'Copy' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ev-root {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  flex: 1 1 100%;
  max-width: 100%;
}

/* Shell tabs */
.shell-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.shell-tab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  background: rgba(128, 128, 128, 0.04);
  cursor: pointer;
  color: inherit;
  transition: border-color 0.12s, background 0.12s;

  &:hover {
    border-color: rgba(59, 130, 246, 0.4);
    background: rgba(59, 130, 246, 0.05);
  }

  &.active {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    .tab-label { color: #3b82f6; }
  }
}

.tab-label {
  font-size: 13px;
  font-weight: 600;
}

.tab-os {
  font-size: 10px;
  opacity: 0.4;
}

/* Variables panel */
.vars-panel {
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  overflow: hidden;
}

.vars-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.15);
  background: rgba(128, 128, 128, 0.04);
}

.vars-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  opacity: 0.45;
}

.vars-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.vars-empty {
  padding: 20px;
  text-align: center;
  font-size: 13px;
  opacity: 0.3;
}

.var-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.08);

  &:last-child { border-bottom: none; }
}

.var-eq {
  font-family: monospace;
  font-size: 14px;
  opacity: 0.4;
  flex-shrink: 0;
}

.del-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  opacity: 0.3;
  color: inherit;
  padding: 4px 6px;
  border-radius: 4px;
  flex-shrink: 0;
  transition: opacity 0.1s, background 0.1s;

  &:hover {
    opacity: 1;
    background: rgba(220, 50, 50, 0.1);
    color: #e55;
  }
}

/* Commands panel */
.cmds-panel {
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  overflow: hidden;
}

.cmds-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.15);
  background: rgba(128, 128, 128, 0.04);
}

.cmds-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  opacity: 0.45;
}

.copy-all-btn {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 5px;
  border: 1px solid rgba(128, 128, 128, 0.25);
  background: none;
  cursor: pointer;
  color: inherit;
  transition: border-color 0.12s, background 0.12s, color 0.12s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
  &.copied { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.07); }
}

.cmds-empty {
  padding: 20px;
  text-align: center;
  font-size: 13px;
  opacity: 0.3;
}

.cmd-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.08);

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(128, 128, 128, 0.03); }
}

.cmd-key-badge {
  font-size: 10px;
  font-weight: 700;
  font-family: monospace;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
  flex-shrink: 0;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cmd-code {
  flex: 1;
  font-size: 12px;
  font-family: monospace;
  opacity: 0.85;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cmd-copy-btn {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  background: none;
  cursor: pointer;
  color: inherit;
  flex-shrink: 0;
  transition: border-color 0.1s, color 0.1s, background 0.1s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
  &.copied { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.07); }
}
</style>
