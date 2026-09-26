import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://monobuild.com.br", changeFrequency: "monthly", priority: 1 }];
}
