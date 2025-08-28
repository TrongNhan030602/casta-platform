import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import TagForm from "./components/TagForm";
import Button from "@/components/common/Button";
import { createTag } from "@/services/admin/tagsService";

const TagCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await createTag(formData);
      if (!res?.data?.data?.id) throw new Error("Không lấy được ID Tag mới");

      toast.success("Tag đã được tạo thành công!");
      navigate("/admin/tags");
    } catch (err) {
      console.error("❌ Lỗi khi tạo Tag:", err);
      const res = err.response?.data;
      if (res?.errors) {
        Object.entries(res.errors).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages[0]}`);
        });
      } else {
        toast.error("Không thể tạo Tag");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Tạo Tag</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/tags")}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>

      <TagForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default TagCreatePage;
