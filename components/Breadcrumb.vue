<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" class="flex items-center space-x-4">
      <li v-for="page in pages" :key="page.name">
        <div class="flex items-center">
          <NuxtLink
            :to="page.to"
            class="mr-4 font-medium text-gray-800 dark:text-gray-200 hover:dark:text-gray-400 hover:text-gray-600"
          >
            {{ page.name }}
          </NuxtLink>
          <UIcon
            v-if="page !== pages[pages.length - 1]"
            name="i-heroicons-chevron-right"
            class="flex-shrink-0 text-gray-800 dark:text-gray-200"
          />
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps({
  pages: {
    type: Array as PropType<{ name: string; to: string }[]>,
    required: true,
  },
});
</script>

<style scoped></style>
