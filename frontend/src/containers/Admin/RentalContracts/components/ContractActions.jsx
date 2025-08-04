import React, { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import RejectContractModal from "./RejectContractModal";
import HandleExtendModal from "./HandleExtendModal"; // ✅ Thêm import

import {
  approveRentalContract,
  rejectRentalContract,
  deleteRentalContract,
  handleContractExtension,
} from "@/services/admin/rentalContractService";

const ContractActions = ({ contract, navigate }) => {
  const [confirmType, setConfirmType] = useState(""); // approve | delete
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [extendModalOpen, setExtendModalOpen] = useState(false); // ✅ Modal gia hạn
  const [loading, setLoading] = useState(false);
  const [extendLoading, setExtendLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveRentalContract(contract.id);
      toast.success("Duyệt hợp đồng thành công");
      navigate(0);
    } catch (err) {
      toast.error(err.response?.data?.message || "Duyệt thất bại");
    } finally {
      setLoading(false);
      setConfirmType("");
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteRentalContract(contract.id);
      toast.success("Xóa hợp đồng thành công");
      navigate("/admin/rental-contracts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    } finally {
      setLoading(false);
      setConfirmType("");
    }
  };

  const handleReject = async (reason) => {
    setLoading(true);
    try {
      await rejectRentalContract(contract.id, { reject_reason: reason });
      toast.success("Từ chối hợp đồng thành công");
      navigate(0);
    } catch (err) {
      toast.error(err.response?.data?.message || "Từ chối thất bại");
    } finally {
      setLoading(false);
      setRejectModalOpen(false);
    }
  };

  const handleExtendSubmit = async (payload) => {
    setExtendLoading(true);
    try {
      await handleContractExtension(contract.id, payload);
      toast.success("Xử lý gia hạn thành công");
      navigate(0);
    } catch (err) {
      toast.error(err.response?.data?.message || "Xử lý gia hạn thất bại");
    } finally {
      setExtendLoading(false);
      setExtendModalOpen(false);
    }
  };

  const canApproveOrReject = contract.status === "pending";
  const canDelete = ["pending", "rejected", "cancelled"].includes(
    contract.status
  );
  const canHandleExtension =
    contract.status === "approved" && contract.has_extend_request;
  const hasAnyAction = canApproveOrReject || canDelete || canHandleExtension;

  return (
    <div className="contract-detail__section mb-4">
      <h5 className="contract-detail__section-title">Thao tác quản trị</h5>

      {hasAnyAction ? (
        <div className="d-flex flex-wrap gap-2">
          {canApproveOrReject && (
            <>
              <Button
                variant="outline"
                onClick={() => setConfirmType("approve")}
              >
                Duyệt
              </Button>
              <Button
                variant="danger"
                onClick={() => setRejectModalOpen(true)}
              >
                Từ chối
              </Button>
            </>
          )}

          {canDelete && (
            <Button
              variant="danger-outline"
              onClick={() => setConfirmType("delete")}
            >
              Xóa
            </Button>
          )}

          {canHandleExtension && (
            <Button
              variant="outline"
              onClick={() => setExtendModalOpen(true)}
              loading={extendLoading}
            >
              Xử lý gia hạn
            </Button>
          )}
        </div>
      ) : (
        <p className="text-muted fst-italic">
          Không còn thao tác nào khả dụng cho hợp đồng này.
        </p>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!confirmType}
        title={
          confirmType === "approve"
            ? "Xác nhận duyệt hợp đồng"
            : "Xác nhận xóa hợp đồng"
        }
        message={
          <p>
            Bạn có chắc chắn muốn {confirmType === "approve" ? "duyệt" : "xóa"}{" "}
            hợp đồng này không?
          </p>
        }
        onCancel={() => setConfirmType("")}
        onConfirm={confirmType === "approve" ? handleApprove : handleDelete}
        loading={loading}
      />

      {/* Reject Modal */}
      <RejectContractModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onReject={handleReject}
        loading={loading}
      />

      {/* Handle Extend Modal */}
      <HandleExtendModal
        open={extendModalOpen}
        onClose={() => setExtendModalOpen(false)}
        onSubmit={handleExtendSubmit}
        loading={extendLoading}
        contract={contract}
      />
    </div>
  );
};

export default ContractActions;
