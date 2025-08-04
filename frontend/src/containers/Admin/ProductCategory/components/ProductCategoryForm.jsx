import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  productCategoryCreateSchema,
  productCategoryUpdateSchema,
} from "@/validations/admin/productCategory";

import { flattenCategoryTreeForDropdown } from "@/utils/flattenCategoryTree";

import FormGroup from "@/components/common/FormGroup";
import SelectBox from "@/components/common/SelectBox";
import Button from "@/components/common/Button";
import SwitchToggle from "@/components/common/SwitchToggle";

import { getCategoryTree } from "@/services/admin/productCategoryService";
import { toast } from "react-toastify";

const ProductCategoryForm = ({
  defaultValues = {},
  onSubmit,
  isEdit = false,
  loading = false,
}) => {
  const schema = isEdit
    ? productCategoryUpdateSchema
    : productCategoryCreateSchema;

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
      sort_order: "",
      is_active: true,
      ...defaultValues,
    },
    resolver: yupResolver(schema),
    context: isEdit ? { selfId: defaultValues?.id } : {},
  });

  const parentId = watch("parent_id");
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoryTree();
        const items = res.data?.data || [];
        let options = flattenCategoryTreeForDropdown(items);

        // Loại bỏ chính nó ra khỏi danh sách cha
        if (isEdit && defaultValues?.id) {
          options = options.filter(
            (opt) => opt.value !== String(defaultValues.id)
          );
        }

        // Nếu danh mục cha không còn trong cây, vẫn giữ lại để hiển thị
        if (defaultValues?.parent_id) {
          const exists = options.some(
            (opt) => opt.value === String(defaultValues.parent_id)
          );
          if (!exists) {
            options.unshift({
              value: String(defaultValues.parent_id),
              label: `(ID: ${defaultValues.parent_id}) [Không tìm thấy trong cây]`,
            });
          }
        }

        setCategoryOptions([{ value: "", label: "— Không có —" }, ...options]);
      } catch (err) {
        console.error("Lỗi tải danh mục cha:", err);
        toast.error("Không thể tải danh mục cha");
      }
    };

    fetchCategories();
  }, [isEdit, defaultValues, setValue]);

  useEffect(() => {
    if (isEdit && Object.keys(defaultValues).length > 0) {
      reset({
        name: defaultValues.name || "",
        description: defaultValues.description || "",
        parent_id:
          defaultValues.parent_id !== null &&
          defaultValues.parent_id !== undefined
            ? String(defaultValues.parent_id)
            : "",
        sort_order: defaultValues.sort_order ?? "",
        is_active: defaultValues.is_active ?? true,
      });
    }
  }, [isEdit, defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(
        (data) => {
          const payload = {
            ...data,
            name: data.name.trim(),
            description: data.description?.trim() || null,
            parent_id: data.parent_id || null,
          };
          onSubmit(payload, { setError });
        },
        (err) => console.log("❌ Validate lỗi:", err)
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

      <FormGroup
        id="sort_order"
        label="Thứ tự sắp xếp"
        error={errors.sort_order?.message}
        {...register("sort_order", {
          setValueAs: (v) => (v === "" ? null : Number(v)),
        })}
      />

      <SelectBox
        id="parent_id"
        label="Danh mục cha"
        value={parentId}
        onChange={(value) => setValue("parent_id", value)}
        options={categoryOptions}
        error={errors.parent_id?.message}
      />

      <FormGroup
        id="is_active"
        label="Trạng thái hoạt động"
        error={errors.is_active?.message}
      >
        <SwitchToggle
          checked={watch("is_active")}
          onChange={(e) => setValue("is_active", e.target.checked)}
        />
      </FormGroup>

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

export default ProductCategoryForm;
