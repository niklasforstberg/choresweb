import { apiFetch } from "./client";

export interface UserMe {
  id: number;
  email: string;
  name: string;
  role: string;
  householdId: number | null;
  color: string | null; // a key of PALETTE in lib/members; null picks a free one
}

export const getMe = (): Promise<UserMe> => apiFetch<UserMe>("/api/users/me");

export const updateProfile = (req: { name: string; email: string; currentPassword?: string }): Promise<UserMe> =>
  apiFetch("/api/users/me", { method: "PUT", body: JSON.stringify(req) });

export const updateColor = (color: string | null): Promise<UserMe> =>
  apiFetch("/api/users/me/color", { method: "PUT", body: JSON.stringify({ color }) });

export const deleteAccount = (password: string): Promise<void> =>
  apiFetch("/api/users/me", { method: "DELETE", body: JSON.stringify({ password }) });

export const changePassword = (currentPassword: string, newPassword: string): Promise<void> =>
  apiFetch("/api/users/me/password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) });
