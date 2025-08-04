import React from "react";
import { formatDateTime } from "@/utils/formatDateTime";
import { openEnterpriseDocument } from "@/services/enterprise/enterpriseService";

const EnterpriseInfo = ({ enterprise }) => {
  if (!enterprise) return null;

  const handleOpenDocument = (doc) => {
    const filename = doc.path.split("/").pop();
    if (filename) openEnterpriseDocument(enterprise.id, filename);
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-borderless table-sm mb-0">
          <tbody>
            <tr>
              <th className="fw-bold w-25">Tên công ty</th>
              <td>{enterprise.company_name}</td>
            </tr>
            <tr>
              <th>Đại diện pháp luật</th>
              <td>{enterprise.representative}</td>
            </tr>
            <tr>
              <th>Mã số thuế</th>
              <td>{enterprise.tax_code}</td>
            </tr>
            <tr>
              <th>Lĩnh vực</th>
              <td>{enterprise.business_field}</td>
            </tr>
            <tr>
              <th>Quận/Huyện</th>
              <td>{enterprise.district}</td>
            </tr>
            <tr>
              <th>Địa chỉ</th>
              <td>{enterprise.address}</td>
            </tr>
            <tr>
              <th>Điện thoại</th>
              <td>{enterprise.phone}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{enterprise.email}</td>
            </tr>
            <tr>
              <th>Website</th>
              <td>
                <a
                  href={enterprise.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {enterprise.website}
                </a>
              </td>
            </tr>
            {enterprise.logo_url && (
              <tr>
                <th>Logo</th>
                <td>
                  <img
                    src={enterprise.logo_url}
                    alt="Logo doanh nghiệp"
                    style={{ maxHeight: 80 }}
                    className="img-fluid mt-1 border"
                  />
                </td>
              </tr>
            )}
            <tr>
              <th>Giấy tờ pháp lý</th>
              <td>
                {enterprise.documents?.length > 0 ? (
                  <ul className="list-unstyled mb-0">
                    {enterprise.documents.map((doc, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-underline"
                          onClick={() => handleOpenDocument(doc)}
                        >
                          📄 {doc.original_name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted">Chưa có</span>
                )}
              </td>
            </tr>
            <tr>
              <th>Trạng thái duyệt</th>
              <td className="text-capitalize">{enterprise.status}</td>
            </tr>
            <tr>
              <th>Ngày duyệt</th>
              <td>
                {enterprise.approved_at
                  ? formatDateTime(enterprise.approved_at)
                  : "Chưa duyệt"}
              </td>
            </tr>
            {enterprise.reviewer && (
              <tr>
                <th>Người duyệt</th>
                <td>
                  {enterprise.reviewer.name} ({enterprise.reviewer.email})
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnterpriseInfo;
