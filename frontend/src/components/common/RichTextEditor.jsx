// @/components/common/RichTextEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import "@/assets/styles/common/rich-text-editor.css";

const RichTextEditor = ({ id, label, value, onChange, error, className }) => {
  const editorRef = useRef(null);
  const [selection, setSelection] = useState(null);

  // Cập nhật HTML khi value từ ngoài thay đổi
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  // Lưu selection
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      setSelection(sel.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (selection) {
      sel.removeAllRanges();
      sel.addRange(selection);
    }
  };

  // Thực hiện command
  const execCommand = (command, value = null) => {
    restoreSelection();
    document.execCommand(command, false, value);
    onChange(editorRef.current.innerHTML);
  };

  // Paste sạch HTML
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const handleInput = () => onChange(editorRef.current.innerHTML);

  return (
    <div className={classNames("c-rich-text-editor mb-3", className)}>
      {label && (
        <label
          htmlFor={id}
          className="form-label"
        >
          {label}
        </label>
      )}

      <div className="c-rich-text-editor__toolbar mb-1">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault() || execCommand("bold")}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault() || execCommand("italic")}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault() || execCommand("underline")}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onMouseDown={(e) =>
            e.preventDefault() || execCommand("insertOrderedList")
          }
        >
          OL
        </button>
        <button
          type="button"
          onMouseDown={(e) =>
            e.preventDefault() || execCommand("insertUnorderedList")
          }
        >
          UL
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            const url = prompt("Nhập link:");
            if (url) execCommand("createLink", url);
          }}
        >
          🔗
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault() || execCommand("undo")}
        >
          ↶
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault() || execCommand("redo")}
        >
          ↷
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            const color = prompt("Nhập màu highlight (ví dụ: yellow, #ff0):");
            if (color) execCommand("backColor", color);
          }}
        >
          🖌️
        </button>
      </div>

      <div
        id={id}
        ref={editorRef}
        contentEditable
        className={classNames("form-control c-rich-text-editor__content", {
          "is-invalid": !!error,
        })}
        onInput={handleInput}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onPaste={handlePaste}
        style={{ minHeight: "250px", overflowY: "auto" }}
      />

      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default RichTextEditor;
