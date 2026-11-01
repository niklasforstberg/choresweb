import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getHousehold } from "../api/household";
import { getChores, getCompletions } from "../api/chores";
import { addDays, mondayOf, toIsoDate } from "../lib/week";
import Summary from "../components/Summary";

// Whole weeks back to a Monday, this week included, so the weekly targets add up.
const PERIODS = [
  { weeks: 4, label: "history.weeks4" },
  { weeks: 13, label: "history.months3" },
  { weeks: 52, label: "history.months12" },
];

export default function History() {
  const { t, i18n } = useTranslation();
  const [weeks, setWeeks] = useState(PERIODS[0].weeks);

  const fromDate = addDays(mondayOf(new Date()), -7 * (weeks - 1));
  const from = toIsoDate(fromDate);
  const to = toIsoDate(new Date());

  const { data: household } = useQuery({ queryKey: ["household"], queryFn: getHousehold });
  const { data: chores } = useQuery({ queryKey: ["chores"], queryFn: getChores });
  const { data: completions } = useQuery({ queryKey: ["completions", from, to], queryFn: () => getCompletions(from, to) });

  if (!household || !chores || !completions) return null;

  const date = new Intl.DateTimeFormat(i18n.language, { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="stack">
      <h1>{t("history.title")}</h1>
      <div className="period-picker">
        {PERIODS.map(p => (
          <button key={p.weeks} className={p.weeks === weeks ? "btn-primary" : "btn-ghost"} onClick={() => setWeeks(p.weeks)}>
            {t(p.label)}
          </button>
        ))}
      </div>
      <p className="muted">{t("history.since", { date: date.format(fromDate) })}</p>

      {chores.length === 0 ? (
        <p className="muted">{t("week.noChores")}</p>
      ) : (
        <Summary chores={chores} members={household.members} completions={completions} weeks={weeks} />
      )}
    </div>
  );
}
