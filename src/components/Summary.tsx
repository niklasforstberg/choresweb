import { useTranslation } from "react-i18next";
import type { Chore, ChoreDayEntry } from "../api/chores";
import type { HouseholdMember } from "../api/household";

interface Props {
  chores: Chore[];
  members: HouseholdMember[];
  completions: ChoreDayEntry[];
  claims?: ChoreDayEntry[];
  weeks: number; // the target is per week, so it scales with the period
}

// Done per member and chore, against the weekly target for the period, plus how many are still planned.
export default function Summary({ chores, members, completions, claims = [], weeks }: Props) {
  const { t } = useTranslation();
  const count = (list: ChoreDayEntry[], userId: number, choreId?: number) =>
    list.filter(e => e.userId === userId && (choreId == null || e.choreId === choreId)).length;

  return (
    <div className="grid-scroll">
      <table className="summary">
        <thead>
          <tr>
            <th />
            {members.map(m => <th key={m.id}>{m.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {chores.map(chore => {
            const target = chore.weeklyTarget != null ? chore.weeklyTarget * weeks : null;
            return (
              <tr key={chore.id}>
                <th scope="row">{chore.name}</th>
                {members.map(m => {
                  const done = count(completions, m.id, chore.id);
                  const planned = count(claims, m.id, chore.id);
                  return (
                    <td key={m.id} className={target != null && done >= target ? "reached" : undefined}>
                      {done}{target != null && `/${target}`}
                      {planned > 0 && <span className="muted"> +{planned}</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">{t("summary.total")}</th>
            {members.map(m => <td key={m.id}>{count(completions, m.id)}</td>)}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
