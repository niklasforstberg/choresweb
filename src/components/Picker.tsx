import type { ReactNode } from "react";

interface Props {
  className?: string;
  label: string;
  options: { value: string; label: string }[];
  onPick: (value: string) => void;
  children: ReactNode;
}

// Looks like a button but opens the platform's own picker: a transparent <select> lies on top,
// so the list is never clipped by the scrolling grid and phones show their native sheet.
export default function Picker({ className = "", label, options, onPick, children }: Props) {
  return (
    <span className={`picker ${className}`}>
      {children}
      <select value="" aria-label={label} onChange={e => onPick(e.target.value)}>
        <option value="" disabled hidden>{label}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </span>
  );
}
