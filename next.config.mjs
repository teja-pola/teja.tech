import MiniCssExtractPlugin from 'mini-css-extract-plugin'

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
  webpack: (config, { isServer }) => {
    // Ensure mini-css-extract-plugin is present when building CSS bundles
    try {
      config.plugins.push(new MiniCssExtractPlugin())
    } catch (e) {
      // ignore if plugin not available yet; installation step required
    }
    return config
  },
}

export default nextConfig
