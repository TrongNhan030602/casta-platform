import { FaHashtag } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import { getStorageUrl } from "@/utils/getStorageUrl";
import { PRODUCT_STATUSES } from "@/constants/productStatus";
import Button from "@/components/common/Button";
import StatusSelectInline from "./StatusSelectInline";

export const getColumns = (navigate, updateModals, handleSubmitProduct) => [
  {
    label: "ID",
    key: "id",
    render: (r) => (
      <button
        className="link-button"
        onClick={() => navigate(`/enterprise/products/${r.id}`)}
      >
        <FaHashtag /> {r.id}
      </button>
    ),
  },
  {
    label: "Ảnh",
    render: (r) => (
      <img
        src={getStorageUrl(r.main_image)}
        alt={r.name}
        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
      />
    ),
  },
  { label: "Tên sản phẩm", render: (r) => r.name },
  { label: "Danh mục", render: (r) => r.category?.name || "-" },
  { label: "Giá", render: (r) => formatCurrency(r.price) },
  {
    label: "Giá KM",
    render: (r) => (r.discount_price ? formatCurrency(r.discount_price) : "-"),
  },
  { label: "Tồn kho", render: (r) => r.stock },
  {
    label: "Trạng thái",
    render: (r) => (
      <StatusSelectInline
        product={r}
        onSuccess={() => handleSubmitProduct(null, true)}
      />
    ),
  },

  {
    label: "Hành động",
    render: (r) => {
      const deleted = !!r.deleted_at;

      return (
        <div className="d-flex gap-2 flex-wrap">
          {!deleted ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/enterprise/products/${r.id}/edit`)}
              >
                Sửa
              </Button>
              <Button
                size="sm"
                variant="danger-outline"
                onClick={() => updateModals("delete", true, r)}
              >
                Xoá
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateModals("restore", true, r)}
              >
                Kh.Phục
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => updateModals("delete", true, r, true)}
              >
                Xoá
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];
