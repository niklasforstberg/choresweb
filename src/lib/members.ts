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
// The keys are what the API stores as a member's chosen colour.
export interface MemberColor { ink: string; on: string }
export const PALETTE: Record<string, MemberColor> = {
  pink:   { ink: "#e6007a", on: "#ffffff" },
  blue:   { ink: "#0a6cf0", on: "#ffffff" },
  yellow: { ink: "#ffd23f", on: "#1b2140" },
  purple: { ink: "#6b2fd0", on: "#ffffff" }, // pink over blue
  green:  { ink: "#00875a", on: "#ffffff" }, // blue over yellow
  orange: { ink: "#ff5a36", on: "#1b2140" }, // pink over yellow
  navy:   { ink: "#1b2140", on: "#ffffff" },
  teal:   { ink: "#0e8a9a", on: "#ffffff" },
};

// Members keep the colour they chose. The rest keep their place in the palette, by joining order,
// and only move on to a free colour when someone has chosen theirs; so one member choosing
// doesn't shuffle everyone else.
export function memberColorKeys(members: HouseholdMember[]): Map<number, string> {
  const keys = Object.keys(PALETTE);
  const chosen = (m: HouseholdMember) => (m.color != null && m.color in PALETTE ? m.color : null);
  const used = new Set(members.map(chosen).filter(c => c != null));
  return new Map([...members].sort((a, b) => a.id - b.id).map((m, i) => {
    const own = chosen(m);
    if (own) return [m.id, own];
    const key = [keys[i % keys.length], ...keys].find(k => !used.has(k)) ?? keys[i % keys.length];
    used.add(key);
    return [m.id, key];
  }));
}

export function memberColors(members: HouseholdMember[]): Map<number, MemberColor> {
  return new Map([...memberColorKeys(members)].map(([id, key]) => [id, PALETTE[key]]));
}
