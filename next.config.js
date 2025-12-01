/** @type {import('next').NextConfig} */
const nextConfig = {
    // Image optimization
    images: {
        remotePatterns: [
            {
                hostname: '*.googleusercontent.com',
            },
            {
                hostname: 'linkmatrix.s3.amazonaws.com',
            },
            {
                hostname: 'linkmatrix.s3.ap-south-1.amazonaws.com',
            },
        ],
        // Enable modern image formats
        formats: ['image/avif', 'image/webp'],
        // Minimize image sizes
        minimumCacheTTL: 60,
    },
    
    // Enable React strict mode for better development
    reactStrictMode: true,
    
    // Compress responses
    compress: true,
    
    // Power optimizations
    poweredByHeader: false,
    
    // Optimize package imports
    experimental: {
        optimizePackageImports: ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons', '@fortawesome/free-brands-svg-icons', 'date-fns'],
    },
};

module.exports = nextConfig;