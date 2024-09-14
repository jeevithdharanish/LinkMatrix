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
            ],
    }
};

export default nextConfig;
