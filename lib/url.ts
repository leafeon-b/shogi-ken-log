const DEFAULT_CALLBACK = "/home";

export function sanitizeCallbackUrl(url: string | undefined): string {
  if (!url) return DEFAULT_CALLBACK;
  // Strip control characters that URL parsers silently remove (tab, newline, CR).
  // Without this, "/\n/evil.com" passes the startsWith checks but resolves to "//evil.com".
  const cleaned = url.replace(/[\t\n\r]/g, "");
  if (cleaned.startsWith("/") && !cleaned.startsWith("//")) return cleaned;
  return DEFAULT_CALLBACK;
}
