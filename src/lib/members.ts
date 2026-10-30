import type { HouseholdMember } from "../api/household";

// The paper sheet marks entries with initials. Where two members share one,
// both get their first two letters instead.
export function memberLabels(members: HouseholdMember[]): Map<number, string> {
  const initial = (m: HouseholdMember) => m.name.charAt(0).toUpperCase();
  const counts = new Map<string, number>();
  for (const m of members) counts.set(initial(m), (counts.get(initial(m)) ?? 0) + 1);

  return new Map(members.map(m => [
    m.id,
    counts.get(initial(m))! > 1 ? initial(m) + m.name.charAt(1).toLowerCase() : initial(m),
  ]));
}

const PALETTE = ["#2a6f97", "#b5523b", "#5a8f3d", "#8e5ba8", "#c08a1e", "#3d8f8a", "#a8456b", "#5c6b7a"];

export function memberColors(members: HouseholdMember[]): Map<number, string> {
  return new Map([...members].sort((a, b) => a.id - b.id).map((m, i) => [m.id, PALETTE[i % PALETTE.length]]));
}
