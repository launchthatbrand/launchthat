"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { DragEndEvent } from "@dnd-kit/core";
import { SortableItemsList } from "./sortable/SortableItemsList";
import { Trash2 } from "lucide-react";
import { getTemplateStyles } from "@/config/templates";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

export interface SortableItem {
  id: string;
  value: string;
}

interface SortableSectionProps {
  items: SortableItem[];
  onItemsChange: (items: SortableItem[]) => void;
  title: string;
  className?: string;
  multiline?: boolean;
  templateName: string;
  onDelete?: () => void;
  defaultOpen?: boolean;
  isSidebar?: boolean;
}

export const SortableSection = ({
  items,
  onItemsChange,
  title,
  className = "",
  multiline = false,
  templateName,
  onDelete,
  defaultOpen = true,
  isSidebar = false,
}: SortableSectionProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      onItemsChange(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleItemChange = (id: string, newValue: string) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, value: newValue } : item,
    );
    onItemsChange(newItems);
  };

  const handleAddItem = () => {
    const newId = `item-${Date.now()}`;
    onItemsChange([...items, { id: newId, value: "" }]);
  };

  const handleRemoveItem = (id: string) => {
    // Prevent removing the last item
    if (items.length <= 1) return;

    const newItems = items.filter((item) => item.id !== id);
    onItemsChange(newItems);
  };

  // Get template styles directly using the helper function
  const templateStyle = getTemplateStyles(templateName);

  // For print view or pdf export, we need to ensure all sections are expanded
  const accordionValue = defaultOpen ? "section-content" : undefined;

  // Use sidebar styling if available and in sidebar mode
  const sectionClass =
    isSidebar && templateStyle.sidebarSection
      ? templateStyle.sidebarSection
      : templateStyle.section;

  const titleClass =
    isSidebar && templateStyle.sidebarTitle
      ? templateStyle.sidebarTitle
      : templateStyle.sectionTitle;

  return (
    <div
      className={`group relative transition-all duration-200 ${sectionClass} ${className} section`}
      data-section-id={title.toLowerCase().replace(/\s+/g, "-")}
      data-section-type={title.toLowerCase().replace(/\s+/g, "-")}
      data-is-sidebar={isSidebar.toString()}
    >
      <Accordion
        type="single"
        collapsible
        defaultValue={accordionValue}
        className="w-full print:border-none"
      >
        <AccordionItem value="section-content" className="border-none">
          <div className="mb-3 flex items-center justify-between">
            <AccordionTrigger
              className={`section-title relative transition-all duration-200 hover:no-underline ${titleClass} px-0 py-1 ${
                !isSidebar && templateName === "creative" ? "text-gray-900" : ""
              }`}
              data-title-text={title}
            >
              {title}
            </AccordionTrigger>
            {onDelete && (
              <button
                onClick={onDelete}
                className="rounded-full p-1 text-red-500 hover:bg-red-50 hover:text-red-700 print:hidden"
                aria-label={`Delete ${title} section`}
              >
                <Trash2 size={isSidebar ? 14 : 16} />
              </button>
            )}
          </div>
          <AccordionContent
            className="section-content pb-0 pt-2"
            data-content-type="section-items"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                <SortableItemsList
                  items={items}
                  multiline={multiline}
                  templateStyle={templateStyle}
                  templateName={templateName}
                  onItemChange={handleItemChange}
                  onRemoveItem={handleRemoveItem}
                  isSidebar={isSidebar}
                />
              </SortableContext>
            </DndContext>

            <button
              onClick={handleAddItem}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 print:hidden"
            >
              + Add item
            </button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
