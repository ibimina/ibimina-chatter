/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			'images.unsplash.com',
			'lh3.googleusercontent.com',
			'avatars.githubusercontent.com',
			'firebasestorage.googleapis.com',
			'plus.unsplash.com',
		],
	},
};

module.exports = nextConfig;
