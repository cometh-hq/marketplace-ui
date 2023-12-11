/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  rewrites: async () => {
    return [{ source: "/", destination: "/marketplace" }]
  },
}

export default nextConfig
