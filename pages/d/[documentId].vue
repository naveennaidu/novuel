<template>
  <div class="mt-4">
    <UButton
      variant="ghost"
      color="gray"
      class="ml-2"
      icon="i-heroicons-chevron-left"
      @click="$router.back()"
    >
      Back
    </UButton>
    <Editor
      :default-value="content"
      :debounce-duration="2000"
      :storage-key="`novel-vue-${documentId}`"
      @debounced-update="update"
    />
  </div>
</template>

<script setup lang="ts">
import { Editor } from "novel-vue";
import { Editor as EditorType } from "@tiptap/core";
import "novel-vue/dist/style.css";
import { useStorage } from "@vueuse/core";

definePageMeta({ middleware: "auth" });

const documentId = computed(() => Number(useRoute().params.documentId));

const { data } = await useFetch(`/api/documents/${documentId.value}`);

const content = computed(() => {
  return JSON.parse(data.value?.document?.content ?? "{}");
});

watch(
  () => content.value,
  () => {
    const data = useStorage(`novel-vue-${documentId.value}`, "{}");
    data.value = JSON.stringify(content.value);
  },
  { deep: true, immediate: true }
);

async function update(e?: EditorType) {
  if (!e) return;
  const json = e.getJSON();
  await useFetch(`/api/documents/${documentId.value}`, {
    method: "PUT",
    body: JSON.stringify({ content: JSON.stringify(json) }),
  });
}
</script>

<style scoped></style>
