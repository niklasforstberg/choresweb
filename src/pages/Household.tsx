import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { getHousehold } from "../api/household";
import { createChore, deleteChore, getChores, updateChore, type Chore } from "../api/chores";

const parseTarget = (s: string) => (s.trim() === "" ? null : Number(s));

function ChoreRow({ chore, onMove, first, last }: { chore: Chore; onMove: (dir: -1 | 1) => void; first: boolean; last: boolean }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [name, setName] = useState(chore.name);
  const [target, setTarget] = useState(chore.weeklyTarget?.toString() ?? "");

  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ["chores"] });
  const save = useMutation({ mutationFn: () => updateChore(chore.id, { ...chore, name, weeklyTarget: parseTarget(target) }), onSuccess });
  const remove = useMutation({ mutationFn: () => deleteChore(chore.id), onSuccess });

  const dirty = name !== chore.name || parseTarget(target) !== chore.weeklyTarget;

  return (
    <li className="chore-row">
      <form className="chore-form" onSubmit={e => { e.preventDefault(); save.mutate(); }}>
        <input value={name} onChange={e => setName(e.target.value)} required aria-label={t("household.choreName")} />
        <input className="target-input" type="number" min={1} value={target} onChange={e => setTarget(e.target.value)}
          placeholder="–" aria-label={t("household.weeklyTarget")} />
        {dirty && <button className="btn-primary" type="submit" disabled={save.isPending}>{t("common.save")}</button>}
      </form>
      <div className="row-actions">
        <button className="btn-icon" disabled={first} onClick={() => onMove(-1)} aria-label={t("household.moveUp")}><ArrowUp size={16} /></button>
        <button className="btn-icon" disabled={last} onClick={() => onMove(1)} aria-label={t("household.moveDown")}><ArrowDown size={16} /></button>
        <button className="btn-icon" aria-label={t("household.deleteChore")}
          onClick={() => { if (window.confirm(t("household.confirmDelete", { name: chore.name }))) remove.mutate(); }}>
          <Trash2 size={16} />
        </button>
      </div>
      {(save.error ?? remove.error) && <p className="error">{(save.error ?? remove.error)!.message}</p>}
    </li>
  );
}

export default function Household() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: household } = useQuery({ queryKey: ["household"], queryFn: getHousehold });
  const { data: chores } = useQuery({ queryKey: ["chores"], queryFn: getChores });
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ["chores"] });
  const add = useMutation({
    mutationFn: () => createChore({
      name,
      weeklyTarget: parseTarget(target),
      sortOrder: Math.max(-1, ...(chores ?? []).map(c => c.sortOrder)) + 1,
    }),
    onSuccess: () => { setName(""); setTarget(""); onSuccess(); },
  });
  // Rewrites every position, so chores that share a sort order end up in a definite one.
  const move = useMutation({
    mutationFn: async ({ index, dir }: { index: number; dir: -1 | 1 }) => {
      const order = [...chores!];
      [order[index], order[index + dir]] = [order[index + dir], order[index]];
      await Promise.all(order.map((c, i) => c.sortOrder === i ? null : updateChore(c.id, { ...c, sortOrder: i })));
    },
    onSuccess,
  });

  if (!household || !chores) return null;

  return (
    <div className="stack">
      <h1>{household.name}</h1>

      <section className="card stack">
        <h2>{t("household.members")}</h2>
        <ul className="plain-list">
          {household.members.map(m => <li key={m.id}>{m.name}</li>)}
        </ul>
        <p className="muted">{t("household.inviteHelp")}</p>
        <p className="invite-code">{household.inviteCode}</p>
      </section>

      <section className="card stack">
        <h2>{t("household.chores")}</h2>
        <p className="muted">{t("household.choresHelp")}</p>
        <ul className="plain-list chore-list">
          {chores.map((c, i) => (
            <ChoreRow key={c.id} chore={c} first={i === 0} last={i === chores.length - 1}
              onMove={dir => move.mutate({ index: i, dir })} />
          ))}
        </ul>
        <form className="chore-form" onSubmit={e => { e.preventDefault(); add.mutate(); }}>
          <input value={name} onChange={e => setName(e.target.value)} required placeholder={t("household.choreName")} />
          <input className="target-input" type="number" min={1} value={target} onChange={e => setTarget(e.target.value)}
            placeholder={t("household.weeklyTargetShort")} aria-label={t("household.weeklyTarget")} />
          <button className="btn-primary" type="submit" disabled={add.isPending}>{t("household.addChore")}</button>
        </form>
        {(add.error ?? move.error) && <p className="error">{(add.error ?? move.error)!.message}</p>}
      </section>
    </div>
  );
}
