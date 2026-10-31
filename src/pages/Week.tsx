import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { getMe } from "../api/users";
import { getHousehold } from "../api/household";
import { createEntry, deleteEntry, getChores, getEntries, setEntryCompleted, type ChoreEntry } from "../api/chores";
import { addDays, isoWeekNumber, mondayOf, parseIsoDate, toIsoDate } from "../lib/week";
import { memberColors, memberLabels } from "../lib/members";

export default function Week() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();

  const today = toIsoDate(new Date());
  const monday = mondayOf(params.get("week") ? parseIsoDate(params.get("week")!) : new Date());
  const weekStart = toIsoDate(monday);
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });
  const { data: household } = useQuery({ queryKey: ["household"], queryFn: getHousehold });
  const { data: chores } = useQuery({ queryKey: ["chores"], queryFn: getChores });
  const { data: entries } = useQuery({ queryKey: ["entries", weekStart], queryFn: () => getEntries(weekStart) });

  const labels = useMemo(() => memberLabels(household?.members ?? []), [household]);
  const colors = useMemo(() => memberColors(household?.members ?? []), [household]);
  const names = useMemo(() => new Map(household?.members.map(m => [m.id, m.name])), [household]);

  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ["entries", weekStart] });
  const add = useMutation({ mutationFn: (v: { choreId: number; date: string }) => createEntry(v.choreId, v.date), onSuccess });
  const toggle = useMutation({ mutationFn: (e: ChoreEntry) => setEntryCompleted(e.id, !e.completed), onSuccess });
  const remove = useMutation({ mutationFn: (e: ChoreEntry) => deleteEntry(e.id), onSuccess });
  const error = add.error ?? toggle.error ?? remove.error;

  // On a narrow screen only a few days fit; start with today in view rather than Monday.
  const gridRef = useRef<HTMLDivElement>(null);
  const loaded = !!(me && household && chores && entries);
  useEffect(() => {
    const grid = gridRef.current;
    const todayCell = grid?.querySelector<HTMLElement>("thead th.today");
    const nameCell = grid?.querySelector<HTMLElement>("thead th");
    if (grid && todayCell && nameCell) grid.scrollLeft = todayCell.offsetLeft - nameCell.offsetWidth;
  }, [loaded, weekStart]);

  if (!me || !household || !chores || !entries) return null;

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
                <th className="mine">{t("week.mine")}</th>
              </tr>
            </thead>
            <tbody>
              {chores.map(chore => {
                const mine = entries.filter(e => e.choreId === chore.id && e.userId === me.id);
                const done = mine.filter(e => e.completed).length;
                const planned = mine.length - done;
                const reached = chore.weeklyTarget != null && done >= chore.weeklyTarget;

                return (
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
                            {entries.filter(e => e.choreId === chore.id && e.date === date).map(e => {
                              const own = e.userId === me.id;
                              const title = `${names.get(e.userId)} – ${t(e.completed ? "week.done" : "week.planned")}`;
                              return (
                                <span
                                  key={e.id}
                                  className={`chip${e.completed ? " done" : ""}`}
                                  style={{ "--chip": colors.get(e.userId) } as React.CSSProperties}
                                  title={title}
                                >
                                  {own ? (
                                    <>
                                      <button className="chip-main" onClick={() => toggle.mutate(e)} disabled={!e.completed && date > today} aria-label={t(e.completed ? "week.markPlanned" : "week.markDone")}>
                                        {labels.get(e.userId)}{e.completed && <Check size={12} />}
                                      </button>
                                      {!e.completed && (
                                        <button className="chip-remove" onClick={() => remove.mutate(e)} aria-label={t("week.remove")}><X size={12} /></button>
                                      )}
                                    </>
                                  ) : (
                                    <span className="chip-main">{labels.get(e.userId)}</span>
                                  )}
                                </span>
                              );
                            })}
                            {date >= today && (
                              <button className="cell-add" onClick={() => add.mutate({ choreId: chore.id, date })} aria-label={t("week.add")}>
                                <Plus size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className={`mine${reached ? " reached" : ""}`}>
                      {done}{chore.weeklyTarget != null && `/${chore.weeklyTarget}`}
                      {planned > 0 && <span className="muted"> +{planned}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="muted legend">{t("week.legend")}</p>
    </div>
  );
}
