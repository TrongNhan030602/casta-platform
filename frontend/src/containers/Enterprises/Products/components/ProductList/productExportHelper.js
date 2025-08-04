import { PRODUCT_STATUSES } from "@/constants/productStatus";

export const mapProductExportData = (products) =>
  products.map((p) => ({
    ID: p.id,
    "Tên sản phẩm": p.name,
    "Danh mục": p.category?.name || "-",
    Giá: p.price,
    "Giá KM": p.discount_price || "-",
    "Tồn kho": p.stock,
    "Trạng thái": PRODUCT_STATUSES[p.status]?.label || p.status,
  }));
