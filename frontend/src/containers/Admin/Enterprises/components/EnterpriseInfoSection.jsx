import React from "react";
import { FaGlobe } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEmail, MdPhone } from "react-icons/md";
import { BsSearch, BsClipboard } from "react-icons/bs";
import { enterpriseStatusMap } from "@/utils/enterpriseStatusMap";
import Badge from "@/components/common/Badge";
const EnterpriseInfoSection = ({ enterprise }) => {
  if (!enterprise) return null;

  const {
    company_name,
    tax_code,
    business_field,
    address,
    district,
    representative,
    phone,
    email,
    website,
    logo_url,
  } = enterprise;

  const taxLookupUrl = `https://masothue.com/Search?q=${encodeURIComponent(
    tax_code
  )}`;
  const { status } = enterprise;
  const handleCopyTaxCode = () => {
    navigator.clipboard.writeText(tax_code);
    toast.success("Đã sao chép mã số thuế", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <section className="enterprise-detail__section">
      <div className="enterprise-info-grid">
        <div className="info-left">
          <ul className="detail-list">
            <li>
              <strong>Mã số thuế:</strong>{" "}
              <span>
                {tax_code}{" "}
                <a
                  href={taxLookupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Tra cứu mã số thuế"
                  style={{ marginRight: "8px" }}
                >
                  <BsSearch />
                </a>
                <button
                  onClick={handleCopyTaxCode}
                  title="Sao chép mã số thuế"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: "#007289",
                  }}
                >
                  <BsClipboard />
                </button>
              </span>
            </li>
            <li>
              <strong>Tên công ty:</strong> {company_name}
            </li>
            <li>
              <strong>Lĩnh vực:</strong> {business_field}
            </li>
            <li>
              <strong>Địa chỉ:</strong> {address}
            </li>
            <li>
              <strong>Quận/Huyện:</strong> {district}
            </li>
            <li>
              <strong>Người đại diện:</strong> {representative}
            </li>
            <li>
              <strong>Trạng thái hồ sơ:</strong>{" "}
              <Badge
                label={enterpriseStatusMap[status]?.label || status}
                color={enterpriseStatusMap[status]?.color || "gray"}
              />
            </li>
            <li>
              <strong>
                <MdPhone /> SĐT:
              </strong>{" "}
              <a href={`tel:${phone}`}>{phone}</a>
            </li>
            <li>
              <strong>
                <MdEmail /> Email:
              </strong>{" "}
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            {website && (
              <li>
                <strong>
                  <FaGlobe /> Website:
                </strong>{" "}
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {website}
                </a>
              </li>
            )}
          </ul>
        </div>

        {logo_url && (
          <div className="info-right">
            <img
              src={logo_url}
              alt="Logo doanh nghiệp"
              className="enterprise-logo"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default EnterpriseInfoSection;
