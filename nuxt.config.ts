// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxthq/ui", "@sidebase/nuxt-auth"],
  runtimeConfig: {
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    API_ROUTE_SECRET: process.env.API_ROUTE_SECRET,
    openaiApiKey: "",
    public: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    },
  },
  colorMode: {
    preference: "light",
  },
  auth: {
    origin:
      process.env.ENVIRONMENT === "production"
        ? "https://novuel.vercel.app"
        : "http://localhost:3000",
  },
});
