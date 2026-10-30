import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { register } from "../api/auth";

export default function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register({ email, password, name });
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{t("auth.register")}</h1>
        <label>
          {t("auth.name")}
          <input autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          {t("auth.email")}
          <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          {t("auth.password")}
          <input type="password" autoComplete="new-password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy}>{t("auth.register")}</button>
        <p className="muted">{t("auth.haveAccount")} <Link to="/">{t("auth.login")}</Link></p>
      </form>
    </div>
  );
}
