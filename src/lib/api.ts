const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://limegreen-albatross-768813.hostingersite.com";

export const TOKEN_KEY = "kt_admin_jwt_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeStoredToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "X-Tunnel-Skip-AntiPhishing-Page": "true",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If body is NOT FormData, default to application/json
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    const isNetworkError = err instanceof TypeError || err.message?.toLowerCase().includes("fetch");
    if (isNetworkError) {
      console.warn(`[API Network Error] Failed to reach ${url}:`, err);
    }
    throw new Error(
      isNetworkError
        ? `Gagal terhubung ke API Server (${url}). Pastikan backend server atau dev tunnel Anda sedang aktif.`
        : err.message || "Terjadi kesalahan koneksi jaringan."
    );
  }

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status} - ${res.statusText}`;
    try {
      const errorJson = await res.json();
      if (errorJson.message) {
        errorMessage = Array.isArray(errorJson.message) ? errorJson.message.join(", ") : errorJson.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses (204 No Content)
  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

// Media upload helper
export async function uploadMedia(file: File): Promise<{ id: string; url: string; filename: string; mimeType: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiFetch<{ id: string; url: string; filename: string; mimeType: string }>("/admin/media/upload", {
    method: "POST",
    body: formData,
  });

  if (res && res.url) {
    let fixedUrl = res.url;
    if (fixedUrl.includes("/uploads/")) {
      const path = fixedUrl.substring(fixedUrl.indexOf("/uploads/"));
      fixedUrl = `${API_BASE_URL}${path}`;
    }
    return { ...res, url: fixedUrl };
  }

  return res;
}
