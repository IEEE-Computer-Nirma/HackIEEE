"use client";

import { useEffect } from "react";

/**
 * Optimistic upfront prefetcher:
 * Fires a low-priority background request to /api/universities as soon as the site loads.
 * By the time the user ever opens the registration form or Step 2, the university catalog
 * is already warm in the browser HTTP & memory cache for 0ms instant loading.
 */
export default function UniversitiesPrefetcher() {
  useEffect(() => {
    if (typeof window !== "undefined" && "fetch" in window) {
      // Small idle delay so it never competes with initial hero paint
      const timer = window.setTimeout(() => {
        fetch("/api/universities", {
          priority: "low" as RequestPriority,
        }).catch(() => {});
      }, 500);

      return () => window.clearTimeout(timer);
    }
  }, []);

  return null;
}
