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

// The three print inks, then what two of them make overprinted, each with the colour its letters are set in.
export interface MemberColor { ink: string; on: string }
const PALETTE: MemberColor[] = [
  { ink: "#e6007a", on: "#ffffff" }, // pink
  { ink: "#0a6cf0", on: "#ffffff" }, // blue
  { ink: "#ffd23f", on: "#1b2140" }, // yellow
  { ink: "#6b2fd0", on: "#ffffff" }, // pink over blue
  { ink: "#00875a", on: "#ffffff" }, // blue over yellow
  { ink: "#ff5a36", on: "#1b2140" }, // pink over yellow
  { ink: "#1b2140", on: "#ffffff" },
  { ink: "#0e8a9a", on: "#ffffff" },
];

export function memberColors(members: HouseholdMember[]): Map<number, MemberColor> {
  return new Map([...members].sort((a, b) => a.id - b.id).map((m, i) => [m.id, PALETTE[i % PALETTE.length]]));
}
