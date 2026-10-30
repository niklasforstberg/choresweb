import { apiFetch } from "./client";

export interface HouseholdMember {
  id: number;
  name: string;
}

export interface Household {
  id: number;
  name: string;
  inviteCode: string;
  members: HouseholdMember[];
}

export const getHousehold = (): Promise<Household> => apiFetch("/api/household");

export const createHousehold = (name: string): Promise<Household> =>
  apiFetch("/api/household", { method: "POST", body: JSON.stringify({ name }) });

export const joinHousehold = (inviteCode: string): Promise<Household> =>
  apiFetch("/api/household/join", { method: "POST", body: JSON.stringify({ inviteCode }) });
