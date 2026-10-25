import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { logout } from "../api/auth";

export default function Layout() {
  const { t } = useTranslation();

  return (
    <div className="layout">
      <header className="layout-header">
        <span className="brand">{t("common.appName")}</span>
        <button className="btn-ghost" onClick={logout}>
          <LogOut size={16} /> {t("auth.logout")}
        </button>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
