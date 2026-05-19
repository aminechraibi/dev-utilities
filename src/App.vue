<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router';
import { NGlobalStyle, NMessageProvider, NNotificationProvider, darkTheme } from 'naive-ui';
import { darkThemeOverrides, lightThemeOverrides } from './themes';
import { layouts } from './layouts';
import { useStyleStore } from './stores/style.store';

const route = useRoute();
const router = useRouter();

const isNavigating = ref(false);
let navTimer: ReturnType<typeof setTimeout> | null = null;
router.beforeEach(() => {
  if (navTimer) {
    clearTimeout(navTimer);
  }
  isNavigating.value = true;
});
router.afterEach(() => {
  navTimer = setTimeout(() => {
    isNavigating.value = false;
  }, 180);
});
const layout = computed(() => route?.meta?.layout ?? layouts.base);
const styleStore = useStyleStore();

const theme = computed(() => (styleStore.isDarkTheme ? darkTheme : null));
const themeOverrides = computed(() => (styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides));

const { locale } = useI18n();

syncRef(
  locale,
  useStorage('locale', locale),
);
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <NGlobalStyle />
    <NMessageProvider placement="bottom">
      <NNotificationProvider placement="bottom-right">
        <component :is="layout">
          <RouterView />
        </component>
      </NNotificationProvider>
    </NMessageProvider>

    <!-- Navigation loader bar -->
    <div v-if="isNavigating" class="nav-loader">
      <div class="nav-loader-bar" />
    </div>
  </n-config-provider>
</template>

<style>
.nav-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  height: 3px;
  pointer-events: none;
}

.nav-loader-bar {
  height: 100%;
  background: #3b82f6;
  border-radius: 0 2px 2px 0;
  animation: nav-progress 0.8s ease-out forwards;
  transform-origin: left;
}

@keyframes nav-progress {
  0%   { width: 0%; opacity: 1; }
  60%  { width: 85%; opacity: 1; }
  100% { width: 95%; opacity: 0.8; }
}

body {
  min-height: 100%;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}
</style>
