import { useEffect, useMemo, useRef } from "react";
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

export default function Week() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();

  const today = toIsoDate(new Date());
  const monday = mondayOf(params.get("week") ? parseIsoDate(params.get("week")!) : new Date());
  const weekStart = toIsoDate(monday);
  const weekEnd = toIsoDate(addDays(monday, 6));
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

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
  }, [loaded, weekStart]);

  if (!me || !household || !chores || !claims || !completions) return null;

  const goTo = (d: Date) => setParams(toIsoDate(mondayOf(d)) === toIsoDate(mondayOf(new Date())) ? {} : { week: toIsoDate(d) });
  const weekday = new Intl.DateTimeFormat(i18n.language, { weekday: "short" });

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
                    const onDay = (e: ChoreDayEntry) => e.choreId === chore.id && e.date === date;
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
                            <button className="chip-main" onClick={() => complete.mutate(e)} disabled={date > today} aria-label={t("week.markDone")}>
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
                    return (
                      <td key={date} className={date === today ? "today" : undefined}>
                        <div className="cell">
                          {completions.filter(onDay).map(e => chip(e, true))}
                          {claims.filter(onDay).map(e => chip(e, false))}
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

      <p className="muted legend">{t("week.legend")}</p>

      {chores.length > 0 && (
        <>
          <h2>{t("summary.title")}</h2>
          <Summary chores={chores} members={household.members} completions={completions} claims={claims} weeks={1} />
        </>
      )}
    </div>
  );
}
