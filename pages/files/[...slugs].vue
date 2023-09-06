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
      <div v-for="(file, index) in files" :key="file.id">
        <div
          class="cursor-pointer hover:dark:bg-gray-800/40 hover:bg-gray-200/40 p-2 rounded"
          @click="
            file.type === 'folder'
              ? useRouter().push({
                  params: {
                    slugs: [
                      ...slugs,
                      `${stringToSlug(file.title)}--${file.id}`,
                    ],
                  },
                })
              : useRouter().push(`/d/${file.id}`)
          "
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon
                :name="
                  file.type === 'document'
                    ? 'i-heroicons-document-text'
                    : 'i-heroicons-folder'
                "
                class="mr-2"
              />
              <div>
                {{ file.title }}
              </div>
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300">
              {{ new Date(file.updatedAt).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="files.length === 0 && !loading"
        class="text-center py-10 text-gray-600 dark:text-gray-300"
      >
        <UIcon name="i-heroicons-folder-open" class="text-4xl mb-4" />
        <div class="">No documents or folders</div>
      </div>
    </div>
    <FolderForm
      v-model="showFolderForm"
      :parent-folder-id="
        slugs.length > 0
          ? Number(slugs[slugs.length - 1].split('--')[1])
          : undefined
      "
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const slugs = computed(() => useRoute().params.slugs as string[]);

const pages = computed(() => {
  const pages = [{ name: "Documents", to: "/files" }];
  if (slugs.value.length === 0) return pages;
  slugs.value.forEach((slug) => {
    pages.push({
      name: slugToDisplayString(slug.split("--")[0]),
      to: pages[pages.length - 1].to + "/" + slug,
    });
  });
  return pages;
});

const files = ref<
  {
    id: number;
    title: string;
    updatedAt: string;
    type: "document" | "folder";
  }[]
>([]);

const loading = ref(false);
async function getFiles() {
  loading.value = true;
  const { data } = await useFetch("/api/files", {
    query:
      slugs.value.length > 0
        ? { folderId: slugs.value[slugs.value.length - 1].split("--")[1] }
        : undefined,
  });
  loading.value = false;
  files.value = data.value?.files ?? [];
}

onMounted(async () => {
  await nextTick();
  await getFiles();
});

const showFolderForm = ref(false);
watch(
  () => showFolderForm.value,
  async (value) => {
    if (!value) {
      await getFiles();
    }
  }
);

async function createDocument() {
  const { data } = await useFetch("/api/documents", {
    method: "POST",
    body: JSON.stringify({
      folderId:
        slugs.value.length > 0
          ? slugs.value[slugs.value.length - 1].split("--")[1]
          : undefined,
    }),
  });
  if (data.value) {
    await useRouter().push(`/d/${data.value.document.id}`);
  }
}

function stringToSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word characters with dashes
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing dashes
}

function slugToDisplayString(slug: string) {
  return slug
    .replace(/-/g, " ") // Replace dashes with spaces
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize the first letter of each word
}
</script>

<style scoped></style>
