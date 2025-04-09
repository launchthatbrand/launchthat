"use client";

import { GripVertical } from "lucide-react";

interface DragHandleProps {
  className?: string;
}

export const DragHandle = ({ className = "" }: DragHandleProps) => {
  return (
    <div
      className={`cursor-grab p-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing print:hidden ${className}`}
    >
      <GripVertical size={20} />
    </div>
  );
};
