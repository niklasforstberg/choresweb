import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { logout } from "../api/auth";
import { getMe } from "../api/users";
import NoHousehold from "../pages/NoHousehold";

export default function Layout() {
  const { t } = useTranslation();
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  return (
    <div className="layout">
      <header className="layout-header">
        <span className="brand">{t("common.appName")}</span>
        {me?.householdId != null && (
          <nav className="nav">
            <NavLink to="/" end>{t("nav.week")}</NavLink>
            <NavLink to="/household">{t("nav.household")}</NavLink>
          </nav>
        )}
        <button className="btn-ghost" onClick={logout}>
          <LogOut size={16} /> <span className="hide-narrow">{t("auth.logout")}</span>
        </button>
      </header>
      <main className="layout-main">
        {me && (me.householdId == null ? <NoHousehold /> : <Outlet />)}
      </main>
    </div>
  );
}
