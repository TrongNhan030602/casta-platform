import React, { useState, useEffect } from "react";
import Button from "@/components/common/Button";

const mockProducts = [
  {
    id: 1,
    name: "Bàn họp cao cấp",
    description: "Thiết kế hiện đại, màu gỗ óc chó.",
    image_url: "/images/products/ban-hop.jpg",
    status: "pending",
  },
  {
    id: 2,
    name: "Đèn trần nghệ thuật",
    description: "Phong cách Scandinavian, phù hợp không gian mở.",
    image_url: "/images/products/den-tran.jpg",
    status: "approved",
  },
];

const ProductApprovalTab = ({ spaceId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Giả lập fetch API
    setTimeout(() => {
      setProducts(mockProducts);
    }, 300);
  }, [spaceId]);

  const handleApprove = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
    );
  };

  const handleReject = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p))
    );
  };

  return (
    <div>
      <h3>Sản phẩm đăng ký trưng bày</h3>
      {products.map((product) => (
        <div
          key={product.id}
          className="product-card p-4 border rounded mb-4"
        >
          <p className="font-bold">{product.name}</p>
          <p className="text-sm text-gray-600">{product.description}</p>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-32 my-2"
          />
          <p>
            <span className={`status-badge ${product.status}`}>
              {product.status}
            </span>
          </p>
          {product.status === "pending" && (
            <div className="flex gap-2 mt-2">
              <Button onClick={() => handleApprove(product.id)}>✔ Duyệt</Button>
              <Button
                variant="danger"
                onClick={() => handleReject(product.id)}
              >
                ✖ Từ chối
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductApprovalTab;
