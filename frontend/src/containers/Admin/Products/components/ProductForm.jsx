import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  productAdminCreateSchema,
  productAdminUpdateSchema,
} from "@/validations/admin/product";
import { toDateInputValue } from "@/utils/dateFormat";
import FormGroup from "@/components/common/FormGroup";
import SelectBox from "@/components/common/SelectBox";
import Button from "@/components/common/Button";

const TAG_OPTIONS = [
  { value: "hot", label: "Hot" },
  { value: "new", label: "New" },
  { value: "sale", label: "Sale" },
  { value: "limited", label: "Limited" },
];

const SHIPPING_OPTIONS = [
  { value: "calculated", label: "Tính theo phí" },
  { value: "free", label: "Miễn phí" },
  { value: "pickup", label: "Đến lấy trực tiếp" },
];

const ProductForm = ({
  onSubmit,
  categoryOptions = [],
  enterpriseOptions = [],
  loading,
  defaultValues = {},
  mode = "create",
}) => {
  const schema =
    mode === "update" ? productAdminUpdateSchema : productAdminCreateSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discount_price: null,
      discount_start_at: null,
      discount_end_at: null,
      weight: null,
      dimensions: { width: null, height: null, depth: null },
      shipping_type: "",
      model_3d_url: "",
      video_url: "",
      category_id: "",
      enterprise_id: "",
      tags: [],
      ...defaultValues,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length) {
      reset({
        ...defaultValues,
        discount_start_at: toDateInputValue(defaultValues.discount_start_at),
        discount_end_at: toDateInputValue(defaultValues.discount_end_at),
        tags: defaultValues.tags || [],
        category_id: String(defaultValues.category_id || ""),
        enterprise_id: String(defaultValues.enterprise_id || ""),
        dimensions: {
          width: defaultValues.dimensions?.width ?? null,
          height: defaultValues.dimensions?.height ?? null,
          depth: defaultValues.dimensions?.depth ?? null,
        },
      });
    }
  }, [defaultValues, reset]);

  const tags = watch("tags") || [];
  const shipping_type = watch("shipping_type");
  const category_id = watch("category_id");
  const enterprise_id = watch("enterprise_id");

  const handleSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="grid grid-cols-2 gap-4"
    >
      {enterpriseOptions.length > 0 && (
        <SelectBox
          id="enterprise_id"
          label="Doanh nghiệp"
          required
          value={enterprise_id || ""}
          onChange={(val) => setValue("enterprise_id", val)}
          options={[
            { value: "", label: "Chọn doanh nghiệp" },
            ...enterpriseOptions,
          ]}
          error={errors.enterprise_id?.message}
        />
      )}

      <SelectBox
        id="category_id"
        label="Danh mục"
        required
        value={String(category_id ?? "")}
        onChange={(val) => setValue("category_id", val)}
        options={[{ value: "", label: "Chọn danh mục" }, ...categoryOptions]}
        error={errors.category_id?.message}
      />

      <FormGroup
        id="name"
        label="Tên sản phẩm"
        required
        {...register("name")}
        error={errors.name?.message}
      />
      <FormGroup
        id="description"
        label="Mô tả"
        as="textarea"
        {...register("description")}
        error={errors.description?.message}
      />

      <FormGroup
        id="price"
        label="Giá"
        required
        type="number"
        {...register("price")}
        error={errors.price?.message}
      />
      <FormGroup
        id="discount_price"
        label="Giá khuyến mãi"
        type="number"
        {...register("discount_price")}
        error={errors.discount_price?.message}
      />
      <FormGroup
        id="discount_start_at"
        label="Bắt đầu khuyến mãi"
        type="date"
        {...register("discount_start_at")}
        error={errors.discount_start_at?.message}
      />
      <FormGroup
        id="discount_end_at"
        label="Kết thúc khuyến mãi"
        type="date"
        {...register("discount_end_at")}
        error={errors.discount_end_at?.message}
      />

      <FormGroup
        id="weight"
        label="Khối lượng (kg)"
        type="number"
        step="any"
        {...register("weight")}
        error={errors.weight?.message}
      />

      <FormGroup
        id="dimensions.width"
        label="Chiều rộng (cm)"
        type="number"
        step="any"
        {...register("dimensions.width")}
        error={errors.dimensions?.width?.message}
      />
      <FormGroup
        id="dimensions.height"
        label="Chiều cao (cm)"
        step="any"
        type="number"
        {...register("dimensions.height")}
        error={errors.dimensions?.height?.message}
      />
      <FormGroup
        id="dimensions.depth"
        label="Chiều sâu (cm)"
        step="any"
        type="number"
        {...register("dimensions.depth")}
        error={errors.dimensions?.depth?.message}
      />

      <SelectBox
        id="shipping_type"
        label="Phương thức vận chuyển"
        value={shipping_type}
        required
        onChange={(val) => setValue("shipping_type", val)}
        options={[
          { value: "", label: "Chọn phương thức" },
          ...SHIPPING_OPTIONS,
        ]}
        error={errors.shipping_type?.message}
      />

      <FormGroup
        id="model_3d_url"
        label="URL mô hình 3D"
        type="url"
        {...register("model_3d_url")}
        error={errors.model_3d_url?.message}
      />
      <FormGroup
        id="video_url"
        label="URL video"
        type="url"
        {...register("video_url")}
        error={errors.video_url?.message}
      />

      <SelectBox
        id="tags"
        label="Tags"
        multiple
        value={tags}
        onChange={(val) => setValue("tags", val)}
        options={TAG_OPTIONS}
        error={errors.tags?.message}
      />

      <div className="col-span-2 text-right mt-3">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : defaultValues?.id ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
