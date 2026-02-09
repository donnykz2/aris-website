import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.arisclo.co';
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/shop/as-01-cargo-shorts`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/shop/as-01-hoodie`,
      lastModified: new Date().toISOString(),
    },
  ];
}
