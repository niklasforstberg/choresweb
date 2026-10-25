import i18n from "../i18n";

const TOKEN_KEY = "chores_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(path, { ...init, headers });

  if (res.status === 401) {
    if (token) {
      clearToken();
      window.location.href = "/";
    }
    throw new Error("Unauthorized");
  }

  // The API never answers 502–504 itself: that's Caddy or Cloudflare saying the
  // app is down, typically for the minute a deploy takes.
  if (res.status >= 502 && res.status <= 504) {
    throw new Error(i18n.t("common.serverUnavailable"));
  }

  if (!res.ok) {
    let text = await res.text();
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "string") text = parsed;
    } catch { /* not JSON — keep raw text */ }
    if (text.trimStart().startsWith("<")) text = ""; // an HTML error page, not a message
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return res.json();
}
