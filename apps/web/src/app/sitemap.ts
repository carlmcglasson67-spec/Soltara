import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: Array<[string, number, MetadataRoute.Sitemap[number]['changeFrequency']]> = [
    ['/', 1, 'weekly'],
    ['/assessment', 0.9, 'monthly'],
    ['/for-installers', 0.8, 'monthly'],
    ['/how-we-make-money', 0.6, 'yearly'],
    ['/warm-homes-loans', 0.7, 'monthly'],
    ['/privacy', 0.2, 'yearly'],
    ['/terms', 0.2, 'yearly'],
  ];
  return pages.map(([path, priority, changeFrequency]) => ({ url: `${SITE.url}${path}`, lastModified: now, priority, changeFrequency }));
}
