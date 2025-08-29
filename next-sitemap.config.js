module.exports = {
  siteUrl: 'https://reconcilebook.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/api/*',
    '/admin/*',
    '/dashboard/*',
    '/bookkeeper/*',
    '/_next/*',
    '/404',
    '/500',
    '/client-portal/*'
  ],
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 0.7,
}
