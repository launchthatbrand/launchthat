import {
  type BoardColumn,
  type BoardItemsSettings,
  type FilterGroup,
} from "../../../types/board-items";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { PlusCircle, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FilterGroupSettingsProps {
  settings: Partial<BoardItemsSettings>;
  onSettingsChange: (settings: Partial<BoardItemsSettings>) => void;
  columns: BoardColumn[];
  isLoadingColumns: boolean;
}

// Styled components for filter groups
const FilterGroupCard = Card;

const FilterGroupHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("mb-4 flex items-center justify-between", className)}>
    {children}
  </div>
);

const FilterGroupTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h4 className={cn("text-sm font-medium text-gray-700", className)}>
    {children}
  </h4>
);

const FilterGroupContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("space-y-4", className)}>{children}</div>;

function SortableFilterGroupCard({
  group,
  index,
  onDelete,
  onSettingsChange,
  columns,
  isLoadingColumns,
}: {
  group: FilterGroup;
  index: number;
  onDelete: () => void;
  onSettingsChange: (settings: FilterGroup) => void;
  columns: BoardColumn[];
  isLoadingColumns: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleColumnSelection = (value: string) => {
    const column = columns.find((col) => col.id === value);
    if (!column) return;

    let options: Array<{
      id: string;
      label: string;
      value: string;
      color?: string;
    }> = [];
    let numberRange: { min: number; max: number } | undefined;

    if (column.type === "dropdown" || column.type === "status") {
      try {
        const settings = column.settings_str
          ? JSON.parse(column.settings_str)
          : {};

        if (settings.labels) {
          const processedOptions = Object.entries(settings.labels).map(
            ([mondayId, labelData]) => {
              const labelValue =
                typeof labelData === "object" && labelData !== null
                  ? (labelData as { name?: string }).name ?? ""
                  : String(labelData);

              const colorData = settings.labels_colors?.[mondayId];
              const color = colorData?.color;

              return {
                id: mondayId,
                label: labelValue,
                value: labelValue,
                ...(color && { color }),
              };
            },
          );

          options = processedOptions;
        }
      } catch (error) {
        console.error("Error parsing column settings:", error);
      }
    } else if (column.type === "numbers") {
      try {
        const settings = column.settings_str
          ? JSON.parse(column.settings_str)
          : {};
        numberRange = {
          min: settings.min ?? 0,
          max: settings.max ?? 100,
        };

        const filterType = group.filterType ?? "buttons";

        if (filterType === "price") {
          const range = numberRange.max - numberRange.min;
          const step = range / 3;
          options = [
            {
              id: "price-1",
              label: "$",
              value: `${numberRange.min}-${numberRange.min + step}`,
            },
            {
              id: "price-2",
              label: "$$",
              value: `${numberRange.min + step}-${numberRange.min + 2 * step}`,
            },
            {
              id: "price-3",
              label: "$$$",
              value: `${numberRange.min + 2 * step}-${numberRange.max}`,
            },
          ];
        } else {
          const step = (numberRange.max - numberRange.min) / 4;
          for (let i = 0; i < 4; i++) {
            const start = numberRange.min + i * step;
            const end =
              i === 3 ? numberRange.max : numberRange.min + (i + 1) * step;
            options.push({
              id: `range-${i}`,
              label: `${Math.round(start)} - ${Math.round(end)}`,
              value: `${start}-${end}`,
            });
          }
        }
      } catch (error) {
        console.error("Error parsing column settings:", error);
      }
    }

    onSettingsChange({
      ...group,
      linkedColumn: value,
      columnType: column.type as "dropdown" | "status" | "numbers",
      options,
      numberRange: column.type === "numbers" ? numberRange : undefined,
      filterType:
        column.type === "numbers" ? group.filterType ?? "buttons" : undefined,
      visibleOptionIds: options.map((opt) => opt.id),
    });
  };

  return (
    <FilterGroupCard
      ref={setNodeRef}
      style={style}
      className={cn(
        "mb-4 space-y-4 p-4",
        isDragging && "cursor-grabbing opacity-50",
      )}
    >
      <FilterGroupHeader>
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-1 hover:bg-muted"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          <FilterGroupTitle>Filter Group {index + 1}</FilterGroupTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </FilterGroupHeader>

      <FilterGroupContent>
        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={group.label}
            onChange={(e) =>
              onSettingsChange({ ...group, label: e.target.value })
            }
            placeholder="Enter filter group label"
          />
        </div>

        <div className="space-y-2">
          <Label>Linked Column</Label>
          <Select
            value={group.linkedColumn}
            onValueChange={(value) => {
              handleColumnSelection(value);
              onSettingsChange({
                ...group,
                linkedColumn: value,
                columnType:
                  columns.find((col) => col.id === value)?.type === "numbers"
                    ? "numbers"
                    : "status",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a column" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Selection Mode</Label>
          <Select
            value={group.selectionMode ?? "multiple"}
            onValueChange={(value: "single" | "multiple") =>
              onSettingsChange({ ...group, selectionMode: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Selection</SelectItem>
              <SelectItem value="multiple">Multiple Selection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Alignment</Label>
          <Select
            value={group.alignment ?? "start"}
            onValueChange={(value: "start" | "center" | "end") =>
              onSettingsChange({ ...group, alignment: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="start">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="end">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {group.columnType === "numbers" && (
          <div className="space-y-2">
            <Label className="text-xs">Filter Type</Label>
            <Select
              value={group.filterType ?? "buttons"}
              onValueChange={(value: "buttons" | "price") => {
                const column = columns.find(
                  (col) => col.id === group.linkedColumn,
                );
                if (!column) return;

                let options: Array<{
                  id: string;
                  label: string;
                  value: string;
                }> = [];
                const settings = column.settings_str
                  ? JSON.parse(column.settings_str)
                  : {};
                const numberRange = {
                  min: settings.min ?? 0,
                  max: settings.max ?? 100,
                };

                if (value === "price") {
                  const range = numberRange.max - numberRange.min;
                  const step = range / 3;
                  options = [
                    {
                      id: "price-1",
                      label: "$",
                      value: `${numberRange.min}-${numberRange.min + step}`,
                    },
                    {
                      id: "price-2",
                      label: "$$",
                      value: `${numberRange.min + step}-${numberRange.min + 2 * step}`,
                    },
                    {
                      id: "price-3",
                      label: "$$$",
                      value: `${numberRange.min + 2 * step}-${numberRange.max}`,
                    },
                  ];
                } else {
                  const step = (numberRange.max - numberRange.min) / 4;
                  for (let i = 0; i < 4; i++) {
                    const start = numberRange.min + i * step;
                    const end =
                      i === 3
                        ? numberRange.max
                        : numberRange.min + (i + 1) * step;
                    options.push({
                      id: `range-${i}`,
                      label: `${Math.round(start)} - ${Math.round(end)}`,
                      value: `${start}-${end}`,
                    });
                  }
                }

                onSettingsChange({
                  ...group,
                  filterType: value,
                  options,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buttons">Range Buttons</SelectItem>
                <SelectItem value="price">Price ($, $$, $$$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {(group.columnType === "dropdown" || group.columnType === "status") &&
          group.options.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs">Visible Options</Label>
              <p className="text-xs text-muted-foreground">
                Select which options should be shown to users
              </p>
              <MultiSelect
                value={
                  group.visibleOptionIds ?? group.options.map((opt) => opt.id)
                }
                onValueChange={(values) => {
                  onSettingsChange({
                    ...group,
                    visibleOptionIds: values,
                  });
                }}
                options={group.options.map((opt) => ({
                  label: opt.label,
                  value: opt.id,
                }))}
                placeholder="Select visible options..."
              />
            </div>
          )}
      </FilterGroupContent>
    </FilterGroupCard>
  );
}

export function FilterGroupSettings({
  settings,
  onSettingsChange,
  columns,
  isLoadingColumns,
}: FilterGroupSettingsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Create a new filter group
  const createNewFilterGroup = () => {
    const newGroup: FilterGroup = {
      id: crypto.randomUUID(),
      label: "New Filter Group",
      linkedColumn: "",
      columnType: "dropdown",
      selectionMode: "multiple",
      options: [],
    };

    onSettingsChange({
      ...settings,
      filterGroups: [...(settings.filterGroups ?? []), newGroup],
    });
  };

  // Handle drag end for filter groups
  const handleFilterGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !settings.filterGroups?.length)
      return;

    const oldIndex = settings.filterGroups.findIndex((g) => g.id === active.id);
    const newIndex = settings.filterGroups.findIndex((g) => g.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newFilterGroups = arrayMove(
      settings.filterGroups,
      oldIndex,
      newIndex,
    );
    onSettingsChange({
      ...settings,
      filterGroups: newFilterGroups,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base font-semibold">Enable Filters</Label>
          <div className="text-xs text-muted-foreground">
            Allow users to filter board items using dropdown values
          </div>
        </div>
        <Switch
          checked={settings.enableFilters ?? false}
          onCheckedChange={(checked) => {
            onSettingsChange({
              ...settings,
              enableFilters: checked,
              filterGroups: checked ? settings.filterGroups : undefined,
            });
          }}
        />
      </div>

      {settings.enableFilters && (
        <div className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={createNewFilterGroup}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Filter Group
          </Button>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleFilterGroupDragEnd}
          >
            <SortableContext
              items={(settings.filterGroups ?? []).map((g) => g.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {(settings.filterGroups ?? []).map((group, index) => (
                  <SortableFilterGroupCard
                    key={group.id}
                    group={group}
                    index={index}
                    onDelete={() => {
                      const newFilterGroups = settings.filterGroups!.filter(
                        (_, i) => i !== index,
                      );
                      onSettingsChange({
                        ...settings,
                        filterGroups: newFilterGroups,
                      });
                    }}
                    onSettingsChange={(newSettings) => {
                      const newFilterGroups = [...settings.filterGroups!];
                      newFilterGroups[index] = newSettings;
                      onSettingsChange({
                        ...settings,
                        filterGroups: newFilterGroups,
                      });
                    }}
                    columns={columns}
                    isLoadingColumns={isLoadingColumns}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
