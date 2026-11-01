import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getMe } from "../api/users";
import NoHousehold from "../pages/NoHousehold";
import UserMenu from "./UserMenu";

export default function Layout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  return (
    <div className="layout">
      <header className="layout-header">
        <span className="brand">{t("common.appName")}</span>
        {me?.householdId != null && (
          <nav className="nav">
            <NavLink to="/" end>{t("nav.week")}</NavLink>
            <NavLink to="/history">{t("nav.history")}</NavLink>
            <NavLink to="/household">{t("nav.household")}</NavLink>
          </nav>
        )}
        <UserMenu />
      </header>
      <main className="layout-main">
        {/* The account page is reachable before joining a household; nothing else is. */}
        {me && (me.householdId == null && pathname !== "/account" ? <NoHousehold /> : <Outlet />)}
      </main>
    </div>
  );
}
