import { Routes, Route } from "react-router-dom";
import {
  authRoutes,
  adminRoutes,
  customerRoutes,
  enterpriseRoutes,
} from "@/routes/roles";

// ✅ Đệ quy để hiển thị route nhiều cấp
const renderRoute = (route, index) => {
  if (route.children) {
    return (
      <Route
        key={index}
        path={route.path}
        element={route.element}
        index={route.index}
      >
        {route.children.map((child, i) => renderRoute(child, i))}
      </Route>
    );
  }

  return (
    <Route
      key={index}
      path={route.path}
      element={route.element}
      index={route.index}
    />
  );
};

const allRoutes = [
  ...authRoutes,
  ...adminRoutes,
  ...customerRoutes,
  ...enterpriseRoutes,
];

const AppRoutes = () => {
  return <Routes>{allRoutes.map(renderRoute)}</Routes>;
};

export default AppRoutes;
