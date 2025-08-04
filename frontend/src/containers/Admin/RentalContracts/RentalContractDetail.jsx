import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRentalContractById } from "@/services/admin/rentalContractService";
import { toast } from "react-toastify";

import Button from "@/components/common/Button";
import ContractGeneralInfo from "./components/ContractGeneralInfo";
import ContractSpaceInfo from "./components/ContractSpaceInfo";
import ContractEnterpriseInfo from "./components/ContractEnterpriseInfo";
import ContractActions from "./components/ContractActions";
import TwoColumnLayout from "@/layout/TwoColumnLayout";

import "@/assets/styles/layout/admin/rental-contract/rental-contract-detail.css";

const RentalContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getRentalContractById(id);
        setContract(res.data?.data);
      } catch (err) {
        console.error("🚀 ~ fetchDetail ~ err:", err);
        toast.error("Không thể tải chi tiết hợp đồng");
        navigate("/admin/rental-contracts");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  if (loading) return <p>Đang tải...</p>;
  if (!contract) return null;

  return (
    <div className="contract-detail container py-4">
      <TwoColumnLayout
        title={`Chi tiết Hợp đồng #${contract.id}`}
        backButton={
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </Button>
        }
        leftWidth="1fr"
        rightWidth="1fr"
        leftChildren={
          <>
            <ContractGeneralInfo contract={contract} />
            <ContractSpaceInfo contract={contract} />
          </>
        }
        rightChildren={
          <>
            <ContractActions
              contract={contract}
              navigate={navigate}
            />
            <ContractEnterpriseInfo contract={contract} />
          </>
        }
      />
    </div>
  );
};

export default RentalContractDetail;
