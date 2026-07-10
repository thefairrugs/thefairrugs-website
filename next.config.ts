import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow PayPal images (user avatars, card logos served from PayPal CDN)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.paypal.com",
      },
      {
        protocol: "https",
        hostname: "**.paypalobjects.com",
      },
    ],
  },

  // Security headers — allow PayPal SDK scripts + iframes (hosted fields / 3DS)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: PayPal SDK, Google Fonts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.paypal.com https://*.paypalobjects.com",
              // Styles: inline + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Frames: PayPal hosted card fields + 3DS
              "frame-src 'self' https://*.paypal.com https://*.paypalobjects.com",
              // Images: PayPal + data URIs
              "img-src 'self' data: https://*.paypal.com https://*.paypalobjects.com",
              // Connect: PayPal APIs
              "connect-src 'self' https://*.paypal.com https://*.paypalobjects.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
