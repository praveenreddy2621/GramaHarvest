import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://gramaharvest.shop'
    const lastModified = new Date()

    const routes = [
        {
            url: '',
            lastModified,
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: '/harvest',
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: '/our-story',
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: '/contact',
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: '/privacy-policy',
            lastModified,
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
        {
            url: '/refund-policy',
            lastModified,
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
        {
            url: '/shipping-policy',
            lastModified,
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
        {
            url: '/terms',
            lastModified,
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
    ]

    return routes.map((route) => ({
        ...route,
        url: `${baseUrl}${route.url}`,
    }))
}
