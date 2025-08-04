import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { updateUser, getUserById } from "@/services/admin/userService";
import UserForm from "@/containers/Admin/Users/components/UserForm";
import Loading from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getUserById(id);
        const raw = res.data;

        // Chuẩn hoá defaultValues
        setUser({
          ...raw,
          password: "",
          password_confirmation: "",
          role: raw.role ?? "",
          enterprise_id: raw.enterprise_id ? String(raw.enterprise_id) : "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Không tìm thấy người dùng");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleUpdate = async (formData, methods) => {
    const { setError } = methods;
    setSaving(true);

    try {
      const dataToSend = { ...formData };

      // Không gửi password nếu không thay đổi
      if (!formData.password) {
        delete dataToSend.password;
        delete dataToSend.password_confirmation;
      }

      await updateUser(id, dataToSend);

      toast.success("Cập nhật tài khoản thành công");
      navigate("/admin/users");
    } catch (err) {
      const res = err.response;
      if (res?.status === 422 && res.data?.errors) {
        const errors = res.data.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          setError(field, {
            type: "server",
            message: messages[0],
          });
        });
        toast.error("Dữ liệu không hợp lệ.");
      } else {
        toast.error("Cập nhật thất bại.");
        console.error(err);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="user-edit-page container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Chỉnh sửa tài khoản #{id}</h2>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/users")}
        >
          ← Quay lại
        </Button>
      </div>

      <UserForm
        defaultValues={user}
        onSubmit={handleUpdate}
        isEdit
        loading={saving}
      />
    </div>
  );
};

export default UserEditPage;
