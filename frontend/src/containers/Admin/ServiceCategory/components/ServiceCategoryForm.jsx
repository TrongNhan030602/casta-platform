import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormGroup from "@/components/common/FormGroup";
import SelectBox from "@/components/common/SelectBox";
import Button from "@/components/common/Button";
import { useServiceCategoryTree } from "@/hooks/useServiceCategoryTree";
import { generateSlug } from "@/utils/string";
import {
  SERVICE_CATEGORY_STATUS_OPTIONS,
  SERVICE_CATEGORY_STATUSES,
} from "@/constants/serviceCategoryStatus";

// Schema validation
const schema = yup.object({
  name: yup.string().required("Tên danh mục là bắt buộc."),
  slug: yup.string().required("Slug là bắt buộc."),
  parent_id: yup.number().nullable(),
  description: yup.string().nullable(),
  order: yup.number().nullable(),
  status: yup
    .string()
    .required("Trạng thái là bắt buộc.")
    .oneOf(Object.keys(SERVICE_CATEGORY_STATUSES), "Trạng thái không hợp lệ."),
});

const ServiceCategoryForm = ({
  defaultValues = {},
  isEdit = false,
  categoryId = null,
  onSubmit,
  loading: externalLoading = false,
}) => {
  const { data: categoryOptions = [] } = useServiceCategoryTree(true);
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      parent_id: null,
      description: "",
      order: null,
      status: "draft",
      ...defaultValues,
    },
    resolver: yupResolver(schema),
  });

  const watchName = watch("name");
  const watchSlug = watch("slug");

  useEffect(() => {
    if (!isSlugEdited) setValue("slug", generateSlug(watchName));
  }, [watchName, isSlugEdited, setValue]);

  const handleSlugChange = (e) => {
    setIsSlugEdited(true);
    setValue("slug", e.target.value);
  };

  useEffect(() => {
    if (isEdit && Object.keys(defaultValues).length) {
      reset(defaultValues);
      setIsSlugEdited(false);
    }
  }, [defaultValues, isEdit, reset]);

  const filteredOptions = categoryOptions.filter(
    (cat) => cat.value !== categoryId
  );

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit(data, { setError, reset, setIsSlugEdited })
      )}
    >
      <FormGroup
        id="name"
        label="Tên danh mục"
        error={errors.name?.message}
        {...register("name")}
      />
      <FormGroup
        id="slug"
        label="Slug"
        error={errors.slug?.message}
        value={watchSlug}
        onChange={handleSlugChange}
      />
      <FormGroup
        id="description"
        label="Mô tả"
        as="textarea"
        error={errors.description?.message}
        {...register("description")}
      />
      <FormGroup
        id="order"
        label="Thứ tự"
        error={errors.order?.message}
        {...register("order", {
          setValueAs: (v) => (v === "" ? null : Number(v)),
        })}
      />
      <SelectBox
        id="parent_id"
        label="Danh mục cha"
        value={watch("parent_id")}
        onChange={(v) => {
          const normalized = v === "" ? null : Number(v);
          setValue("parent_id", normalized);
        }}
        options={[
          { value: "", label: "— Không có —" },
          ...filteredOptions.map((opt) => ({
            value: opt.value,
            label: opt.label,
          })),
        ]}
        error={errors.parent_id?.message}
      />

      <SelectBox
        id="status"
        label="Trạng thái"
        value={watch("status")}
        onChange={(v) => setValue("status", v)}
        options={SERVICE_CATEGORY_STATUS_OPTIONS}
        error={errors.status?.message}
      />
      <div style={{ marginTop: 20 }}>
        <Button
          type="submit"
          disabled={externalLoading}
        >
          {externalLoading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceCategoryForm;
