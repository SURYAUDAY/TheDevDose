import type { MetadataRoute } from "next";
import { getPhases, getTopics } from "@/lib/content";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thedevdose.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1 },
    { url: `${BASE}/learn`, priority: 0.9 },
  ];
  for (const p of getPhases()) {
    urls.push({ url: `${BASE}/learn/${p.id}`, priority: 0.8 });
    for (const t of getTopics(p.id)) {
      urls.push({ url: `${BASE}/learn/${p.id}/${t.slug}`, priority: 0.6 });
    }
  }
  return urls;
}
