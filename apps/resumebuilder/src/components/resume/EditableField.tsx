"use client";

import { useEffect, useRef, useState } from "react";

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  isSidebar?: boolean;
  templateName?: string;
}

export const EditableField = ({
  value,
  onChange,
  multiline = false,
  className = "",
  isSidebar = false,
  templateName = "",
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Update local state when prop value changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (if not multiline), or Ctrl+Enter (if multiline)
    if (
      (e.key === "Enter" && !multiline) ||
      (e.key === "Enter" && e.ctrlKey && multiline)
    ) {
      setIsEditing(false);
      onChange(editValue);
    }

    // Cancel on Escape
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(value); // Reset to original value
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const enableEditing = () => setIsEditing(true);

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full resize-none bg-white p-1 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
        rows={Math.max(2, editValue.split("\n").length)}
        autoFocus
        data-field-value="edit"
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-white p-1 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
        autoFocus
        data-field-value="edit"
      />
    );
  }

  return (
    <div
      className={`group relative ${className || ""}`}
      data-editable-field="true"
      data-field-type={multiline ? "multiline" : "singleline"}
    >
      <div
        className={`min-h-[1.5rem] cursor-text whitespace-pre-wrap break-words empty:before:text-gray-400 empty:before:content-['Click_to_edit'] ${
          value ? "" : "text-gray-400"
        } ${isSidebar && templateName === "creative" ? "text-white" : ""}`}
        onClick={enableEditing}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            enableEditing();
          }
        }}
        tabIndex={0}
        data-field-value="display"
        aria-label="Click to edit text"
      >
        {value}
      </div>
    </div>
  );
};
