<template>
  <UModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1>New Folder</h1>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="emit('update:modelValue', false)"
          />
        </div>
      </template>
      <UForm :schema="schema" :state="formData" @submit.prevent="submit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="formData.name" />
        </UFormGroup>
        <UButton type="submit" color="white" variant="solid" class="mt-4">
          Create
        </UButton>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from "zod";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  parentFolderId: {
    type: Number,
    required: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const schema = z.object({
  name: z.string(),
});

const formData = ref({
  name: "",
});

const submitting = ref(false);
async function submit() {
  submitting.value = true;
  const { data } = await useFetch("/api/folders", {
    method: "POST",
    body: JSON.stringify({
      name: formData.value.name,
      parentFolderId: props.parentFolderId,
    }),
  });
  submitting.value = false;
  if (data.value) {
    emit("update:modelValue", false);
  }
}
</script>

<style scoped></style>
