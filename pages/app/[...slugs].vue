<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <Breadcrumb :pages="pages" />
      <div class="flex items-center gap-x-2">
        <div class="flex-1">
          <UInput placeholder="Search" />
        </div>
        <UButton
          color="white"
          variant="solid"
          icon="i-heroicons-folder"
          @click="showFolderForm = true"
        >
          New Folder
        </UButton>
        <UButton
          color="white"
          variant="solid"
          icon="i-heroicons-document"
          @click="createDocument"
        >
          New Document
        </UButton>
      </div>
    </div>
    <div>
      <div v-for="folder in folders" :key="folder.id" class="mt-4">
        <UCard
          class="cursor-pointer"
          @click="
            useRouter().push({ params: { slugs: [...slugs, `${folder.id}`] } })
          "
        >
          {{ folder.name }}
        </UCard>
      </div>
      <div v-for="document in documents" :key="document.id" class="mt-4">
        <UCard
          class="cursor-pointer"
          @click="useRouter().push(`/d/${document.id}`)"
        >
          {{ document.title }} doc
        </UCard>
      </div>
    </div>
    <FolderForm
      v-model="showFolderForm"
      :parent-folder-id="
        slugs.length > 0 ? Number(slugs[slugs.length - 1]) : undefined
      "
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const slugs = computed(() => useRoute().params.slugs as string[]);

const pages = computed(() => {
  const pages = [{ name: "Documents", to: "/app" }];
  if (slugs.value.length === 0) return pages;
  slugs.value.forEach((slug) => {
    pages.push({
      name: slug,
      to: pages[pages.length - 1].to + "/" + slug,
    });
  });
  return pages;
});

const folders = ref<{ id: number; name: string }[]>([]);

async function getFolders() {
  const { data } = await useFetch("/api/folders", {
    query:
      slugs.value.length > 0
        ? { parentFolderId: slugs.value[slugs.value.length - 1] }
        : undefined,
  });
  folders.value = data.value?.folders ?? [];
}

await getFolders();

const showFolderForm = ref(false);
watch(
  () => showFolderForm.value,
  async (value) => {
    if (!value) {
      await getFolders();
    }
  }
);

const documents = ref<{ id: number; title: string }[]>([]);
async function getDocuments() {
  const { data } = await useFetch("/api/documents", {
    query:
      slugs.value.length > 0
        ? {
            folderId: slugs.value[slugs.value.length - 1],
          }
        : undefined,
  });
  documents.value = data.value?.documents ?? [];
}

await getDocuments();

async function createDocument() {
  const { data } = await useFetch("/api/documents", {
    method: "POST",
    body: JSON.stringify({
      folderId:
        slugs.value.length > 0
          ? slugs.value[slugs.value.length - 1]
          : undefined,
    }),
  });
  if (data.value) {
    await useRouter().push(`/d/${data.value.document.id}`);
  }
}
</script>

<style scoped></style>
