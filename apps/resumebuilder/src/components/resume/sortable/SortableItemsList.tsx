"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "../SortableItem";
import type { SortableItem as SortableItemType } from "../SortableSection";
import type { TemplateStyles } from "@/config/templates";

interface SortableItemsListProps {
  items: SortableItemType[];
  multiline: boolean;
  templateStyle: TemplateStyles;
  templateName: string;
  onItemChange: (id: string, value: string) => void;
  onRemoveItem: (id: string) => void;
  isSidebar?: boolean;
}

export function SortableItemsList({
  items,
  multiline,
  templateStyle,
  templateName,
  onItemChange,
  onRemoveItem,
  isSidebar = false,
}: SortableItemsListProps) {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div className={`space-y-${isSidebar ? "2" : "3"}`}>
        {items.map((item) => (
          <SortableItem
            key={item.id}
            id={item.id}
            value={item.value}
            onChange={(value) => onItemChange(item.id, value)}
            multiline={multiline}
            templateStyles={templateStyle}
            templateName={templateName}
            onRemove={
              items.length > 1 ? () => onRemoveItem(item.id) : undefined
            }
            isSidebar={isSidebar}
          />
        ))}
      </div>
    </SortableContext>
  );
}
