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
    // Базові заголовки безпеки. CSP з nonce не додаємо: він змусив би рендерити кожну сторінку на запит і зіпсував би швидкість статичного сайту.
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    ];
    return [
      { source: "/(.*)", headers: security },
      { source: "/assets/:path*", headers: cache },
    ];
  },
};

export default config;
