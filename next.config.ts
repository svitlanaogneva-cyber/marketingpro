import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  async headers() {
    // Файли в /assets без хешу в імені — тому не immutable: добу свіжі, далі оновлюються у фоні
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return [{ source: "/assets/:path*", headers: cache }];
  },
};

export default config;
