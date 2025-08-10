/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                hostname:'*.googleusercontent.com',
            },
            {
                hostname:'linkmatrix.s3.amazonaws.com',
            },
            {
                hostname:'linkmatrix.s3.ap-south-1.amazonaws.com',
            },
        ],
    }
};

module.exports = nextConfig;