import { apiFetch } from "./client";

export interface Chore {
  id: number;
  name: string;
  weeklyTarget: number | null; // per member; null for chores done when needed
  sortOrder: number;
}

export type SaveChore = Omit<Chore, "id">;

// A claim takes a chore on today or a day to come; a completion records one done today or earlier.
export interface ChoreDayEntry {
  id: number;
  choreId: number;
  userId: number;
  date: string; // YYYY-MM-DD
}

// Any member may record a chore as done by another, so recordedById can differ from userId.
export interface ChoreCompletion extends ChoreDayEntry {
  recordedById: number;
}

export const getChores = (): Promise<Chore[]> => apiFetch("/api/chores");

export const createChore = (chore: SaveChore): Promise<Chore> =>
  apiFetch("/api/chores", { method: "POST", body: JSON.stringify(chore) });

export const updateChore = (id: number, chore: SaveChore): Promise<Chore> =>
  apiFetch(`/api/chores/${id}`, { method: "PUT", body: JSON.stringify(chore) });

export const deleteChore = (id: number): Promise<void> =>
  apiFetch(`/api/chores/${id}`, { method: "DELETE" });

export const getClaims = (from: string, to: string): Promise<ChoreDayEntry[]> =>
  apiFetch(`/api/claims?from=${from}&to=${to}`);

export const createClaim = (choreId: number, date: string): Promise<ChoreDayEntry> =>
  apiFetch("/api/claims", { method: "POST", body: JSON.stringify({ choreId, date }) });

// Returns the completion that replaces the claim.
export const completeClaim = (id: number): Promise<ChoreCompletion> =>
  apiFetch(`/api/claims/${id}/complete`, { method: "POST" });

export const deleteClaim = (id: number): Promise<void> =>
  apiFetch(`/api/claims/${id}`, { method: "DELETE" });

export const getCompletions = (from: string, to: string): Promise<ChoreCompletion[]> =>
  apiFetch(`/api/completions?from=${from}&to=${to}`);

export const createCompletion = (choreId: number, date: string, userId: number): Promise<ChoreCompletion> =>
  apiFetch("/api/completions", { method: "POST", body: JSON.stringify({ choreId, date, userId }) });

export const deleteCompletion = (id: number): Promise<void> =>
  apiFetch(`/api/completions/${id}`, { method: "DELETE" });
