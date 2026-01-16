/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5001',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'gramaharvest.shop',
                port: '',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'www.gramaharvest.shop',
                port: '',
                pathname: '/uploads/**',
            }
        ],
        unoptimized: true, // Disable image optimization to avoid validation issues
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
