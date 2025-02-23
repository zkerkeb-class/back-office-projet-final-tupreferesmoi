const nextConfig = {
	webpack: (config) => {
		config.resolve.fallback = {
			fs: false,
			path: false,
			os: false,
		};
		return config;
	},
};

module.exports = nextConfig;
