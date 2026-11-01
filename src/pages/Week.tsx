import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { getMe } from "../api/users";
import { getHousehold } from "../api/household";
import {
  completeClaim, createClaim, createCompletion, deleteClaim, deleteCompletion, getChores, getClaims, getCompletions, type ChoreDayEntry,
} from "../api/chores";
import { addDays, isoWeekNumber, mondayOf, parseIsoDate, toIsoDate } from "../lib/week";
import { memberColors, memberLabels } from "../lib/members";
import Summary from "../components/Summary";

// The grid needs room for seven columns; narrower screens get one day at a time instead.
const NARROW = window.matchMedia("(max-width: 700px)");
const useNarrow = () => useSyncExternalStore(cb => { NARROW.addEventListener("change", cb); return () => NARROW.removeEventListener("change", cb); }, () => NARROW.matches);

export default function Week() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();

  const today = toIsoDate(new Date());
  const monday = mondayOf(params.get("week") ? parseIsoDate(params.get("week")!) : new Date());
  const weekStart = toIsoDate(monday);
  const weekEnd = toIsoDate(addDays(monday, 6));
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const narrow = useNarrow();

  // The day shown on a narrow screen: the one picked in this week, else today, else Monday.
  const [picked, setPicked] = useState(today);
  const inWeek = (date: string) => date >= weekStart && date <= weekEnd;
  const day = inWeek(picked) ? picked : inWeek(today) ? today : weekStart;

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });
  const { data: household } = useQuery({ queryKey: ["household"], queryFn: getHousehold });
  const { data: chores } = useQuery({ queryKey: ["chores"], queryFn: getChores });
  const { data: claims } = useQuery({ queryKey: ["claims", weekStart, weekEnd], queryFn: () => getClaims(weekStart, weekEnd) });
  const { data: completions } = useQuery({ queryKey: ["completions", weekStart, weekEnd], queryFn: () => getCompletions(weekStart, weekEnd) });

  const labels = useMemo(() => memberLabels(household?.members ?? []), [household]);
  const colors = useMemo(() => memberColors(household?.members ?? []), [household]);
  const names = useMemo(() => new Map(household?.members.map(m => [m.id, m.name])), [household]);

  // Completions also feed the history page, so refresh every period, not just this week.
  const onSuccess = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["claims"] }),
    queryClient.invalidateQueries({ queryKey: ["completions"] }),
  ]);
  // On a day that has passed there is nothing left to plan; + logs the chore as done instead.
  const add = useMutation({
    mutationFn: (v: { choreId: number; date: string }) => (v.date < today ? createCompletion : createClaim)(v.choreId, v.date),
    onSuccess,
  });
  const complete = useMutation({ mutationFn: (c: ChoreDayEntry) => completeClaim(c.id), onSuccess });
  const unclaim = useMutation({ mutationFn: (c: ChoreDayEntry) => deleteClaim(c.id), onSuccess });
  const uncomplete = useMutation({ mutationFn: (c: ChoreDayEntry) => deleteCompletion(c.id), onSuccess });
  const error = add.error ?? complete.error ?? unclaim.error ?? uncomplete.error;

  // On a narrow screen only a few days fit; start with today in view rather than Monday.
  const gridRef = useRef<HTMLDivElement>(null);
  const loaded = !!(me && household && chores && claims && completions);
  useEffect(() => {
    const grid = gridRef.current;
    const todayCell = grid?.querySelector<HTMLElement>("thead th.today");
    const nameCell = grid?.querySelector<HTMLElement>("thead th");
    if (grid && todayCell && nameCell) grid.scrollLeft = todayCell.offsetLeft - nameCell.offsetWidth;
  }, [loaded, weekStart, narrow]);

  if (!me || !household || !chores || !claims || !completions) return null;

  const goTo = (d: Date) => setParams(toIsoDate(mondayOf(d)) === toIsoDate(mondayOf(new Date())) ? {} : { week: toIsoDate(d) });
  const weekday = new Intl.DateTimeFormat(i18n.language, { weekday: "short" });

  const onDay = (choreId: number, date: string) => (e: ChoreDayEntry) => e.choreId === choreId && e.date === date;
  const chip = (e: ChoreDayEntry, done: boolean) => {
    const own = e.userId === me.id;
    return (
      <span
        key={`${done ? "done" : "claim"}-${e.id}`}
        className={`chip${done ? " done" : ""}`}
        style={{ "--chip": colors.get(e.userId) } as React.CSSProperties}
        title={`${names.get(e.userId)} – ${t(done ? "week.done" : "week.planned")}`}
      >
        {own && !done ? (
          <button className="chip-main" onClick={() => complete.mutate(e)} disabled={e.date > today} aria-label={t("week.markDone")}>
            {labels.get(e.userId)}
          </button>
        ) : (
          <span className="chip-main">{labels.get(e.userId)}{done && <Check size={12} />}</span>
        )}
        {own && (
          <button className="chip-remove" onClick={() => (done ? uncomplete : unclaim).mutate(e)} aria-label={t("week.remove")}>
            <X size={12} />
          </button>
        )}
      </span>
    );
  };
  const chips = (choreId: number, date: string) => [
    ...completions.filter(onDay(choreId, date)).map(e => chip(e, true)),
    ...claims.filter(onDay(choreId, date)).map(e => chip(e, false)),
  ];

  return (
    <div className="stack">
      <div className="week-header">
        <button className="btn-icon" onClick={() => goTo(addDays(monday, -7))} aria-label={t("week.previous")}><ChevronLeft size={18} /></button>
        <h1>{t("week.title", { number: isoWeekNumber(monday) })}</h1>
        <button className="btn-icon" onClick={() => goTo(addDays(monday, 7))} aria-label={t("week.next")}><ChevronRight size={18} /></button>
        {params.has("week") && <button className="btn-ghost" onClick={() => goTo(new Date())}>{t("week.thisWeek")}</button>}
      </div>

      {error && <p className="error">{error.message}</p>}

      {chores.length === 0 ? (
        <p className="muted">{t("week.noChores")}</p>
      ) : narrow ? (
        <>
          <div className="day-strip">
            {days.map(d => {
              const date = toIsoDate(d);
              return (
                <button
                  key={date}
                  className={`day-tab${date === day ? " selected" : ""}${date === today ? " today" : ""}`}
                  onClick={() => setPicked(date)}
                  aria-pressed={date === day}
                >
                  <span className="weekday">{weekday.format(d)}</span>
                  <span>{d.getDate()}</span>
                </button>
              );
            })}
          </div>
          <ul className="day-list">
            {chores.map(chore => {
              const myClaim = claims.find(e => onDay(chore.id, day)(e) && e.userId === me.id);
              const myDone = completions.filter(e => e.choreId === chore.id && e.userId === me.id).length;
              // Done only once the day has come: by ticking off my claim, or straight away on a day that has passed.
              const canDo = myClaim ? day <= today : day < today;
              return (
                <li key={chore.id} className="day-row">
                  <div className="day-row-main">
                    <div className="day-row-title">
                      <span className="chore-title">{chore.name}</span>
                      {chore.weeklyTarget != null && (
                        <span className={`muted${myDone >= chore.weeklyTarget ? " reached" : ""}`}>
                          {t("week.myWeek", { done: myDone, target: chore.weeklyTarget })}
                        </span>
                      )}
                    </div>
                    <div className="cell">{chips(chore.id, day)}</div>
                  </div>
                  {canDo ? (
                    <button className="btn-primary day-action" onClick={() => (myClaim ? complete.mutate(myClaim) : add.mutate({ choreId: chore.id, date: day }))}>
                      {t("week.doneShort")}
                    </button>
                  ) : (
                    <button className="btn-ghost day-action" onClick={() => add.mutate({ choreId: chore.id, date: day })}>
                      {t("week.add")}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="grid-scroll" ref={gridRef}>
          <table className="week-grid">
            <thead>
              <tr>
                <th />
                {days.map(d => (
                  <th key={d.getTime()} className={toIsoDate(d) === today ? "today" : undefined}>
                    <span className="weekday">{weekday.format(d)}</span> <span className="muted">{d.getDate()}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chores.map(chore => (
                <tr key={chore.id}>
                  <th scope="row" className="chore-name">
                    {chore.name}
                    {chore.weeklyTarget != null && <span className="muted"> ×{chore.weeklyTarget}</span>}
                  </th>
                  {days.map(d => {
                    const date = toIsoDate(d);
                    return (
                      <td key={date} className={date === today ? "today" : undefined}>
                        <div className="cell">
                          {chips(chore.id, date)}
                          <button className="cell-add" onClick={() => add.mutate({ choreId: chore.id, date })} aria-label={t(date < today ? "week.addDone" : "week.add")}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="muted legend">{t(narrow ? "week.legendDay" : "week.legend")}</p>

      {chores.length > 0 && (
        <>
          <h2>{t("summary.title")}</h2>
          <Summary chores={chores} members={household.members} completions={completions} claims={claims} weeks={1} />
        </>
      )}
    </div>
  );
}
