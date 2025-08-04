// components/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function PrivateRoute({ allowedRoles }) {
  const { user, isAuthenticated, sessionChecked } = useAuth();

  if (!sessionChecked) return null; // hoặc <LoadingScreen />

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ✅ So sánh không phân biệt hoa thường
  const userRole = user?.role?.toUpperCase?.();
  const normalizedAllowedRoles = allowedRoles?.map((role) =>
    role.toUpperCase()
  );

  if (allowedRoles && !normalizedAllowedRoles.includes(userRole)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}
