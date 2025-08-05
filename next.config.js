/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/blog/quickbooks-auto-match-wrong-transactions-ultimate-fix',
        destination: '/blog/quickbooks-auto-match-wrong-transactions',
        permanent: true,
      },
      {
        source: '/blog/quickbooks-auto-matching-problems',
        destination: '/blog/quickbooks-auto-match-wrong-transactions',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 