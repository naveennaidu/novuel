<template>
  <div class="mt-16 mx-auto max-w-xl text-center">
    <h1 class="text-5xl font-semibold">Novuel</h1>

    <UButton @click="continueWithGoogle" class="mt-8">
      Continue with Google
    </UButton>
  </div>
</template>

<script setup lang="ts">
const { status, signIn } = useAuth();
async function continueWithGoogle() {
  await signIn("google");
}

watchEffect(() => {
  if (status.value === "authenticated") {
    useRouter().push("/app");
  }
});
</script>

<style scoped></style>
