/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['@prisma/client'],
      esmExternals: true,
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
          config.externals.push('_http_common');
        }
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
        return config;
      },
  };
  
  export default nextConfig;