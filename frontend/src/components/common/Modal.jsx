import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { IoClose } from "react-icons/io5";
import "@/assets/styles/common/modal.css";

const Modal = ({ open, onClose, title, children, className }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div
        ref={modalRef}
        className={classNames("modal-container", className)}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            className="modal-close"
            onClick={onClose}
            title="Đóng"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
