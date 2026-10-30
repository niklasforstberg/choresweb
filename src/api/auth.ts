import { apiFetch, setToken, clearToken } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export async function login(req: LoginRequest): Promise<void> {
  const res = await apiFetch<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(req),
  });
  setToken(res.token);
}

export async function register(req: RegisterRequest): Promise<void> {
  const res = await apiFetch<{ token: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(req),
  });
  setToken(res.token);
}

export function logout(): void {
  clearToken();
  window.location.href = "/";
}
