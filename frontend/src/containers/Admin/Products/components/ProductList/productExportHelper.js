// @containers/Admin/Products/components/ProductList/productExportHelper.js
import { PRODUCT_STATUSES } from "@/constants/productStatus";

export const mapProductExportData = (products = []) =>
  products.map((product) => ({
    ID: product.id,
    "Tên sản phẩm": product.name,
    "Danh mục": product.category?.name || "-",
    "Doanh nghiệp": product.enterprise?.name || "-",
    Giá: product.price,
    "Trạng thái": PRODUCT_STATUSES[product.status]?.label || product.status,
  }));
