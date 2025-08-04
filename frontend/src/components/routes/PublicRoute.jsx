import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { redirectByRole } from "@/utils/roles";

export default function PublicRoute({ children }) {
  const { isAuthenticated, sessionChecked, role } = useAuth();

  if (!sessionChecked) return null;

  return isAuthenticated ? (
    <Navigate
      to={redirectByRole(role)}
      replace
    />
  ) : (
    children
  );
}
