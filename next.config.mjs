/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/a-propos',
        permanent: true,
      },
      {
        source: '/pro',
        destination: '/professionnels',
        permanent: true,
      },
      {
        source: '/pro-immo',
        destination: '/immobilier-professionnel',
        permanent: true,
      },
      {
        source: '/reservation/paiement',
        destination: '/checkout',
        permanent: true,
      },
      {
        source: '/publier-une-annonce',
        destination: '/publier',
        permanent: true,
      },
      {
        source: '/pro/app/dashboard',
        destination: '/pro/app',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
