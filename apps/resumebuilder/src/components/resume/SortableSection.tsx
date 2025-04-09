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
import { SortableItem } from "./SortableItem";
import type { TemplateStyles } from "@/config/templates";
import { Trash2 } from "lucide-react";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { templates } from "@/config/templates";

interface SortableItem {
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

  // Safely determine which template to use, with modern as default
  const isValidTemplateName = (key: string): key is keyof typeof templates => {
    return Object.keys(templates).includes(key);
  };

  // Set template style with proper type checking
  const templateStyle: TemplateStyles =
    templateName && isValidTemplateName(templateName)
      ? templates[templateName]
      : templates.modern;

  // For print view or pdf export, we need to ensure all sections are expanded
  const accordionValue = defaultOpen ? "section-content" : undefined;

  return (
    <div
      className={`group relative transition-all duration-200 ${templateStyle.section} ${className}`}
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
              className={`relative transition-all duration-200 hover:no-underline ${templateStyle.sectionTitle} px-0 py-1`}
            >
              {title}
            </AccordionTrigger>
            {onDelete && (
              <button
                onClick={onDelete}
                className="rounded-full p-1 text-red-500 hover:bg-red-50 hover:text-red-700 print:hidden"
                aria-label={`Delete ${title} section`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <AccordionContent className="pb-0 pt-2">
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
                <div className="space-y-3">
                  {items.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      value={item.value}
                      onChange={(value) => handleItemChange(item.id, value)}
                      multiline={multiline}
                      templateStyles={templateStyle}
                      onRemove={
                        items.length > 1
                          ? () => handleRemoveItem(item.id)
                          : undefined
                      }
                    />
                  ))}
                </div>
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
