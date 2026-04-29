import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
      // disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://www.egypttoursgate.com/sitemap.xml',
  }
}