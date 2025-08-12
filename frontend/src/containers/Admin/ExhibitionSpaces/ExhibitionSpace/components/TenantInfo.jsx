import React from "react";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaMapMarkerAlt,
  FaTags,
  FaMoneyBill,
  FaFileInvoice,
} from "react-icons/fa";
import { formatDateOnly } from "@/utils/formatDateOnly";
import { formatCurrency } from "@/utils/formatCurrency";
import "@/assets/styles/layout/admin/exhibition-space/tenant-info.css";

const TenantInfo = ({ tenants = [] }) => {
  if (!tenants || tenants.length === 0) {
    return (
      <p className="tenant-info__empty">
        Không có doanh nghiệp nào đang thuê không gian này.
      </p>
    );
  }

  return (
    <div className="tenant-info">
      <div className="tenant-info__grid">
        {tenants.map((item) => {
          const {
            start_date,
            end_date,
            total_cost,
            enterprise: {
              id,
              company_name,
              email,
              phone,
              logo_url,
              address,
              district,
              is_current,
              is_upcoming,
              business_field,
              tax_code,
            },
          } = item;

          return (
            <div
              className="tenant-info__card"
              key={id}
            >
              <div className="tenant-info__card-header">
                <img
                  src={logo_url || "/default-logo.png"}
                  alt={company_name}
                  className="tenant-info__logo"
                />
                <div className="tenant-info__info">
                  <h4 className="tenant-info__company">
                    <FaBuilding /> {company_name}
                  </h4>
                  <span
                    className={`tenant-info__badge ${
                      is_current
                        ? "tenant-info__badge--current"
                        : is_upcoming
                        ? "tenant-info__badge--upcoming"
                        : "tenant-info__badge--ended"
                    }`}
                  >
                    {is_current
                      ? "Đang thuê"
                      : is_upcoming
                      ? "Sắp thuê"
                      : "Đã kết thúc"}
                  </span>
                </div>
              </div>

              <div className="tenant-info__details">
                <div className="tenant-info__group">
                  <p>
                    <FaEnvelope /> <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <FaPhone /> <strong>Điện thoại:</strong> {phone}
                  </p>
                  <p>
                    <FaMapMarkerAlt /> <strong>Địa chỉ:</strong> {address},{" "}
                    {district}
                  </p>
                </div>

                <div className="tenant-info__group">
                  <p>
                    <FaFileInvoice /> <strong>Mã số thuế:</strong> {tax_code}
                  </p>
                  <p>
                    <FaTags /> <strong>Lĩnh vực:</strong> {business_field}
                  </p>
                </div>

                <div className="tenant-info__contract">
                  <p>
                    <FaClock /> {formatDateOnly(start_date)} →{" "}
                    {formatDateOnly(end_date)}
                  </p>
                  <p>
                    <FaMoneyBill /> {formatCurrency(total_cost)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TenantInfo;
