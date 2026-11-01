import { useLocation } from "react-router-dom";
import { getToken } from "../api/client";
import Login from "../pages/Login";
import Landing from "../pages/Landing";

// Visitors who aren't logged in get the landing page at the root and the login form anywhere else.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  if (!getToken()) return pathname === "/" ? <Landing /> : <Login />;
  return <>{children}</>;
}
