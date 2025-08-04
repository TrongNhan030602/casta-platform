// src/routes/enterpriseRoutes.js
import PrivateRoute from "@/components/routes/PrivateRoute";
import EnterpriseLayout from "@/layout/Enterprise/EnterpriseLayout";

import EnterpriseDashboard from "@/containers/Enterprises/Dashboard";
import ProductList from "@/containers/Enterprises/Products/ProductList";
import ProductDetailPage from "@/containers/Enterprises/Products/ProductDetailPage";
import ProductCreatePage from "@/containers/Enterprises/Products/ProductCreatePage";
import ProductEditPage from "@/containers/Enterprises/Products/ProductEditPage";
import OrderList from "@/containers/Enterprises/Orders/OrderList";
import EnterpriseProfile from "@/containers/Enterprises/Profile/EnterpriseProfilePage";
import EnterpriseAccountPage from "@/containers/Enterprises/Account/EnterpriseAccountPage";
import ExhibitionSpaceList from "@/containers/Enterprises/ExhibitionSpace/ExhibitionSpaceList";
import ExhibitionSpaceDetail from "@/containers/Enterprises/ExhibitionSpace/ExhibitionSpaceDetail";
import SetupExhibitionPage from "@/containers/Enterprises/ExhibitionSpace/SetupExhibitionPage";
export const enterpriseRoutes = [
  {
    element: <PrivateRoute allowedRoles={["DN", "NVDN"]} />,
    children: [
      {
        path: "/enterprise",
        element: <EnterpriseLayout />,
        children: [
          { index: true, element: <EnterpriseDashboard /> },
          {
            path: "exhibition-spaces",
            element: <ExhibitionSpaceList />,
          },
          {
            path: "exhibition-spaces/:id",
            element: <ExhibitionSpaceDetail />,
          },

          {
            path: "setup-exhibition/:contractId",
            element: <SetupExhibitionPage />,
          },

          { path: "products", element: <ProductList /> },
          { path: "products/:id", element: <ProductDetailPage /> },
          { path: "products/create", element: <ProductCreatePage /> },
          { path: "products/:id/edit", element: <ProductEditPage /> },
          { path: "orders", element: <OrderList /> },
          { path: "profile", element: <EnterpriseProfile /> },
          { path: "account", element: <EnterpriseAccountPage /> },
        ],
      },
    ],
  },
];
