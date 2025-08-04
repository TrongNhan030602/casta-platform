// 📁 hooks/useAuth.js
import { useSelector, shallowEqual } from "react-redux";

export default function useAuth() {
  const { user, isAuthenticated, sessionChecked, loading, error } = useSelector(
    (state) => state.auth,
    shallowEqual
  );

  const role = user?.role || null;

  return {
    user,
    isAuthenticated,
    sessionChecked,
    loading,
    error,
    role,
  };
}
