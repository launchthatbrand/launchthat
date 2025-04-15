"use client";

import type { TemplateStyles } from "@/config/templates";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash } from "lucide-react";

import { DragHandle } from "./DragHandle";
import { EditableField } from "./EditableField";

interface SortableItemProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  templateStyles: TemplateStyles;
  templateName?: string;
  onRemove?: () => void;
  isSidebar?: boolean;
}

export const SortableItem = ({
  id,
  value,
  onChange,
  className = "",
  multiline = false,
  templateStyles,
  templateName = "",
  onRemove,
  isSidebar = false,
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

  // Use sidebar item styling if available and in sidebar mode
  const itemClass =
    isSidebar && templateStyles.sidebarItem
      ? templateStyles.sidebarItem
      : templateStyles.item;

  // Determine the appropriate input style based on context
  const inputStyleClass =
    isSidebar && templateStyles.sidebarInput
      ? templateStyles.sidebarInput
      : templateStyles.input;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 ${itemClass} ${
        isDragging ? "opacity-50" : ""
      } ${!isSidebar && templateName === "creative" ? "text-gray-800" : ""} ${
        isSidebar && templateName === "creative" ? "text-white" : ""
      } ${className}`}
      data-item-id={id}
      data-sortable-item="true"
      data-item-type={isSidebar ? "sidebar-item" : "main-item"}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none print:hidden"
      >
        <DragHandle />
      </div>
      <div className="hidden print:block print:pt-[9px]" aria-hidden="true">
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: isSidebar
              ? "var(--sidebar-bullet-color, black)"
              : "black",
          }}
        ></div>
      </div>
      <div className="flex-1 print:pl-2" data-item-content="true">
        <EditableField
          value={value}
          onChange={onChange}
          multiline={multiline}
          className={`${inputStyleClass} print:border-none print:px-0 print:py-0 print:shadow-none print:focus:ring-0`}
          isSidebar={isSidebar}
          templateName={templateName}
        />
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-red-500 print:hidden"
          aria-label="Remove item"
        >
          <Trash size={isSidebar ? 14 : 16} />
        </button>
      )}
    </div>
  );
};
