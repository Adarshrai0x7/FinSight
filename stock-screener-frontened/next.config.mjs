/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/get-filtered-stocks',
        destination: 'http://localhost:5000/api/stocks/screen',
      },
    ]
  },
}

export default nextConfig
