/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'prose-hr': '#000',
			},
			// add custom bg image
			backgroundImage: {
				'hero-pattern': "url('/images/herobg.jpg')",
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
