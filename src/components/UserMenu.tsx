import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { LogOut, UserRound } from "lucide-react";
import { logout } from "../api/auth";
import { getMe } from "../api/users";

export default function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-menu-btn" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-haspopup="menu"
        aria-label={t("menu.open")} title={me?.email}>
        {me?.name.charAt(0).toUpperCase() ?? "?"}
      </button>
      {open && (
        <div className="user-dropdown" role="menu">
          {me && (
            <div className="user-dropdown-header">
              <strong>{me.name}</strong>
              <span className="muted">{me.email}</span>
            </div>
          )}
          <button className="user-dropdown-item" role="menuitem" onClick={() => { setOpen(false); navigate("/account"); }}>
            <UserRound size={15} /> {t("menu.account")}
          </button>
          <button className="user-dropdown-item" role="menuitem" onClick={logout}>
            <LogOut size={15} /> {t("auth.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
