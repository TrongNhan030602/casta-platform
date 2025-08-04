import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import MetadataEditor from "./MetadataEditor";

const MediaUploadForm = ({ onSubmit, mediaToEdit, setMediaToEdit }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      caption: "",
      order: 0,
      file: null,
    },
  });

  const [localMetadata, setLocalMetadata] = useState({});

  // ✅ Reset form khi mediaToEdit thay đổi
  useEffect(() => {
    if (mediaToEdit) {
      reset({
        type: mediaToEdit.type || "",
        caption: mediaToEdit.caption || "",
        order: mediaToEdit.order ?? 0,
        file: null,
      });

      let parsedMetadata = {};
      try {
        parsedMetadata =
          typeof mediaToEdit.metadata === "string"
            ? JSON.parse(mediaToEdit.metadata)
            : mediaToEdit.metadata || {};
      } catch (e) {
        console.error("❌ Không parse được metadata:", e);
        parsedMetadata = {};
      }

      setLocalMetadata(parsedMetadata);
    } else {
      // ✅ reset về trạng thái trắng
      reset({
        type: "",
        caption: "",
        order: 0,
        file: null,
      });
      setLocalMetadata({});
    }
  }, [mediaToEdit, reset]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "type" && !["panorama", "vr_scene"].includes(value.type)) {
        if (localMetadata?.markers) {
          const updated = { ...localMetadata };
          delete updated.markers;
          setLocalMetadata(updated);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, localMetadata]);

  const onInternalSubmit = async (data) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("caption", data.caption || "");
    formData.append("order", data.order);
    formData.append("metadata", JSON.stringify(localMetadata));

    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    }

    const success = await onSubmit(formData); // chờ parent xử lý xong

    if (success && setMediaToEdit) {
      setMediaToEdit(null); // chỉ làm việc này, phần reset sẽ do useEffect xử lý
    }
  };

  const type = watch("type");

  const acceptMime = {
    image: "image/*",
    panorama: "image/*",
    vr_scene: "image/*",
    video: "video/mp4",
    document: ".pdf,.doc,.docx",
  };

  const requiresMetadata = ["panorama", "vr_scene"];

  return (
    <div className="section">
      <h3 className="section-title">Tải/ Cập nhật media</h3>
      <form onSubmit={handleSubmit(onInternalSubmit)}>
        {/* Type */}
        <div className="form-group">
          <label>Loại media</label>
          <select
            className="form-control"
            {...register("type", { required: true })}
          >
            <option value="">-- Chọn loại --</option>
            <option value="image">Ảnh thường</option>
            <option value="panorama">Ảnh 360°</option>
            <option value="vr_scene">VR Scene</option>
            <option value="video">Video</option>
            <option value="document">Tài liệu</option>
          </select>
          {errors.type && (
            <small className="text-danger">Bắt buộc chọn loại</small>
          )}
        </div>

        {/* Caption */}
        <div className="form-group">
          <label>Chú thích (caption)</label>
          <input
            className="form-control"
            type="text"
            {...register("caption")}
            placeholder="Mô tả ảnh"
          />
        </div>

        {/* Order */}
        <div className="form-group">
          <label>Thứ tự hiển thị (order)</label>
          <input
            type="number"
            className="form-control"
            {...register("order", {
              required: true,
              valueAsNumber: true,
              min: 0,
            })}
            placeholder="Thứ tự hiển thị"
          />
          {errors.order && (
            <small className="text-danger">Bắt buộc nhập thứ tự</small>
          )}
        </div>

        {/* File */}
        <div className="form-group">
          <label>Chọn file</label>
          <input
            className="form-control"
            type="file"
            accept={acceptMime[type] || "*/*"}
            {...register("file", { required: !mediaToEdit })}
          />
          {errors.file && (
            <small className="text-danger">Bắt buộc chọn file</small>
          )}
        </div>

        {/* Metadata */}
        {requiresMetadata.includes(type) && (
          <MetadataEditor
            mediaType={type}
            metadata={localMetadata}
            onChange={setLocalMetadata}
          />
        )}

        {/* Submit + Cancel */}
        <div className="d-flex justify-content-between mt-2">
          <Button
            type="submit"
            variant="primary"
          >
            {mediaToEdit ? "Cập nhật" : "Tải lên"}
          </Button>

          {mediaToEdit && (
            <Button
              variant="danger-outline"
              onClick={() => setMediaToEdit(null)}
            >
              Huỷ
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MediaUploadForm;
