import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Link } from "@tiptap/extension-link";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div
      className="btn-toolbar mb-2"
      role="toolbar"
    >
      {/* Bold / Italic */}
      <div
        className="btn-group me-2"
        role="group"
      >
        <button
          type="button"
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("bold") ? "active" : ""
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("italic") ? "active" : ""
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </button>
      </div>

      {/* Heading */}
      <div
        className="btn-group me-2"
        role="group"
      >
        <button
          type="button"
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("heading", { level: 1 }) ? "active" : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          type="button"
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("heading", { level: 2 }) ? "active" : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
      </div>

      {/* Alignment */}
      <div
        className="btn-group me-2"
        role="group"
      >
        <button
          type="button"
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive({ textAlign: "left" }) ? "active" : ""
          }`}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ⬅
        </button>
        <button
          type="button"
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive({ textAlign: "center" }) ? "active" : ""
          }`}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ⬍
        </button>
        <button
          type="button"
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive({ textAlign: "right" }) ? "active" : ""
          }`}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          ➡
        </button>
      </div>

      {/* Color */}
      <div
        className="btn-group me-2"
        role="group"
      >
        <input
          type="color"
          className="form-control form-control-color"
          title="Chọn màu chữ"
          onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Reset
        </button>
      </div>

      {/* Link */}
      <div
        className="btn-group me-2"
        role="group"
      >
        <button
          type="button"
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("link") ? "active" : ""
          }`}
          onClick={() => {
            const url = prompt("Nhập link:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          🔗 Link
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          ❌ Unlink
        </button>
      </div>

      {/* Undo / Redo */}
      <div
        className="btn-group"
        role="group"
      >
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ⎌ Undo
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↻ Redo
        </button>
      </div>
    </div>
  );
};

const RichTextEditor = ({ id, label, value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const editorWrapper = useRef(null);

  // Auto focus khi mount nếu trống
  useEffect(() => {
    if (editor && !value) {
      editor.chain().focus().run();
    }
  }, [editor, value]);

  // Sync content từ prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div className="mb-3">
      {label && (
        <label
          htmlFor={id}
          className="form-label fw-bold"
        >
          {label}
        </label>
      )}
      <MenuBar editor={editor} />
      <div
        ref={editorWrapper}
        className="border rounded p-2 bg-white"
        style={{
          minHeight: "300px",
          maxHeight: "600px",
          overflowY: "auto",
          cursor: "text",
        }}
        onClick={() => editor && editor.chain().focus().run()} // click vào focus editor
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
