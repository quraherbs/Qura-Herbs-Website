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
  if (!url) return "/uploads/product_placeholder.jpg";
  if (url.startsWith("http://localhost:8000")) {
    const relativePath = url.replace("http://localhost:8000", "");
    return getApiUrl(relativePath);
  }
  if (url.startsWith("http://127.0.0.1:8000")) {
    const relativePath = url.replace("http://127.0.0.1:8000", "");
    return getApiUrl(relativePath);
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/uploads/")) {
    return getApiUrl(url);
  }
  return url;
}
