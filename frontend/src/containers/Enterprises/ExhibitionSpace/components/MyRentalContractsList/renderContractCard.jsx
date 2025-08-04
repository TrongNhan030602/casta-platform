import React from "react";
import { Col, Card } from "react-bootstrap";
import { FaRedoAlt, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { formatDateOnly } from "@/utils/formatDateOnly";
import { formatCurrency } from "@/utils/formatCurrency";
import { STATUS_MAP } from "./statusMap";

export const renderContractCard = (contract, onExtend, onCancel) => {
  const status = STATUS_MAP[contract.status];
  const isExpired =
    contract.status === "approved" && new Date(contract.end_date) < new Date();

  return (
    <Col
      md={6}
      lg={4}
      key={contract.id}
    >
      <Card className="contract-card h-100">
        <Card.Body className="d-flex flex-column justify-content-between h-100">
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="contract-code mb-0">{contract.code}</h5>
              <div className="d-flex flex-wrap gap-1">
                <Badge
                  color={status?.color}
                  label={
                    <>
                      {status?.icon}
                      <span className="ms-1">{status?.label}</span>
                    </>
                  }
                />
                {isExpired && (
                  <Badge
                    color="danger"
                    label="Hết hạn"
                    title="Đã quá ngày kết thúc, hệ thống sẽ tự cập nhật trạng thái."
                  />
                )}
              </div>
            </div>

            <div className="mb-2">
              <strong>Không gian:</strong> {contract.space?.name} (
              {contract.space?.code})
            </div>
            <div className="mb-2">
              <strong>Vị trí:</strong> {contract.space?.location}
            </div>
            <div className="mb-2">
              <strong>Thời gian:</strong>
              <div className="ms-2">
                <div>
                  <span className="text-muted">Từ:</span>{" "}
                  {formatDateOnly(contract.start_date)}
                </div>
                <div>
                  <span className="text-muted">Đến:</span>{" "}
                  {formatDateOnly(contract.end_date)}
                </div>
              </div>
            </div>
            <div>
              <strong>Tổng chi phí:</strong>{" "}
              {formatCurrency(contract.total_cost)}
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            {contract.status === "approved" &&
              (contract.extend_requested_at ? (
                <Badge
                  color="danger"
                  label="Đã yêu cầu gia hạn"
                />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<FaRedoAlt />}
                  onClick={() => onExtend(contract)}
                >
                  Gia hạn
                </Button>
              ))}

            {contract.status === "pending" && (
              <Button
                variant="danger-outline"
                size="sm"
                icon={<FaTrashAlt />}
                onClick={() => onCancel(contract)}
              >
                Hủy yêu cầu
              </Button>
            )}
          </div>
          {contract.status === "approved" && (
            <Link
              to={`/enterprise/setup-exhibition/${contract.id}`}
              className="btn btn-sm btn-primary mt-2"
              title="Gắn sản phẩm trưng bày"
            >
              Gắn sản phẩm
            </Link>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};
