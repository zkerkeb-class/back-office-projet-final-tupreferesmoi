const nextConfig = {
	experimental: {
		disablePostcssPresetEnv: true, // Désactive certaines optimisations qui utilisent gzip-size
	},
	webpack: (config, {isServer}) => {
		config.resolve.fallback = {
			fs: false,
			path: false,
			os: false,
		};
		return config;
	},
};

module.exports = nextConfig;
