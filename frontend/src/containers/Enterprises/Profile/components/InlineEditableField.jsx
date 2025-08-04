import React, { useState, useRef, useEffect } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import "@/assets/styles/layout/enterprise/profile/inline-editable-field.css";

const InlineEditableField = ({
  value,
  onSave,
  type = "text",
  placeholder = "",
  disabled = false,
  multiline = false,
  autoFocusOnEdit = true,
  showSuccessTick = true,
  onError, // ✅ callback lỗi từ cha
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && autoFocusOnEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing, autoFocusOnEdit]);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const handleSave = async () => {
    if (tempValue !== value) {
      try {
        await onSave(tempValue);
        setSaved(true);
      } catch (error) {
        console.error("Lỗi khi lưu:", error);
        if (onError) {
          onError(error); // Let parent decide toast
        } else {
          toast.error("Cập nhật thất bại"); // Fallback nếu không có onError
        }
      }
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value || "");
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const block = "inline-editable";

  if (editing) {
    return (
      <div className={`${block} ${block}--editing`}>
        {multiline ? (
          <textarea
            className={`${block}__input ${block}__input--textarea`}
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
        ) : (
          <input
            className={`${block}__input`}
            ref={inputRef}
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
        <div className={`${block}__actions`}>
          <button
            className={`${block}__button`}
            onClick={handleSave}
            title="Lưu"
          >
            <FiCheck />
          </button>
          <button
            className={`${block}__button`}
            onClick={handleCancel}
            title="Huỷ"
          >
            <FiX />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${block} ${block}--view ${
        disabled ? `${block}--disabled` : ""
      }`}
      onClick={() => !disabled && setEditing(true)}
    >
      <span className={`${block}__text`}>
        {value || <em className={`${block}__placeholder`}>{placeholder}</em>}
        {showSuccessTick && saved && (
          <FiCheck className={`${block}__icon ${block}__icon--saved`} />
        )}
      </span>
      {!disabled && (
        <FiEdit2 className={`${block}__icon ${block}__icon--edit`} />
      )}
    </div>
  );
};

export default InlineEditableField;
