// @/components/admin/posts/PostForm.jsx
import React, { useEffect, useState } from "react";
import FormGroup from "@/components/common/FormGroup";
import SelectBox from "@/components/common/SelectBox";
import Button from "@/components/common/Button";
import DatePicker from "@/components/common/DatePicker";
import TagSelectBox from "@/components/common/TagSelectBox";
import RichTextEditor from "@/components/common/RichTextEditor";
import MediaSelector from "@/components/common/MediaSelector";
import { useNewsCategoryTree } from "@/hooks/useNewsCategoryTree";
import { getTagList } from "@/services/admin/tagsService";
import { POST_TYPE_OPTIONS } from "@/constants/postType";
import { POST_STATUS_OPTIONS } from "@/constants/postStatus";

const PostForm = ({
  defaultValues = {},
  isEdit = false,
  onSubmit,
  loading = false,
}) => {
  const { data: categoryOptions = [] } = useNewsCategoryTree(true);
  const [tagOptions, setTagOptions] = useState([]);

  const [formData, setFormData] = useState({
    type: defaultValues.type || "news",
    title: defaultValues.title || "",
    slug: defaultValues.slug || "",
    category_id: defaultValues.category_id ?? null,
    summary: defaultValues.summary || "",
    content: defaultValues.content || "",
    gallery: defaultValues.gallery || [],
    tags: (defaultValues.tags || []).map((t) => {
      if (t?.value && t?.label) {
        return { value: t.value, label: t.label }; // chỉ giữ 2 field cần
      }
      return { value: t.id, label: t.name };
    }),

    is_sticky: !!defaultValues.is_sticky,
    published_at: defaultValues.published_at || "",
    event_location: defaultValues.event_location || "",
    event_start: defaultValues.event_start || "",
    event_end: defaultValues.event_end || "",
    meta_title: defaultValues.meta_title || "",
    meta_description: defaultValues.meta_description || "",
    status: defaultValues.status || "draft",
  });

  const [isSlugEdited, setIsSlugEdited] = useState(false);

  // Load tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getTagList({ per_page: 100 });
        setTagOptions(
          res.data?.data.map((tag) => ({ value: tag.id, label: tag.name })) ||
            []
        );
      } catch (err) {
        console.error("Cannot load tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Auto-generate slug
  const removeVietnameseTones = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  useEffect(() => {
    if (!isSlugEdited && formData.title) {
      const slugified = removeVietnameseTones(formData.title)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug: slugified }));
    }
  }, [formData.title, isSlugEdited]);

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

    // Chuẩn hóa dữ liệu trước submit
    const payload = {
      ...formData,
      category_id: formData.category_id ? Number(formData.category_id) : null,
      gallery: formData.gallery.map((item) =>
        item.id != null ? Number(item.id) : item
      ),
      tags: formData.tags.map((t) =>
        typeof t === "object" ? Number(t.value) : Number(t)
      ),
      is_sticky: !!formData.is_sticky,
    };

    onSubmit(payload, { setIsSlugEdited });
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <SelectBox
        id="type"
        label="Loại bài viết"
        value={formData.type}
        onChange={(v) => setFormData((prev) => ({ ...prev, type: v }))}
        options={POST_TYPE_OPTIONS}
      />

      <FormGroup
        id="title"
        label="Tiêu đề"
        value={formData.title}
        onChange={handleChange}
      />
      <FormGroup
        id="slug"
        label="Slug"
        value={formData.slug}
        onChange={handleChange}
      />

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

      <FormGroup
        id="summary"
        label="Tóm tắt"
        as="textarea"
        value={formData.summary}
        onChange={handleChange}
      />
      <RichTextEditor
        id="content"
        label="Nội dung"
        value={formData.content}
        onChange={(v) => setFormData((prev) => ({ ...prev, content: v }))}
      />

      <TagSelectBox
        id="tags"
        label="Tags"
        options={tagOptions}
        value={formData.tags}
        onChange={(v) => setFormData((prev) => ({ ...prev, tags: v }))}
      />

      <MediaSelector
        label="Ảnh/Media"
        selectedItems={formData.gallery}
        onChange={(items) =>
          setFormData((prev) => ({ ...prev, gallery: items }))
        }
        multiple
      />

      <SelectBox
        id="status"
        label="Trạng thái"
        value={formData.status}
        onChange={(v) => setFormData((prev) => ({ ...prev, status: v }))}
        options={POST_STATUS_OPTIONS}
      />

      <FormGroup
        id="is_sticky"
        label="Bài viết nổi bật"
        type="checkbox"
        checked={formData.is_sticky}
        onChange={handleChange}
      />

      <DatePicker
        id="published_at"
        label="Ngày xuất bản"
        value={formData.published_at}
        onChange={(v) => setFormData((prev) => ({ ...prev, published_at: v }))}
      />

      {formData.type === "event" && (
        <>
          <FormGroup
            id="event_location"
            label="Địa điểm sự kiện"
            value={formData.event_location}
            onChange={handleChange}
          />
          <DatePicker
            id="event_start"
            label="Bắt đầu sự kiện"
            mode="datetime"
            value={formData.event_start}
            onChange={(v) =>
              setFormData((prev) => ({ ...prev, event_start: v }))
            }
          />
          <DatePicker
            id="event_end"
            label="Kết thúc sự kiện"
            value={formData.event_end}
            onChange={(v) => setFormData((prev) => ({ ...prev, event_end: v }))}
          />
        </>
      )}

      <FormGroup
        id="meta_title"
        label="Meta title"
        value={formData.meta_title}
        onChange={handleChange}
      />
      <FormGroup
        id="meta_description"
        label="Meta description"
        as="textarea"
        value={formData.meta_description}
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

export default PostForm;
