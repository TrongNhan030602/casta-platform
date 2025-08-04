import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { FiUpload, FiFileText, FiImage, FiFile, FiX } from "react-icons/fi";
import "@/assets/styles/layout/enterprise/profile/upload-document-modal.css";

const getFileIcon = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "svg"].includes(ext)) return <FiImage />;
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FiFileText />;
  if (["xls", "xlsx", "csv"].includes(ext)) return <FiFile />;
  return <FiFile />;
};

const formatSize = (bytes) => {
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
};

const UploadDocumentModal = ({ open, onClose, onConfirm }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    onConfirm(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title="Tải lên tài liệu"
    >
      <div className="upload-document-modal">
        <div className="upload-document-modal__hint">
          <p>
            <strong>Hỗ trợ:</strong> PDF, DOC(X), XLS(X), JPG, PNG, SVG, TXT
            &nbsp;•&nbsp;
            <strong>Tối đa:</strong> 5MB mỗi file
          </p>
        </div>

        <input
          type="file"
          id="file-input"
          multiple
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.svg,.txt"
        />

        {selectedFiles.length > 0 && (
          <ul className="upload-document-modal__file-list">
            {selectedFiles.map((file, i) => {
              const isImage = file.type.startsWith("image/");
              const previewUrl = isImage ? URL.createObjectURL(file) : null;

              return (
                <li
                  key={i}
                  className="upload-document-modal__file-item"
                >
                  <div className="file-left">
                    <span className="file-icon">{getFileIcon(file.name)}</span>
                    <div className="file-meta">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatSize(file.size)}</span>
                    </div>
                  </div>

                  <div className="file-right">
                    {isImage && (
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="file-preview"
                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                      />
                    )}
                    <button
                      className="file-remove"
                      onClick={() => handleRemoveFile(i)}
                      title="Xoá"
                    >
                      <FiX />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="upload-document-modal__actions">
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
          >
            <FiUpload /> Xác nhận tải lên
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Huỷ
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadDocumentModal;
