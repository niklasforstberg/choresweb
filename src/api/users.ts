import { apiFetch } from "./client";

export interface UserMe {
  id: number;
  email: string;
  name: string;
  role: string;
  householdId: number | null;
}

export const getMe = (): Promise<UserMe> => apiFetch<UserMe>("/api/users/me");
