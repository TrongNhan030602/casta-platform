import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "@/assets/styles/common/not-found-message.css";
const NotFoundMessage = ({
  message = "Không tìm thấy dữ liệu.",
  subMessage = "Có thể dữ liệu đã bị xoá hoặc không tồn tại.",
  icon = (
    <AiOutlineCloseCircle
      size={72}
      color="#dc3545"
      className="mb-3 animated-icon"
    />
  ),
  showBackButton = true,
  backText = "Quay lại",
  backTo = -1,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof backTo === "string") navigate(backTo);
    else navigate(-1);
  };

  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center py-5 px-3 ${className}`}
    >
      {icon}
      <h5 className="text-danger mb-2">{message}</h5>
      <p
        className="text-muted mb-4 text-center"
        style={{ maxWidth: 400 }}
      >
        {subMessage}
      </p>
      {showBackButton && (
        <button
          onClick={handleBack}
          className="btn btn-outline-danger px-4"
        >
          {backText}
        </button>
      )}
    </div>
  );
};

export default NotFoundMessage;
