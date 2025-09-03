import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormGroup from "@/components/common/FormGroup";
import SelectBox from "@/components/common/SelectBox";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

const ExhibitionSpaceForm = ({
  onSubmit,
  categoryOptions = [],
  loading,
  defaultValues = {},
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      name: "",
      location: "",
      zone: "",
      size: "",
      status: "available",
      price: 0,
      description: "",
      category_id: "",
      metadata: [],
      ...defaultValues,
    },
  });

  const categoryId = watch("category_id");
  const status = watch("status");
  const metadata = watch("metadata");

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      Object.keys(defaultValues).forEach((key) => {
        if (defaultValues[key] !== undefined) {
          setValue(key, defaultValues[key]);
        }
      });
    }
  }, [defaultValues, setValue]);

  const handleAddMetadata = () => {
    const newMetadata = [...metadata, { key: "", type: "text", value: "" }];
    setValue("metadata", newMetadata);
  };

  const handleRemoveMetadata = (index) => {
    const newMetadata = [...metadata];
    newMetadata.splice(index, 1);
    setValue("metadata", newMetadata);
  };

  const handleMetadataChange = (index, field, value) => {
    const updatedMetadata = [...metadata];
    updatedMetadata[index][field] = value;
    setValue("metadata", updatedMetadata);
  };

  const handleSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="form-container"
    >
      <FormGroup
        id="code"
        label="Mã không gian"
        {...register("code")}
      />
      <FormGroup
        id="name"
        label="Tên không gian"
        {...register("name")}
      />
      <FormGroup
        id="location"
        label="Vị trí"
        {...register("location")}
      />
      <FormGroup
        id="zone"
        label="Khu vực"
        {...register("zone")}
      />
      <FormGroup
        id="size"
        label="Kích thước"
        {...register("size")}
      />

      {/* SelectBox cho Danh mục không gian */}
      <SelectBox
        id="category_id"
        label="Danh mục không gian"
        value={String(categoryId || "")} // ép kiểu string
        onChange={(value) => setValue("category_id", String(value))}
        options={[{ value: "", label: "Chọn danh mục" }, ...categoryOptions]}
        error={errors.category_id?.message}
      />

      {/* SelectBox cho Trạng thái */}
      <SelectBox
        id="status"
        label="Trạng thái"
        value={status}
        onChange={(value) => setValue("status", value)}
        options={[
          { value: "available", label: "Trống" },
          { value: "booked", label: "Đã đặt" },
          { value: "maintenance", label: "Bảo trì" },
        ]}
        error={errors.status?.message}
      />

      <FormGroup
        id="price"
        label="Giá"
        {...register("price")}
      />
      <FormGroup
        id="description"
        label="Mô tả"
        as="textarea"
        {...register("description")}
      />

      {/* Metadata Section */}
      <div className="metadata-section mt-3">
        <label className="form-label">Thông tin bổ sung (tùy chọn)</label>
        {metadata &&
          metadata.map((item, index) => (
            <div
              key={index}
              className="metadata-item mb-3 p-3 border rounded"
            >
              <div className="mb-3">
                <label className="form-label">Tên thông tin (Key)</label>
                <Input
                  type="text"
                  value={item.key}
                  onChange={(e) =>
                    handleMetadataChange(index, "key", e.target.value)
                  }
                  placeholder="Nhập tên thông tin"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Loại thông tin</label>
                <select
                  className="form-select"
                  value={item.type}
                  onChange={(e) =>
                    handleMetadataChange(index, "type", e.target.value)
                  }
                >
                  <option value="text">Văn bản</option>
                  <option value="number">Số</option>
                  <option value="date">Ngày</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Giá trị</label>
                {item.type === "text" && (
                  <Input
                    type="text"
                    value={item.value}
                    onChange={(e) =>
                      handleMetadataChange(index, "value", e.target.value)
                    }
                    placeholder="Nhập thông tin bổ sung"
                    className="form-control"
                  />
                )}
                {item.type === "number" && (
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) =>
                      handleMetadataChange(index, "value", e.target.value)
                    }
                    placeholder="Nhập số"
                    className="form-control"
                  />
                )}
                {item.type === "date" && (
                  <Input
                    type="date"
                    value={item.value}
                    onChange={(e) =>
                      handleMetadataChange(index, "value", e.target.value)
                    }
                    className="form-control"
                  />
                )}
              </div>

              <div className="d-flex justify-content-end">
                <Button
                  type="button"
                  onClick={() => handleRemoveMetadata(index)}
                  variant="danger"
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        <div className="d-flex justify-content-start mt-3">
          <Button
            type="button"
            onClick={handleAddMetadata}
            className="btn btn-primary"
          >
            + Thêm thông tin (chú thích)
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="submit-button mt-4">
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

export default ExhibitionSpaceForm;
