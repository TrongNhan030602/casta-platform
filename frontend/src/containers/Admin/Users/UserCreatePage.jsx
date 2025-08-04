// \src\containers\Admin\Users\UserCreatePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import UserForm from "@/containers/Admin/Users/components/UserForm";
import { createUser } from "@/services/admin/userService";
import Button from "@/components/common/Button";

const UserCreatePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data, { setError }) => {
    try {
      setIsLoading(true);
      await createUser(data);
      toast.success("Tạo tài khoản thành công");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach((key) => {
          setError(key, {
            type: "manual",
            message: err.response.data.errors[key][0],
          });
        });
      } else {
        const fallbackMsg =
          err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
        toast.error(fallbackMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-create-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Tạo tài khoản mới</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/users")}
          disabled={isLoading}
        >
          ← Quay lại
        </Button>
      </div>
      <UserForm
        onSubmit={handleSubmit}
        loading={isLoading}
      />
    </div>
  );
};

export default UserCreatePage;
