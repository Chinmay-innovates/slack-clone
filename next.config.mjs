/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "cautious-mastiff-451.convex.cloud",
				protocol: "https",
			},
		],
	},
};

export default nextConfig;
