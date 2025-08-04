import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import FormGroup from "@/components/common/FormGroup";
import SelectBox from "@/components/common/SelectBox";
import Button from "@/components/common/Button";

import { getExhibitionSpaceCategoryTree } from "@/services/admin/exhibitionSpaceService";
import { toast } from "react-toastify";

const schema = yup.object({
  name: yup.string().required("Tên là bắt buộc").max(255, "Tối đa 255 ký tự"),
  description: yup.string().nullable(),
  parent_id: yup.string().nullable(),
});

const ExhibitionSpaceCategoryForm = ({
  defaultValues = {},
  onSubmit,
  isEdit = false,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      parent_id: "",
      ...defaultValues,
    },
    resolver: yupResolver(schema),
  });

  const parentId = watch("parent_id");
  const [categoryOptions, setCategoryOptions] = useState([]);

  // 🔁 Chuyển tree → mảng chọn
  const flattenTree = useCallback((nodes, depth = 0) => {
    return nodes.flatMap((node) => {
      const label = `${"— ".repeat(depth)}${node.name}`;
      const current = { value: String(node.id), label };
      const children = node.children
        ? flattenTree(node.children, depth + 1)
        : [];
      return [current, ...children];
    });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getExhibitionSpaceCategoryTree();
        const items = res.data?.data || [];
        let options = flattenTree(items);

        // ❌ Loại chính nó ra nếu đang sửa
        if (isEdit && defaultValues.id) {
          options = options.filter(
            (opt) => opt.value !== String(defaultValues.id)
          );
        }

        setCategoryOptions(options);

        // ✅ Nếu parent_id không còn hợp lệ thì reset
        if (defaultValues.parent_id) {
          const exists = options.some(
            (opt) => opt.value === String(defaultValues.parent_id)
          );
          if (!exists) {
            setValue("parent_id", "");
          }
        }
      } catch (err) {
        console.log("🚀 ~ fetchCategories ~ err:", err);
        toast.error("Không thể tải danh mục cha");
      }
    };

    fetchCategories();
  }, [
    flattenTree,
    isEdit,
    defaultValues.id,
    defaultValues.parent_id,
    setValue,
  ]);

  // ⏳ Reset form khi edit
  useEffect(() => {
    if (isEdit && defaultValues && Object.keys(defaultValues).length > 0) {
      reset({
        name: defaultValues.name || "",
        description: defaultValues.description || "",
        parent_id: defaultValues.parent_id || "",
      });
    }
  }, [
    isEdit,
    defaultValues.name,
    defaultValues.description,
    defaultValues.parent_id,
    defaultValues,
    reset,
  ]);

  return (
    <form
      onSubmit={handleSubmit(
        (data) => onSubmit(data, { setError }),
        (err) => console.log("❌ Validation error:", err)
      )}
    >
      <FormGroup
        id="name"
        label="Tên danh mục"
        error={errors.name?.message}
        {...register("name")}
      />

      <FormGroup
        id="description"
        label="Mô tả"
        as="textarea"
        error={errors.description?.message}
        {...register("description")}
      />

      <SelectBox
        id="parent_id"
        label="Danh mục cha"
        value={parentId}
        onChange={(value) => setValue("parent_id", value)}
        options={[{ value: "", label: "— Không có —" }, ...categoryOptions]}
        error={errors.parent_id?.message}
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

export default ExhibitionSpaceCategoryForm;
