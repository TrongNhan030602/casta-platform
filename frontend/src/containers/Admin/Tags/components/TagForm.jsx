import React, { useEffect, useState } from "react";
import FormGroup from "@/components/common/FormGroup";
import Button from "@/components/common/Button";

const TagForm = ({
  defaultValues = {},
  isEdit = false,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: defaultValues.name || "",
    slug: defaultValues.slug || "",
  });

  const [isSlugEdited, setIsSlugEdited] = useState(false);

  // Tự động sinh slug từ name nếu người dùng chưa chỉnh sửa slug
  const removeVietnameseTones = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  useEffect(() => {
    if (!isSlugEdited && formData.name) {
      const slugified = removeVietnameseTones(formData.name)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug: slugified }));
    }
  }, [formData.name, isSlugEdited]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id === "slug") setIsSlugEdited(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup
        id="name"
        label="Tên Tag"
        value={formData.name}
        onChange={handleChange}
      />
      <FormGroup
        id="slug"
        label="Slug"
        value={formData.slug}
        onChange={handleChange}
      />

      <div style={{ marginTop: 20 }}>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
};

export default TagForm;
