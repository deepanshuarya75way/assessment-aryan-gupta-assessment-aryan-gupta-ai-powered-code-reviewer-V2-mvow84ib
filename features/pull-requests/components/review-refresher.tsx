"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Matches the list page polling cadence. */
const REFRESH_INTERVAL = 10_000;

/**
 * Re-runs the server component on an interval while a review is still being
 * generated, so the page fills in without the user reloading. Only mounted
 * for unfinished reviews, so a finished page does no background work.
 */
export function ReviewRefresher() {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [router]);

  return null;
}
