import AdminLayout from "@/layout/Admin/AdminLayout";
import PrivateRoute from "@/components/routes/PrivateRoute";
import AdminDashboard from "@/containers/Admin/Dashboard";
import AccountPage from "@/containers/Admin/AccountPage";
import ChangePasswordPage from "@/containers/Admin/ChangePasswordPage";
import UserList from "@/containers/Admin/Users/UserList";
import UserCreatePage from "@/containers/Admin/Users/UserCreatePage";
import UserEditPage from "@/containers/Admin/Users/UserEditPage";
import ViolationList from "@/containers/Admin/Violations/ViolationList";
import UserDetailPage from "@/containers/Admin/Users/UserDetailPage";
import EnterpriseList from "@/containers/Admin/Enterprises/EnterpriseList";
import EnterpriseDetailPage from "@/containers/Admin/Enterprises/EnterpriseDetailPage";
import ExhibitionSpaceCategoryList from "@/containers/Admin/ExhibitionSpaces/Categories/ExhibitionSpaceCategoryList";
import ExhibitionSpaceCategoryCreatePage from "@/containers/Admin/ExhibitionSpaces/Categories/ExhibitionSpaceCategoryCreatePage";
import ExhibitionSpaceCategoryEditPage from "@/containers/Admin/ExhibitionSpaces/Categories/ExhibitionSpaceCategoryEditPage";
import ExhibitionSpaceList from "@/containers/Admin/ExhibitionSpaces/ExhibitionSpace/ExhibitionSpaceList";
import ExhibitionSpaceCreatePage from "@/containers/Admin/ExhibitionSpaces/ExhibitionSpace/ExhibitionSpaceCreatePage";
import ExhibitionSpaceEditPage from "@/containers/Admin/ExhibitionSpaces/ExhibitionSpace/ExhibitionSpaceEditPage";
import ExhibitionSpaceDetailPage from "@/containers/Admin/ExhibitionSpaces/ExhibitionSpace/ExhibitionSpaceDetailPage";
import RentalContractList from "@/containers/Admin/RentalContracts/RentalContractList";
import RentalContractDetail from "@/containers/Admin/RentalContracts/RentalContractDetail";
import FeedbackListAdmin from "@/containers/Admin/Feedbacks/FeedbackListAdmin";
import FeedbackDetailAdmin from "@/containers/Admin/Feedbacks/FeedbackDetailAdmin";
import ProductCategoryList from "@/containers/Admin/ProductCategory/ProductCategoryList";
import ProductCategoryCreatePage from "@/containers/Admin/ProductCategory/ProductCategoryCreatePage";
import ProductCategoryEditPage from "@/containers/Admin/ProductCategory/ProductCategoryEditPage";
import ProductList from "@/containers/Admin/Products/ProductList ";
import ProductCreatePage from "@/containers/Admin/Products/ProductCreatePage";
import ProductEditPage from "@/containers/Admin/Products/ProductEditPage";
import ProductDetailPage from "@/containers/Admin/Products/ProductDetailPage";
import ExhibitionApprovalPage from "@/containers/Admin/ExhibitionApproval/ExhibitionApprovalPage";
import NewsCategoryList from "@/containers/Admin/NewsCategory/NewsCategoryList";
import NewsCategoryCreatePage from "@/containers/Admin/NewsCategory/NewsCategoryCreatePage";
import NewsCategoryEditPage from "@/containers/Admin/NewsCategory/NewsCategoryEditPage";

export const adminRoutes = [
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "account", element: <AccountPage /> },
          { path: "change-password", element: <ChangePasswordPage /> },
          { path: "users", element: <UserList /> },
          { path: "users/create", element: <UserCreatePage /> },
          { path: "users/:id", element: <UserDetailPage /> },
          { path: "users/:id/edit", element: <UserEditPage /> },
          { path: "violations", element: <ViolationList /> },
          // Quản lú Phản hồi
          { path: "feedbacks", element: <FeedbackListAdmin /> },
          { path: "feedbacks/:id", element: <FeedbackDetailAdmin /> },

          { path: "enterprises", element: <EnterpriseList /> },
          { path: "enterprises/:id", element: <EnterpriseDetailPage /> },

          // ✅ Quản lý danh mục không gian trưng bày
          {
            path: "exhibition-space-categories",
            element: <ExhibitionSpaceCategoryList />,
          },
          {
            path: "exhibition-space-categories/create",
            element: <ExhibitionSpaceCategoryCreatePage />,
          },
          {
            path: "/admin/exhibition-space-categories/:id/edit",
            element: <ExhibitionSpaceCategoryEditPage />,
          },

          // ✅ Quản lý không gian trưng bày
          {
            path: "exhibition-spaces",
            element: <ExhibitionSpaceList />,
          },
          {
            path: "/admin/exhibition-spaces/:id", // Trang chi tiết không gian
            element: <ExhibitionSpaceDetailPage />,
          },
          {
            path: "exhibition-spaces/create", // Add the create route for exhibition space
            element: <ExhibitionSpaceCreatePage />,
          },
          {
            path: "/admin/exhibition-spaces/:id/edit", // Add the edit route for exhibition space
            element: <ExhibitionSpaceEditPage />,
          },

          // Quản lý hợp đồng thuê không gian
          {
            path: "/admin/rental-contracts",
            element: <RentalContractList />,
          },
          {
            path: "/admin/rental-contracts/:id",
            element: <RentalContractDetail />,
          },

          // ✅ Quản lý danh mục sản phẩm
          {
            path: "product-categories",
            element: <ProductCategoryList />,
          },
          {
            path: "product-categories/create",
            element: <ProductCategoryCreatePage />,
          },
          {
            path: "product-categories/:id/edit",
            element: <ProductCategoryEditPage />,
          },
          // Quản lý sản phẩm
          {
            path: "products",
            element: <ProductList />,
          },
          {
            path: "products/create",
            element: <ProductCreatePage />,
          },
          {
            path: "products/:id/edit",
            element: <ProductEditPage />,
          },
          {
            path: "products/:id",
            element: <ProductDetailPage />,
          },

          // Quản lý phê duyệt sản phẩm trong không gian trưng bày
          {
            path: "exhibition-approvals",
            element: <ExhibitionApprovalPage />,
          },

          // Danh mục tin tức- sự kiện
          {
            path: "news-categories",
            element: <NewsCategoryList />,
          },
          {
            path: "news-categories/create",
            element: <NewsCategoryCreatePage />,
          },
          {
            path: "news-categories/:id/edit",
            element: <NewsCategoryEditPage />,
          },
        ],
      },
    ],
  },
];
