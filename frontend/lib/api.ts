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

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (API_BASE_URL && cleanPath.startsWith("/api/v1") && API_BASE_URL.endsWith("/api/v1")) {
    return `${API_BASE_URL}${cleanPath.slice(7)}`;
  }
  return `${API_BASE_URL}${cleanPath}`;
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

  // 2. Relative Supabase storage path (e.g. "products/xxx.jpg" or "97833121acd449019ba3674d729c6243.jpg")
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://slyiyvegvcefhzaeymoo.supabase.co").trim().replace(/\/$/, "");
  const bucket = "product-images";

  if (!cleanUrl.startsWith("/")) {
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanUrl}`;
  }

  // 3. Old local /uploads/ path
  if (cleanUrl.startsWith("/uploads/")) {
    const filename = cleanUrl.replace("/uploads/", "").trim();
    if (filename.includes("placeholder") || filename.includes("hero_main") || filename.includes("about_banner")) {
      return cleanUrl;
    }
    // Return direct Supabase CDN URL for uploaded media files
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
  }

  return cleanUrl;
}
