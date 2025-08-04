import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateOnly } from "@/utils/formatDateOnly";
import Badge from "@/components/common/Badge";
import { PRODUCT_STATUSES } from "@/constants/productStatus";
import { SHIPPING_TYPES } from "@/constants/shippingType";
const ProductInfoSection = ({ product }) => {
  const fallback = "—";
  const statusInfo = PRODUCT_STATUSES[product.status];
  const shipping = SHIPPING_TYPES[product.shipping_type];
  return (
    <div className="product-detail__section product-info">
      <div className="product-info__title">Thông tin chung</div>
      <div className="product-info__body">
        <div className="product-info__row">
          <span className="product-info__label">Mô tả:</span>
          <span className="product-info__value">
            {product.description || fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Giá:</span>
          <span className="product-info__value">
            {formatCurrency(product.price) || fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Giá KM:</span>
          <span className="product-info__value">
            {formatCurrency(product.discount_price) || fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Thời gian KM:</span>
          <span className="product-info__value">
            {(product.discount_start_at &&
              formatDateOnly(product.discount_start_at)) ||
              fallback}{" "}
            -{" "}
            {(product.discount_end_at &&
              formatDateOnly(product.discount_end_at)) ||
              fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Trọng lượng:</span>
          <span className="product-info__value">
            {product.weight ? `${product.weight} kg` : fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Kích thước:</span>
          <span className="product-info__value">
            {product.dimensions
              ? `Cao: ${product.dimensions.height} cm, Rộng: ${product.dimensions.width} cm, Dày: ${product.dimensions.depth} cm`
              : fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Loại vận chuyển:</span>
          <span className="product-info__value">
            {shipping ? (
              <Badge
                label={
                  <>
                    <shipping.icon style={{ marginRight: 4 }} />
                    {shipping.label}
                  </>
                }
                color={shipping.color}
              />
            ) : (
              fallback
            )}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Danh mục:</span>
          <span className="product-info__value">
            {product.category?.name || fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Doanh nghiệp:</span>
          <span className="product-info__value">
            {product.enterprise?.name || fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Trạng thái:</span>
          <span className="product-info__value">
            {statusInfo ? (
              <Badge
                label={statusInfo.label}
                color={statusInfo.color}
              />
            ) : (
              fallback
            )}
          </span>
        </div>
        <div className="product-info__row">
          <span className="product-info__label">Lý do từ chối:</span>
          <span className="product-info__value">
            {product.reason_rejected ?? fallback}
          </span>
        </div>
        <div className="product-info__row">
          <span className="product-info__label">Tồn kho hiện tại:</span>
          <span className="product-info__value">
            {typeof product.stock === "number"
              ? product.stock.toLocaleString()
              : fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Đã xem:</span>
          <span className="product-info__value">
            {typeof product.views_count === "number"
              ? product.views_count.toLocaleString() + " lượt"
              : fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Đã mua:</span>
          <span className="product-info__value">
            {typeof product.purchased_count === "number"
              ? product.purchased_count.toLocaleString()
              : fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Đánh giá:</span>
          <span className="product-info__value">
            {typeof product.average_rating === "number"
              ? `${product.average_rating} ⭐ (${
                  product.reviews_count || 0
                } đánh giá)`
              : fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Tags:</span>
          <span className="product-info__value">
            {product.tags?.length > 0
              ? product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="product-info__tag"
                  >
                    {tag}
                  </span>
                ))
              : fallback}
          </span>
        </div>

        <div className="product-info__row">
          <span className="product-info__label">Video:</span>
          <span className="product-info__value">
            {product.video_url ? (
              <a
                className="product-info__link"
                href={product.video_url}
                target="_blank"
                rel="noreferrer"
              >
                Xem video
              </a>
            ) : (
              fallback
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSection;
