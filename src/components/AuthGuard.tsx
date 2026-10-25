import { getToken } from "../api/client";
import Login from "../pages/Login";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Login />;
  return <>{children}</>;
}
