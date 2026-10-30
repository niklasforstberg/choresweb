import { apiFetch } from "./client";

export interface Chore {
  id: number;
  name: string;
  weeklyTarget: number | null; // per member; null for chores done when needed
  sortOrder: number;
}

export type SaveChore = Omit<Chore, "id">;

export interface ChoreEntry {
  id: number;
  choreId: number;
  userId: number;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export const getChores = (): Promise<Chore[]> => apiFetch("/api/chores");

export const createChore = (chore: SaveChore): Promise<Chore> =>
  apiFetch("/api/chores", { method: "POST", body: JSON.stringify(chore) });

export const updateChore = (id: number, chore: SaveChore): Promise<Chore> =>
  apiFetch(`/api/chores/${id}`, { method: "PUT", body: JSON.stringify(chore) });

export const deleteChore = (id: number): Promise<void> =>
  apiFetch(`/api/chores/${id}`, { method: "DELETE" });

export const getEntries = (weekStart: string): Promise<ChoreEntry[]> =>
  apiFetch(`/api/entries?weekStart=${weekStart}`);

export const createEntry = (choreId: number, date: string): Promise<ChoreEntry> =>
  apiFetch("/api/entries", { method: "POST", body: JSON.stringify({ choreId, date }) });

export const setEntryCompleted = (id: number, completed: boolean): Promise<ChoreEntry> =>
  apiFetch(`/api/entries/${id}`, { method: "PATCH", body: JSON.stringify({ completed }) });

export const deleteEntry = (id: number): Promise<void> =>
  apiFetch(`/api/entries/${id}`, { method: "DELETE" });
