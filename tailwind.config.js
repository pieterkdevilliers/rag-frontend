/** @type {import('tailwindcss').Config} */
export default {
	content: [],
	theme: {
		extend: {
			colors: {
				accent: '#DB2777',
			},
			fontFamily: {
				sans: [
					'Roboto',
					...require('tailwindcss/defaultTheme').fontFamily.sans,
				],
				'roboto-condensed': [
					'Roboto Condensed',
					...require('tailwindcss/defaultTheme').fontFamily.sans,
				],
				// Add more font families if needed
			},
		},
	},
	plugins: [],
};
