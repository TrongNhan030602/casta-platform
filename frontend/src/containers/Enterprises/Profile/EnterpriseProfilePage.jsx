import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { extractFieldError } from "@/utils/errorHelpers";
import {
  getEnterpriseById,
  uploadEnterpriseDocuments,
  deleteEnterpriseDocument,
  openEnterpriseDocument,
  downloadEnterpriseDocument,
  updateEnterprise,
} from "@/services/enterprise/enterpriseService";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { enterpriseStatusMap } from "@/utils/enterpriseStatusMap";
import { FiUpload, FiTrash2, FiFileText, FiDownload } from "react-icons/fi";
import InlineEditableField from "./components/InlineEditableField";
import { formatDateTime } from "@/utils/formatDateTime";
import UploadDocumentModal from "./components/UploadDocumentModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import "@/assets/styles/layout/enterprise/profile/enterprise-profile.css";

const EnterpriseProfilePage = () => {
  const { user, loading: authLoading, sessionChecked } = useAuth();

  const [enterprise, setEnterprise] = useState(null);
  const [loading, setLoading] = useState(false); // ban đầu không loading
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchEnterprise = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await getEnterpriseById(id);
      setEnterprise(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải hồ sơ:", err);
      toast.error("Không thể tải hồ sơ doanh nghiệp.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 👇 Sử dụng useEffect để theo dõi user thay đổi và có profile_id
  useEffect(() => {
    if (!sessionChecked || authLoading) return;

    const profileId = user?.profile_id;

    if (profileId) {
      fetchEnterprise(profileId);
    }
  }, [user, sessionChecked, authLoading, fetchEnterprise]);

  const profileId = user?.profile_id;

  const updateField = async (key, value) => {
    try {
      const newData = { ...enterprise, [key]: value };
      await updateEnterprise(profileId, { [key]: value });
      setEnterprise(newData);
      toast.success("Cập nhật thành công");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      throw err;
    }
  };

  const confirmDeleteDocument = async (doc) => {
    const filename = doc.path.split("/").pop();
    if (!filename || !profileId) return;

    try {
      await deleteEnterpriseDocument(profileId, filename);
      toast.success("Đã xoá tài liệu");
      fetchEnterprise(profileId);
    } catch (err) {
      console.error("Xoá lỗi:", err);
      toast.error("Không thể xoá tài liệu");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleOpen = (doc) => {
    const filename = doc.path.split("/").pop();
    if (filename) openEnterpriseDocument(profileId, filename);
  };

  const handleUploadFiles = async (files) => {
    if (!files.length || !profileId) return;
    setUploading(true);
    try {
      await uploadEnterpriseDocuments(profileId, files);
      toast.success("Tải lên thành công");
      fetchEnterprise(profileId);
    } catch (err) {
      console.error("Lỗi upload:", err);
      toast.error("Tải lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  if (!sessionChecked || authLoading || !profileId) {
    return <LoadingSpinner text="Đang khởi tạo thông tin người dùng..." />;
  }

  if (loading) {
    return <LoadingSpinner text="Đang tải hồ sơ doanh nghiệp..." />;
  }

  if (!enterprise) {
    return <p className="text-danger">Không tìm thấy hồ sơ doanh nghiệp.</p>;
  }
  const {
    company_name,
    tax_code,
    representative,
    phone,
    email,
    address,
    district,
    business_field,
    website,
    logo_url,
    documents = [],
    status,
    approved_at,
    reviewer,
    created_at,
    updated_at,
  } = enterprise;

  return (
    <div className="enterprise-profile">
      <div className="enterprise-profile__header">
        <h2 className="page-title">Hồ sơ doanh nghiệp</h2>
      </div>

      <div className="enterprise-profile__grid">
        <div className="enterprise-profile__card">
          <h3 className="enterprise-profile__card-title">
            Thông tin doanh nghiệp
          </h3>
          <ul className="enterprise-profile__list">
            <li>
              <strong>Tên công ty:</strong>{" "}
              <InlineEditableField
                value={company_name}
                onSave={(v) => updateField("company_name", v)}
                onError={(err) =>
                  toast.error(extractFieldError(err, "company_name"))
                }
                placeholder="Chưa có tên công ty"
              />
            </li>
            <li>
              <strong>Mã số thuế:</strong>{" "}
              <InlineEditableField
                value={tax_code}
                onSave={(v) => updateField("tax_code", v)}
                onError={(err) =>
                  toast.error(extractFieldError(err, "tax_code"))
                }
                placeholder="Chưa có MST"
              />
            </li>
            <li>
              <strong>Lĩnh vực:</strong>{" "}
              <InlineEditableField
                value={business_field}
                onSave={(v) => updateField("business_field", v)}
                onError={(err) =>
                  toast.error(extractFieldError(err, "business_field"))
                }
                placeholder="Chưa có lĩnh vực"
                multiline
              />
            </li>
            <li>
              <strong>Địa chỉ:</strong>{" "}
              <InlineEditableField
                value={address}
                onSave={(v) => updateField("address", v)}
                onError={(err) =>
                  toast.error(extractFieldError(err, "address"))
                }
                placeholder="Chưa có địa chỉ"
                multiline
              />
            </li>
            <li>
              <strong>Quận/Huyện:</strong>{" "}
              <InlineEditableField
                value={district}
                onSave={(v) => updateField("district", v)}
                onError={(err) =>
                  toast.error(extractFieldError(err, "district"))
                }
                placeholder="Chưa có quận/huyện"
              />
            </li>
            <li>
              <strong>Người đại diện:</strong>{" "}
              <InlineEditableField
                value={representative}
                onSave={(v) => updateField("representative", v)}
                onError={(err) =>
                  toast.error(extractFieldError(err, "representative"))
                }
                placeholder="Chưa có người đại diện"
              />
            </li>
            <li>
              <strong>SĐT:</strong>{" "}
              <InlineEditableField
                value={phone}
                onSave={(v) => updateField("phone", v)}
                onError={(err) => toast.error(extractFieldError(err, "phone"))}
                placeholder="Chưa có SĐT"
              />
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <InlineEditableField
                value={email}
                onSave={(v) => updateField("email", v)}
                onError={(err) => toast.error(extractFieldError(err, "email"))}
                placeholder="Chưa có email"
                type="email"
              />
            </li>
            <li>
              <strong>Website:</strong>{" "}
              <InlineEditableField
                value={website}
                onSave={(v) => updateField("website", v)}
                onError={(err) =>
                  toast.error(extractFieldError(err, "website"))
                }
                placeholder="Chưa có website"
              />
            </li>
            {logo_url && (
              <li>
                <strong>Logo:</strong>
                <img
                  src={logo_url}
                  alt="Logo doanh nghiệp"
                  className="enterprise-profile__logo"
                />
              </li>
            )}
            <li>
              <strong>Ngày tạo hồ sơ:</strong> {formatDateTime(created_at)}
            </li>
            <li>
              <strong>Cập nhật gần đây:</strong> {formatDateTime(updated_at)}
            </li>
          </ul>
        </div>

        <div className="enterprise-profile__card">
          <h3 className="enterprise-profile__card-title">Trạng thái hồ sơ</h3>
          <ul className="enterprise-profile__list">
            <li>
              <strong>Trạng thái:</strong>{" "}
              {enterpriseStatusMap[status] ? (
                <Badge
                  label={enterpriseStatusMap[status].label}
                  color={enterpriseStatusMap[status].color}
                />
              ) : (
                <Badge
                  label={status}
                  color="gray"
                />
              )}
            </li>
            <li>
              <strong>Ngày duyệt:</strong> {formatDateTime(approved_at)}
            </li>
            {reviewer && (
              <li>
                <strong>Người duyệt:</strong> {reviewer.name} ({reviewer.email})
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="enterprise-profile__card">
        <div className="enterprise-profile__section-header">
          <h3 className="enterprise-profile__card-title">Hồ sơ pháp lý</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploadModal(true)}
            disabled={uploading}
          >
            <FiUpload /> Tải lên
          </Button>
        </div>

        {documents.length > 0 ? (
          <ul className="enterprise-profile__documents">
            {documents.map((doc, i) => (
              <li
                key={i}
                className="enterprise-profile__document-item"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(doc)}
                >
                  <FiFileText /> {doc.original_name}
                </Button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadEnterpriseDocument(
                        profileId,
                        doc.path.split("/").pop(),
                        doc.original_name
                      )
                    }
                  >
                    <FiDownload /> Tải về
                  </Button>

                  <Button
                    variant="danger-outline"
                    size="sm"
                    onClick={() => setConfirmDelete(doc)}
                    title="Xoá"
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Chưa có tài liệu nào.</p>
        )}
      </div>

      <UploadDocumentModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onConfirm={handleUploadFiles}
      />
      <ConfirmModal
        open={!!confirmDelete}
        title="Xoá tài liệu"
        message={
          confirmDelete
            ? `Bạn có chắc chắn muốn xoá tài liệu "${confirmDelete.original_name}" không?`
            : ""
        }
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && confirmDeleteDocument(confirmDelete)}
      />
    </div>
  );
};

export default EnterpriseProfilePage;
