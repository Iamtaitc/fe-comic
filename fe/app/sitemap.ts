// src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch categories
  const categoriesRes = await fetch('http://localhost:3000/api/v1/home');
  const categoriesData = await categoriesRes.json();
  const categories = categoriesData.data.categories;

  const categoriesUrls = categories.map((category) => ({
    url: `https://mangaverse.example.com/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: 'https://mangaverse.example.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://mangaverse.example.com/newest',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...categoriesUrls,
  ];
}

