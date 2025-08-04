import React from "react";
import { Modal, Button, Image, Row, Col, ListGroup } from "react-bootstrap";
import {
  FaTrash,
  FaTimes,
  FaBox,
  FaTag,
  FaWarehouse,
  FaInfoCircle,
} from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import { EXHIBITION_PRODUCT_STATUSES } from "@/constants/exhibitionProductStatus";

const ProductInfoModal = ({ show, onHide, product, onDelete }) => {
  if (!product) return null;

  const statusInfo = EXHIBITION_PRODUCT_STATUSES[product.status];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FaBox className="me-2" />
          {product.productName}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col
            md={5}
            className="text-center"
          >
            {product.productImageUrl ? (
              <Image
                src={product.productImageUrl}
                alt={product.productName}
                fluid
                rounded
              />
            ) : (
              <div className="border p-5 text-muted">Không có ảnh</div>
            )}
          </Col>

          <Col md={7}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <FaInfoCircle className="me-2 text-secondary" />
                <strong>Mô tả:</strong> {product.description || "Không có"}
              </ListGroup.Item>

              <ListGroup.Item>
                <FaTag className="me-2 text-secondary" />
                <strong>Giá:</strong> {formatCurrency(product.price)}
              </ListGroup.Item>

              <ListGroup.Item>
                <FaWarehouse className="me-2 text-secondary" />
                <strong>Còn:</strong> {product.stock}
              </ListGroup.Item>

              <ListGroup.Item>
                <FaBox className="me-2 text-secondary" />
                <strong>Danh mục:</strong> {product.categoryName || "Không rõ"}
              </ListGroup.Item>

              <ListGroup.Item>
                <FaInfoCircle className="me-2 text-secondary" />
                <strong>Trạng thái trưng bày:</strong>{" "}
                {statusInfo ? (
                  <span className={`badge bg-${statusInfo.color}`}>
                    <statusInfo.icon className="me-1" />
                    {statusInfo.label}
                  </span>
                ) : (
                  "Không rõ"
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="danger"
          onClick={onDelete}
        >
          <FaTrash className="me-2" />
          Hủy trưng bày
        </Button>
        <Button
          variant="secondary"
          onClick={onHide}
        >
          <FaTimes className="me-2" />
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductInfoModal;
