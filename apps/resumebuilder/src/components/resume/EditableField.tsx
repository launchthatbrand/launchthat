"use client";

import { useEffect, useRef, useState } from "react";

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
}

export const EditableField = ({
  value,
  onChange,
  multiline = false,
  className = "",
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
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-text whitespace-pre-wrap p-1 ${
        value ? "" : "italic text-gray-400"
      } ${className}`}
      tabIndex={0}
      aria-label="Edit text"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setIsEditing(true);
        }
      }}
    >
      {value || "Click to edit"}
    </div>
  );
};
