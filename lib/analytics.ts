export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params ?? {});
}

export function trackToolUsed(tool: string) {
  trackEvent("tool_used", { tool });
}

export function trackFileUploaded(tool: string, fileCount = 1) {
  trackEvent("file_uploaded", { tool, file_count: fileCount });
}

export function trackDownloadGenerated(tool: string, format?: string) {
  trackEvent("download_generated", { tool, format: format ?? "file" });
}
