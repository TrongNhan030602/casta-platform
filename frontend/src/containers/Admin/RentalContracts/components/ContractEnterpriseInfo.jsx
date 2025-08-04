import { Link } from "react-router-dom";
const ContractEnterpriseInfo = ({ contract }) => {
  const { enterprise } = contract;

  return (
    <div className="contract-detail__section mb-4">
      <h5 className="contract-detail__section-title">Thông tin doanh nghiệp</h5>
      <div className="row">
        <div className="col-md-6">
          <p>
            <strong>Tên:</strong>{" "}
            <Link
              to={`/admin/enterprises/${enterprise.id}`}
              className="text-decoration-underline"
            >
              {enterprise.name}
            </Link>
          </p>
          <p>
            <strong>Email:</strong> {enterprise.email}
          </p>
          <p>
            <strong>Điện thoại:</strong> {enterprise.phone}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <strong>Người đại diện:</strong> {enterprise.representative}
          </p>
          <p>
            <strong>Người duyệt hồ sơ:</strong> {enterprise.reviewed_by || "--"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractEnterpriseInfo;
