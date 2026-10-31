import { apiFetch } from "./client";

export interface UserMe {
  id: number;
  email: string;
  name: string;
  role: string;
  householdId: number | null;
}

export const getMe = (): Promise<UserMe> => apiFetch<UserMe>("/api/users/me");

export const updateProfile = (req: { name: string; email: string; currentPassword?: string }): Promise<UserMe> =>
  apiFetch("/api/users/me", { method: "PUT", body: JSON.stringify(req) });

export const changePassword = (currentPassword: string, newPassword: string): Promise<void> =>
  apiFetch("/api/users/me/password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) });
