import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { changePassword, deleteAccount, getMe, updateColor, updateProfile, type UserMe } from "../api/users";
import { clearToken } from "../api/client";
import { getHousehold } from "../api/household";
import { PALETTE, memberColorKeys, memberLabels } from "../lib/members";

function ProfileForm({ me }: { me: UserMe }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [name, setName] = useState(me.name);
  const [email, setEmail] = useState(me.email);
  const [password, setPassword] = useState("");

  const emailChanged = email.trim() !== me.email;
  const save = useMutation({
    mutationFn: () => updateProfile({ name, email, currentPassword: emailChanged ? password : undefined }),
    onSuccess: updated => {
      queryClient.setQueryData(["me"], updated);
      queryClient.invalidateQueries({ queryKey: ["household"] }); // the member list shows names
      setPassword("");
    },
  });

  return (
    <form className="card stack" onSubmit={e => { e.preventDefault(); save.mutate(); }}>
      <h2>{t("account.profile")}</h2>
      <label>
        {t("auth.name")}
        <input autoComplete="given-name" value={name} onChange={e => { setName(e.target.value); save.reset(); }} required />
      </label>
      <label>
        {t("auth.email")}
        <input type="email" autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); save.reset(); }} required />
      </label>
      {emailChanged && (
        <label>
          {t("account.currentPassword")}
          <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
          <span className="muted hint">{t("account.emailNeedsPassword")}</span>
        </label>
      )}
      {save.error && <p className="error">{save.error.message}</p>}
      {save.isSuccess && <p className="success">{t("account.saved")}</p>}
      <button className="btn-primary" type="submit" disabled={save.isPending}>{t("common.save")}</button>
    </form>
  );
}

function PasswordForm() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [mismatch, setMismatch] = useState(false);

  const save = useMutation({
    mutationFn: () => changePassword(current, next),
    onSuccess: () => { setCurrent(""); setNext(""); setRepeat(""); },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMismatch(next !== repeat);
    if (next === repeat) save.mutate();
  }

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <h2>{t("account.changePassword")}</h2>
      <label>
        {t("account.currentPassword")}
        <input type="password" autoComplete="current-password" value={current} onChange={e => { setCurrent(e.target.value); save.reset(); }} required />
      </label>
      <label>
        {t("account.newPassword")}
        <input type="password" autoComplete="new-password" minLength={8} value={next} onChange={e => { setNext(e.target.value); save.reset(); }} required />
      </label>
      <label>
        {t("account.repeatPassword")}
        <input type="password" autoComplete="new-password" minLength={8} value={repeat} onChange={e => { setRepeat(e.target.value); save.reset(); }} required />
      </label>
      {mismatch && <p className="error">{t("account.passwordMismatch")}</p>}
      {save.error && <p className="error">{save.error.message}</p>}
      {save.isSuccess && <p className="success">{t("account.passwordChanged")}</p>}
      <button className="btn-primary" type="submit" disabled={save.isPending}>{t("account.changePassword")}</button>
    </form>
  );
}

// A colour shown for someone else, chosen or handed out, isn't offered: picking it would change theirs.
function ColorPicker({ me }: { me: UserMe }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: household } = useQuery({ queryKey: ["household"], queryFn: getHousehold, enabled: me.householdId != null });
  const save = useMutation({
    mutationFn: updateColor,
    onSuccess: updated => {
      queryClient.setQueryData(["me"], updated);
      queryClient.invalidateQueries({ queryKey: ["household"] });
    },
  });

  const members = household?.members ?? [];
  const keys = memberColorKeys(members);
  const labels = memberLabels(members);
  const current = keys.get(me.id) ?? me.color;
  const owners = new Map(members.filter(m => m.id !== me.id).map(m => [keys.get(m.id)!, m]));

  return (
    <section className="card stack">
      <h2>{t("account.color")}</h2>
      <p className="muted">{t("account.colorHelp")}</p>
      <div className="swatches" role="radiogroup" aria-label={t("account.color")}>
        {Object.entries(PALETTE).map(([key, c]) => {
          const owner = owners.get(key);
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={current === key}
              className={`swatch${current === key ? " current" : ""}`}
              style={{ background: c.ink, color: c.on }}
              disabled={owner != null || save.isPending}
              aria-label={owner ? t("account.colorTaken", { color: t(`colors.${key}`), name: owner.name }) : t(`colors.${key}`)}
              title={owner ? t("account.colorTaken", { color: t(`colors.${key}`), name: owner.name }) : t(`colors.${key}`)}
              onClick={() => save.mutate(key)}
            >
              {current === key ? <Check size={20} /> : owner && labels.get(owner.id)}
            </button>
          );
        })}
      </div>
      {me.color && (
        <button className="btn-ghost swatch-auto" type="button" onClick={() => save.mutate(null)} disabled={save.isPending}>
          {t("account.colorAuto")}
        </button>
      )}
      {save.error && <p className="error">{save.error.message}</p>}
    </section>
  );
}

function DeleteAccount() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const remove = useMutation({
    mutationFn: () => deleteAccount(password),
    onSuccess: () => { clearToken(); window.location.href = "/"; },
  });

  return (
    <section className="card stack">
      <h2>{t("account.deleteTitle")}</h2>
      <p className="muted">{t("account.deleteText")}</p>
      {open ? (
        <form className="stack" onSubmit={e => { e.preventDefault(); remove.mutate(); }}>
          <label>
            {t("account.deletePassword")}
            <input type="password" autoComplete="current-password" value={password}
              onChange={e => { setPassword(e.target.value); remove.reset(); }} required autoFocus />
          </label>
          {remove.error && <p className="error">{remove.error.message}</p>}
          <div className="row-actions">
            <button className="btn-danger" type="submit" disabled={remove.isPending}>{t("account.deleteConfirm")}</button>
            <button className="btn-ghost" type="button" onClick={() => { setOpen(false); setPassword(""); remove.reset(); }}>
              {t("account.deleteCancel")}
            </button>
          </div>
        </form>
      ) : (
        <button className="btn-ghost delete-open" type="button" onClick={() => setOpen(true)}>{t("account.deleteTitle")}</button>
      )}
    </section>
  );
}

export default function Account() {
  const { t } = useTranslation();
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  if (!me) return null;

  return (
    <div className="stack">
      <h1>{t("menu.account")}</h1>
      <div className="cards">
        <ProfileForm me={me} />
        <ColorPicker me={me} />
        <PasswordForm />
        <DeleteAccount />
      </div>
    </div>
  );
}
