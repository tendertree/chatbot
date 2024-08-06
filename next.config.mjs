/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config,{isServer}) => {
		    if (!isServer) {
      config.resolve.fullySpecified = false;
    } config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

		 config.module.rules.push({
      test: /node_modules\/langchain/,
      resolve: {
        fullySpecified: false,
      },
    });
        // Ignore node-specific modules when bundling for the browser
        // https://webpack.js.org/configuration/resolve/#resolvealias
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,

        },
		 config.externals = [...config.externals, "hnswlib-node","closevector-hnswlib-node" ,"openai"];
        return config;
    },


};

export default nextConfig;
