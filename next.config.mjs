/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'semantic-ui.com'
      }
    ]
  }
};

export default nextConfig;
