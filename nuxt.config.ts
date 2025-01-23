// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxt/ui'],
    app: {
      head: {
        title: 'Your Docs AI',
        meta: [
          { name: 'description', content: 'Allow your team or your customers to get the answers direct from your documents' },
        ],
        link: [
          {},
        ],
    },
  runtimeConfig: {
    public: {
        apiAuthorizationToken: process.env.API_AUTHORIZATION_TOKEN,
      },
  },
  hooks: {
    'app:config': (appConfig) => {
      console.log('Loaded App Config:', appConfig);
    },
  },
}})