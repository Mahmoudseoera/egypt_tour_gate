import type { MetadataRoute } from 'next'

const baseUrl = 'https://www.egypttoursgate.com'

// safe fetch
async function safeFetch(url: string) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    })

    const text = await res.text()

    try {
      return JSON.parse(text)
    } catch {
      console.error('❌ Not JSON:', url)
      return null
    }

  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const urls: MetadataRoute.Sitemap = []

  // =========================
  // 🟢 Static Pages
  // =========================
  const staticPages = ['', '/about', '/contact', ]

  staticPages.forEach(route => {
    urls.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: route === '' ? 1 : 0.7,
    })
  })

  // =========================
  // 🔵 Tour Categories
  // =========================
  const categorySlugs = [
    'egypt-travel-packages',
    'egypt-day-tours',
    'nile-cruises',
  ]

  for (const catSlug of categorySlugs) {

    // category
    urls.push({
      url: `${baseUrl}/${catSlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    })

    const subData = await safeFetch(`${baseUrl}/api/v1/sub-category/${catSlug}`)
    if (!subData?.data) continue

    for (const sub of subData.data) {

      // sub category
      urls.push({
        url: `${baseUrl}/${catSlug}/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      })

      const tourData = await safeFetch(`${baseUrl}/api/v1/tour/${sub.slug}`)
      if (!tourData?.data) continue

      for (const tour of tourData.data) {

        // tour details
        urls.push({
          url: `${baseUrl}/tours/${tour.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    }
  }

  // =========================
  // 🟣 BLOG
  // =========================

  // مثال (عدل حسب API عندك)
  const blogCategories = ['travel-tips', 'egypt-guide']

  for (const blogCat of blogCategories) {

    // blog category
    urls.push({
      url: `${baseUrl}/blog/${blogCat}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })

    const blogData = await safeFetch(`${baseUrl}/api/v1/blog/${blogCat}`)
    if (!blogData?.data) continue

    for (const post of blogData.data) {

      // blog post
      urls.push({
        url: `${baseUrl}/blog/${blogCat}/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return urls
}