// 📁 src/routes/customerRoutes.js
import CustomerHome from "@/containers/Customers/Home";
import PrivateRoute from "@/components/routes/PrivateRoute";

export const customerRoutes = [
  {
    element: <PrivateRoute allowedRoles={["KH"]} />,
    children: [{ path: "/customer", element: <CustomerHome /> }],
  },
];
