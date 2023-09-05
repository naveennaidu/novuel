<template>
  <div class="mt-16 mx-auto max-w-xl">
    <h1 class="text-5xl font-semibold text-center">Novuel</h1>
    <UCard class="mt-8">
      <UForm
        ref="form"
        :schema="schema"
        :state="formData"
        @submit.prevent="signUp"
      >
        <UFormGroup label="Email" name="email">
          <UInput v-model="formData.email" placeholder="example@email.com" />
        </UFormGroup>
        <UButton
          type="submit"
          color="white"
          variant="solid"
          class="mt-4"
          :loading="loading"
        >
          Sign Up
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const form = ref();
const formData = ref({
  email: "",
});
const schema = z.object({
  email: z.string().email("Invalid email"),
});

const loading = ref(false);
async function signUp() {
  await form.value.validate();
  loading.value = true;
  const { data } = await useFetch("/api/user", {
    method: "POST",
    body: JSON.stringify(formData.value),
  });
  console.log(data.value);

  loading.value = false;
}
</script>

<style scoped></style>
