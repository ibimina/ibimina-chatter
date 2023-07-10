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
				'close-icon': "url('/images/icons8-close.svg')",
				"delete-icon": "url('/images/icons8-delete-32.png')",
				'new-message': "url('/images/icons8-composing-mail-24.png')",
				'eye-icon': "url('/images/icons8-eye-24.png')",
				'eye-off-icon': "url('/images/icons8-closed-eye-24.png')",
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
