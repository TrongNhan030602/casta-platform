// MediaSelector.jsx
import React, { useRef, useEffect } from "react";
import classNames from "classnames";
import "@/assets/styles/common/media-selector.css";

const MediaSelector = ({
  label,
  selectedItems = [], // [{id?, file?, preview?, name?, url?}]
  onChange,
  multiple = false,
  error,
  className,
}) => {
  const inputRef = useRef(null);

  // Cleanup preview URL khi unmount
  useEffect(() => {
    return () => {
      selectedItems.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
    };
  }, [selectedItems]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    if (multiple) onChange([...selectedItems, ...newFiles]);
    else onChange([newFiles[0]]);

    e.target.value = null;
  };

  const handleRemove = (idx) => {
    const removedItem = selectedItems[idx];
    if (removedItem.preview) URL.revokeObjectURL(removedItem.preview);

    const newList = selectedItems.filter((_, i) => i !== idx);
    onChange(newList);
  };

  return (
    <div className={classNames("c-media-selector mb-3", className)}>
      {label && <label className="form-label">{label}</label>}

      <input
        type="file"
        ref={inputRef}
        multiple={multiple}
        onChange={handleFileSelect}
        className={classNames("form-control", { "is-invalid": !!error })}
      />

      {selectedItems.length > 0 && (
        <div className="c-media-selector__preview mt-2">
          {selectedItems.map((item, idx) => {
            const key = item.id || item.name || idx;
            const src = item.preview || item.url || "";
            const name =
              item.name ||
              (item.url ? item.url.split("/").pop() : `ID: ${item.id}`);

            return (
              <div
                key={key}
                className="c-media-selector__item"
              >
                {src && (
                  <img
                    src={src}
                    alt={name}
                  />
                )}
                <div className="c-media-selector__name">{name}</div>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="c-media-selector__remove"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}

      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default MediaSelector;
