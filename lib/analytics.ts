export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type ToolAnalyticsContext = {
  tool_slug: string;
  page_path: string;
  locale?: string;
  [key: string]: unknown;
};

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params ?? {});
}

export function trackToolPageViewed(context: ToolAnalyticsContext) {
  trackEvent("tool_page_viewed", context);
}

export function trackToolUploadStarted(context: ToolAnalyticsContext & { file_count?: number }) {
  trackEvent("tool_upload_started", context);
}

export function trackToolConversionCompleted(context: ToolAnalyticsContext & { output_format?: string }) {
  trackEvent("tool_conversion_completed", context);
}

export function trackToolDownloadClicked(context: ToolAnalyticsContext & { output_format?: string }) {
  trackEvent("tool_download_clicked", context);
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
