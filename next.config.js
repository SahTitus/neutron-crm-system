/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**i.pravatar.cc",
            },
            {
                protocol: "https",
                hostname: "**avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "**cloudflare-ipfs.com",
            },
        ]
    }
};

module.exports = nextConfig;