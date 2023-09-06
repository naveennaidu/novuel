<template>
  <div class="h-screen w-screen">
    <div class="flex items-center justify-end">
      <div v-if="status === 'authenticated'" class="text-sm">
        {{ data?.user?.email }}
      </div>
      <UButton
        v-if="status === 'authenticated'"
        @click="signOut"
        variant="link"
        size="sm"
      >
        (Sign Out)
      </UButton>
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
    class: "antialiased [font-feature-settings:'ss01']",
  },
});

const colorMode = useColorMode();

const { status, data, signOut } = useAuth();
</script>
