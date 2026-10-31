import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { changePassword, getMe, updateProfile, type UserMe } from "../api/users";

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

export default function Account() {
  const { t } = useTranslation();
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  if (!me) return null;

  return (
    <div className="stack">
      <h1>{t("menu.account")}</h1>
      <div className="cards">
        <ProfileForm me={me} />
        <PasswordForm />
      </div>
    </div>
  );
}
