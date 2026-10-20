import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kalaivanisainikcoachingcentre.org.in';
  const routes = [
    '',
    '/about',
    '/courses',
    '/courses/sainik-school',
    '/courses/rimc',
    '/courses/rms',
    '/admissions',
    '/faculty',
    '/results',
    '/facilities',
    '/gallery',
    '/testimonials',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route.startsWith('/courses') ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route.startsWith('/courses') ? 0.9 : 0.7,
  }));
}
