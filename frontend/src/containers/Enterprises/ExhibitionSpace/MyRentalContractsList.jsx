import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getMyRentalContracts,
  cancelRentalContract,
  extendRentalContract,
} from "@/services/enterprise/rentalContractService";

import ConfirmModal from "@/components/common/ConfirmModal";
import CancelContractModal from "./components/CancelContractModal";
import CommonFilterBar from "@/components/common/FilterBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import { renderContractCard } from "./components/MyRentalContractsList/renderContractCard";
import filterFields from "./components/MyRentalContractsList/filterFields";

import "@/assets/styles/layout/enterprise/rental-contract/my-rental-contracts-list.css";

const MyRentalContractsList = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [filters, setFilters] = useState({ status: "", keyword: "" });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await getMyRentalContracts();
      setContracts(res.data?.data || []);
    } catch (err) {
      console.error("fetchContracts error:", err);
      toast.error("Không thể tải danh sách hợp đồng.");
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async () => {
    try {
      await extendRentalContract(selectedContract.id);
      toast.success("Yêu cầu gia hạn đã được gửi.");
      fetchContracts();
    } catch {
      toast.error("Không thể gửi yêu cầu gia hạn.");
    } finally {
      closeModal();
    }
  };

  const handleCancel = async (reason) => {
    try {
      await cancelRentalContract(selectedContract.id, {
        cancel_reason: reason,
      });
      toast.success("Yêu cầu hủy hợp đồng đã được gửi.");
      fetchContracts();
    } catch {
      toast.error("Không thể hủy hợp đồng.");
    } finally {
      closeModal();
    }
  };

  const openModal = (type, contract) => {
    setSelectedContract(contract);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedContract(null);
    setModalType(null);
  };

  const filteredContracts = contracts.filter((contract) => {
    const { status, keyword } = filters;
    const keywordLower = keyword.toLowerCase().trim();

    return (
      (!status || contract.status === status) &&
      (!keywordLower ||
        contract.code?.toLowerCase().includes(keywordLower) ||
        contract.space?.name?.toLowerCase().includes(keywordLower))
    );
  });

  return (
    <div className="my-rental-contracts container py-4">
      <CommonFilterBar
        filters={filters}
        onChange={setFilters}
        showPerPage={false}
        layout="grid"
        fields={filterFields}
      />

      {loading ? (
        <div className="text-center py-5">
          <LoadingSpinner text="Đang tải dữ liệu..." />
        </div>
      ) : filteredContracts.length === 0 ? (
        <p className="text-muted text-center">Không có hợp đồng nào phù hợp.</p>
      ) : (
        <Row className="g-4 mt-2">
          {filteredContracts.map((contract) =>
            renderContractCard(
              contract,
              navigate,
              (c) => openModal("extend", c),
              (c) => openModal("cancel", c)
            )
          )}
        </Row>
      )}

      <ConfirmModal
        open={modalType === "extend" && !!selectedContract}
        title="Gia hạn hợp đồng"
        message={`Bạn có chắc muốn gửi yêu cầu gia hạn hợp đồng ${selectedContract?.code}?`}
        onConfirm={handleExtend}
        onCancel={closeModal}
      />

      <CancelContractModal
        open={modalType === "cancel" && !!selectedContract}
        onClose={closeModal}
        onSubmit={handleCancel}
        contract={selectedContract}
      />
    </div>
  );
};

export default MyRentalContractsList;
