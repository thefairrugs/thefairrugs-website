"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/admin")) return;
    // Avoid double tracking same path
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const referrer = typeof document !== "undefined" ? document.referrer : "";

    // Extract productId from URL if on a product page
    const productMatch = pathname.match(/^\/products\/([^/]+)/);
    const productId = productMatch ? productMatch[1] : undefined;

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer,
        productId,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
