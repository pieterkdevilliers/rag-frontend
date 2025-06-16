// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'@nuxt/ui',
		'@nuxtjs/color-mode',
	],
	colorMode: {
		preference: 'light', // default value of $colorMode.preference
	},
	app: {
		head: {
			title: 'Your Docs AI',
			meta: [
				{
					name: 'description',
					content:
						'Allow your team or your customers to get the answers direct from your documents',
				},
			],
			link: [{}],
		},
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

	// --- ADD THIS BLOCK ---
	// This tells Vite to explicitly look for and correctly pre-bundle 'zod',
	// which is a dependency of @nuxt/ui and is causing the cache issue.
	vite: {
		optimizeDeps: {
			include: ['zod'],
		},
	},
	// ----------------------
});
