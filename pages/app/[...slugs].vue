<template>
  <div class="p-4 mx-auto max-w-4xl">
    <div class="flex items-center justify-between">
      <Breadcrumb :pages="pages" />
      <div class="flex items-center gap-x-2">
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
    <div class="rounded ring-1 ring-gray-100 dark:ring-gray-800 p-2 mt-4">
      <div
        v-for="(folder, index) in folders"
        :key="folder.id"
        :class="index < folders.length - 1 ? 'mb-2' : ''"
      >
        <div
          class="cursor-pointer hover:dark:bg-gray-800/40 hover:bg-gray-200/40 p-2 rounded"
          @click="
            useRouter().push({ params: { slugs: [...slugs, `${folder.id}`] } })
          "
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-folder" class="mr-2" />
              <div>
                {{ folder.name }}
              </div>
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300">
              {{ new Date(folder.updatedAt).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="(document, index) in documents"
        :key="document.id"
        :class="index < documents.length - 1 ? 'mb-2' : ''"
      >
        <div
          class="cursor-pointer hover:dark:bg-gray-800/40 hover:bg-gray-200/40 p-2 rounded"
          @click="useRouter().push(`/d/${document.id}`)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-document-text" class="mr-2" />
              <div>{{ document.title ? document.title : "Untitled" }}</div>
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300">
              {{ new Date(document.updatedAt).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="documents.length === 0 && folders.length === 0"
        class="text-center py-10 text-gray-600 dark:text-gray-300"
      >
        <UIcon name="i-heroicons-folder-open" class="text-4xl mb-4" />
        <div class="">No documents or folders</div>
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

const folders = ref<{ id: number; name: string; updatedAt: string }[]>([]);

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

const documents = ref<{ id: number; title: string; updatedAt: string }[]>([]);
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
