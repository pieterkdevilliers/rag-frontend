// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'@nuxt/ui',
		'@nuxtjs/color-mode',
		'@nuxtjs/google-fonts',
		'@nuxtjs/tailwindcss',
	],
	colorMode: {
		preference: 'light', // default value of $colorMode.preference
	},
	googleFonts: {
		families: {
			Roboto: [300, 400, 500, 700, 900],
			'Roboto+Condensed': [300, 400, 500, 700],
		},
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
			apiBase:
				process.env.NUXT_PUBLIC_API_BASE_URL ||
				'https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1',
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
