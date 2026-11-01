import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "../api/auth";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login({ email, password });
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error && err.message !== "Unauthorized" ? err.message : t("auth.loginFailed"));
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="wordmark" data-text={t("common.appName")}>{t("common.appName")}</h1>
        <label>
          {t("auth.email")}
          <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          {t("auth.password")}
          <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy}>{t("auth.login")}</button>
        <p className="muted">{t("auth.noAccount")} <Link to="/register">{t("auth.register")}</Link></p>
      </form>
    </div>
  );
}
