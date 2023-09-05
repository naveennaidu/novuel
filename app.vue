<template>
  <div>
    <div class="absolute top-1 right-1">
      <UButton
        :icon="
          colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'
        "
        variant="ghost"
        color="white"
        @click="
          colorMode.value === 'dark'
            ? (colorMode.preference = 'light')
            : (colorMode.preference = 'dark')
        "
      />
    </div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: "en",
    class: "antialiased [font-feature-settings:'ss01'] h-full",
  },
  bodyAttrs: {
    class: "h-full",
  },
});

const colorMode = useColorMode();
</script>

<style>
#__nuxt {
  height: 100%;
}
</style>
