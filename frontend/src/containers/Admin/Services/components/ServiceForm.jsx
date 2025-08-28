import React, { useEffect, useState } from "react";
import FormGroup from "@/components/common/FormGroup";
import SelectBox from "@/components/common/SelectBox";
import Button from "@/components/common/Button";
import TextArea from "@/components/common/TextArea"; // import TextArea
import TagSelectBox from "@/components/common/TagSelectBox";
import RichTextEditor from "@/components/common/RichTextEditor";
import MediaSelector from "@/components/common/MediaSelector";
import { useServiceCategoryTree } from "@/hooks/useServiceCategoryTree";
import { getTagList } from "@/services/admin/tagsService";
import { POST_STATUS_OPTIONS } from "@/constants/postStatus";

const ServiceForm = ({
  defaultValues = {},
  isEdit = false,
  onSubmit,
  loading = false,
}) => {
  const { data: categoryOptions = [] } = useServiceCategoryTree(true);
  const [tagOptions, setTagOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: defaultValues.name || "",
    slug: defaultValues.slug || "",
    category_id: defaultValues.category_id ?? null,
    summary: defaultValues.summary || "",
    content: defaultValues.content || "",
    price: defaultValues.price || 0,
    currency: defaultValues.currency || "VND",
    duration_minutes: defaultValues.duration_minutes || 0,
    features: defaultValues.features || [],
    media: defaultValues.media || [],
    tags: (defaultValues.tags || []).map((t) => {
      if (t?.value && t?.label) return { value: t.value, label: t.label };
      return { value: t.id, label: t.name };
    }),
    status: defaultValues.status || "draft",
  });
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getTagList({ per_page: 100 });
        setTagOptions(
          res.data?.data.map((t) => ({ value: t.id, label: t.name })) || []
        );
      } catch (err) {
        console.error("Cannot load tags:", err);
      }
    };
    fetchTags();
  }, []);

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
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    if (id === "slug") setIsSlugEdited(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      features: formData.features
        .map((f) => String(f || "").trim())
        .filter(Boolean),
    };
    onSubmit(cleanedData, { setIsSlugEdited });
  };

  return (
    <form onSubmit={handleSubmitForm}>
      {/* Name & Slug */}
      <FormGroup
        id="name"
        label="Tên dịch vụ"
        value={formData.name}
        onChange={handleChange}
      />
      <FormGroup
        id="slug"
        label="Slug"
        value={formData.slug}
        onChange={handleChange}
      />

      {/* Category */}
      <SelectBox
        id="category_id"
        label="Danh mục"
        value={formData.category_id ?? ""}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            category_id: v ? Number(v) : null,
          }))
        }
        options={[
          { value: "", label: "— Không chọn —" },
          ...categoryOptions.map((c) => ({ value: c.value, label: c.label })),
        ]}
      />

      {/* Summary: dùng TextArea */}
      <TextArea
        label="Tóm tắt"
        id="summary"
        value={formData.summary}
        onChange={handleChange}
        rows={3}
      />

      {/* Content */}
      <RichTextEditor
        id="content"
        label="Nội dung"
        value={formData.content}
        onChange={(v) => setFormData((prev) => ({ ...prev, content: v }))}
      />

      {/* Price & Currency */}
      <FormGroup
        id="price"
        label="Giá dịch vụ"
        type="number"
        value={formData.price}
        onChange={handleChange}
      />
      <SelectBox
        id="currency"
        label="Đơn vị tiền tệ"
        value={formData.currency}
        onChange={(v) => setFormData((prev) => ({ ...prev, currency: v }))}
        options={[
          { value: "VND", label: "VND" },
          { value: "USD", label: "USD" },
        ]}
      />

      <FormGroup
        id="duration_minutes"
        label="Thời gian (phút)"
        type="number"
        value={formData.duration_minutes}
        onChange={handleChange}
      />

      {/* Features, Media, Tags, Status */}
      <div>
        <label>Đặc điểm nổi bật</label>
        {formData.features.map((f, idx) => (
          <div
            key={idx}
            style={{ display: "flex", gap: 8, marginBottom: 8 }}
          >
            <input
              type="text"
              value={f}
              onChange={(e) => {
                const features = [...formData.features];
                features[idx] = e.target.value;
                setFormData((prev) => ({ ...prev, features }));
              }}
              style={{ flex: 1 }}
            />
            <Button
              variant="danger"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  features: prev.features.filter((_, i) => i !== idx),
                }));
              }}
              type="button"
            >
              Xóa
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          className="m-2"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              features: [...prev.features, ""],
            }))
          }
          type="button"
        >
          + Thêm đặc điểm
        </Button>
      </div>

      <MediaSelector
        label="Ảnh/Media"
        selectedItems={formData.media}
        onChange={(items) => setFormData((prev) => ({ ...prev, media: items }))}
        multiple
      />
      <TagSelectBox
        id="tags"
        label="Tags"
        options={tagOptions}
        value={formData.tags}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            tags: v.map((t) => ({ ...t, value: Number(t.value) })),
          }))
        }
      />
      <SelectBox
        id="status"
        label="Trạng thái"
        value={formData.status}
        onChange={(v) => setFormData((prev) => ({ ...prev, status: v }))}
        options={POST_STATUS_OPTIONS}
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

export default ServiceForm;
