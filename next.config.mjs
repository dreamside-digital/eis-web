
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.editionsinspace.com',
        port: '',
        pathname: '/assets/**',
      },
    ],
  }
};

export default withNextIntl(nextConfig);
