"use client";

import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "./DragHandle";
import { EditableField } from "./EditableField";
import type { TemplateStyles } from "@/config/templates";
import { Trash } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

interface SortableItemProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  templateStyles: TemplateStyles;
  onRemove?: () => void;
}

export const SortableItem = ({
  id,
  value,
  onChange,
  className = "",
  multiline = false,
  templateStyles,
  onRemove,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 ${templateStyles.item} ${
        isDragging ? "opacity-50" : ""
      } ${className}`}
    >
      <div {...attributes} {...listeners} className="print:hidden">
        <DragHandle />
      </div>
      <div className="flex-1 print:pl-0">
        <EditableField
          value={value}
          onChange={onChange}
          multiline={multiline}
          className={templateStyles.input}
        />
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-red-500 print:hidden"
          aria-label="Remove item"
        >
          <Trash size={16} />
        </button>
      )}
    </div>
  );
};
