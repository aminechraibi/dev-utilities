<script setup lang="ts">
import { formatGraphql } from './graphql-formatter.service';
import { useCopy } from '@/composable/copy';
import { withDefaultOnError } from '@/utils/defaults';

const inputQuery = ref(`query GetUser($id: ID!) {
user(id: $id) {
id
name
email
posts {
id
title
}
}
}`);

const formattedQuery = computed(() =>
  withDefaultOnError(() => formatGraphql(inputQuery.value), ''),
);

const formatError = computed(() => {
  if (!inputQuery.value.trim()) {
    return null;
  }
  try {
    formatGraphql(inputQuery.value);
    return null;
  }
  catch (e: unknown) {
    return (e as Error).message;
  }
});

const { copy } = useCopy({ source: formattedQuery, text: 'Formatted GraphQL copied to clipboard' });

const examples = [
  {
    label: 'Query',
    value: 'query GetUser($id: ID!) {\nuser(id: $id) {\nid\nname\nemail\nposts {\nid\ntitle\n}\n}\n}',
  },
  {
    label: 'Mutation',
    value: 'mutation CreatePost($input: PostInput!) {\ncreatePost(input: $input) {\nid\ntitle\nauthor {\nid\nname\n}\n}\n}',
  },
  {
    label: 'Fragment',
    value: 'fragment UserFields on User {\nid\nname\nemail\n}\n\nquery GetUsers {\nusers {\n...UserFields\nposts {\nid\ntitle\n}\n}\n}',
  },
  {
    label: 'Subscription',
    value: 'subscription OnMessageAdded($roomId: ID!) {\nmessageAdded(roomId: $roomId) {\nid\ncontent\nauthor {\nname\n}\n}\n}',
  },
];
</script>

<template>
  <div class="gql-root">
    <div flex gap-2 style="flex-wrap: wrap">
      <span mr-1 self-center text-sm op-70>Examples:</span>
      <c-button
        v-for="ex in examples"
        :key="ex.label"
        size="small"
        @click="inputQuery = ex.value"
      >
        {{ ex.label }}
      </c-button>
    </div>

    <div class="editors-row">
      <c-card title="GraphQL Input" class="editor-card">
        <c-input-text
          v-model:value="inputQuery"

          :rows="20"
          placeholder="Paste your GraphQL query here..."

          multiline raw-text font-mono
        />
      </c-card>

      <c-card title="Formatted Output" class="editor-card">
        <c-input-text
          :value="formattedQuery"

          :rows="20"
          placeholder="Formatted output will appear here..."

          multiline readonly raw-text font-mono
        />
      </c-card>
    </div>

    <c-alert v-if="formatError" type="error">
      {{ formatError }}
    </c-alert>

    <div v-if="formattedQuery" flex justify-center>
      <c-button @click="copy()">
        Copy formatted GraphQL
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.gql-root {
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
