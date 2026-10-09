export const API_BASE_URL = (() => {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl.replace(/\/api\/v1\/?$/, "");
    }
    return "";
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/api\/v1\/?$/, "");
  }
  return process.env.NODE_ENV === "production" ? "" : "http://localhost:8000";
})();

/**
 * Normalizes API endpoint URLs.
 * Strips trailing slashes to avoid Vercel 308 redirect loops.
 */
export function getApiUrl(path: string): string {
  const [pathname, search] = path.split("?");
  let cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }
  const finalPath = search !== undefined ? `${cleanPath}?${search}` : cleanPath;
  if (API_BASE_URL && finalPath.startsWith("/api/v1") && API_BASE_URL.endsWith("/api/v1")) {
    return `${API_BASE_URL}${finalPath.slice(7)}`;
  }
  return `${API_BASE_URL}${finalPath}`;
}

export function getApiV1Base(): string {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl.endsWith("/api/v1") ? envUrl : `${envUrl.replace(/\/$/, "")}/api/v1`;
    }
    return "/api/v1";
  }
  return getApiUrl("/api/v1");
}

/**
 * Universal Image URL resolver.
 * Rules:
 * 1. Full HTTPS / HTTP URL -> return unchanged.
 * 2. Relative Supabase storage path -> resolve to Supabase public CDN URL.
 * 3. Old local /uploads/ path -> resolve to Supabase CDN URL unless static placeholder.
 * 4. null / empty -> return product placeholder.
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return "/uploads/product_placeholder.jpg";
  const cleanUrl = url.trim();

  // 1. Full HTTP / HTTPS URL (Supabase CDN, Unsplash, Google, etc.)
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    if (cleanUrl.startsWith("http://localhost:8000")) {
      const relativePath = cleanUrl.replace("http://localhost:8000", "");
      return getApiUrl(relativePath);
    }
    if (cleanUrl.startsWith("http://127.0.0.1:8000")) {
      const relativePath = cleanUrl.replace("http://127.0.0.1:8000", "");
      return getApiUrl(relativePath);
    }
    return cleanUrl;
  }

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://slyiyvegvcefhzaeymoo.supabase.co").trim().replace(/\/$/, "");
  const bucket = encodeURIComponent(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "Product Images");

  // 2. Relative Supabase storage path (e.g. "products/xxx.jpg")
  if (!cleanUrl.startsWith("/")) {
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanUrl}`;
  }

  // 3. Old local /uploads/ path
  if (cleanUrl.startsWith("/uploads/")) {
    const filename = cleanUrl.replace("/uploads/", "").trim();
    if (filename.includes("placeholder") || filename.includes("hero_main") || filename.includes("about_banner")) {
      return cleanUrl;
    }
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
  }

  return cleanUrl;
}

/**
 * Formats API or Pydantic validation errors safely for UI display.
 */
export function formatErrorMessage(detail: any): string {
  if (!detail) return "Unknown error occurred";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => (typeof item === "string" ? item : item.msg || item.message || JSON.stringify(item)))
      .join(", ");
  }
  if (typeof detail === "object") {
    return detail.message || detail.msg || detail.detail || JSON.stringify(detail);
  }
  return String(detail);
}
