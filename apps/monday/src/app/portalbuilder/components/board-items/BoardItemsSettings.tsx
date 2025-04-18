import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Search,
  Filter,
  Eye,
  ArrowUpRightFromSquare,
  ListCollapse,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { useBoardItems } from "../../hooks/useBoardItems";
import { useBoardInfo } from "../../hooks/useBoardInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { X, GripVertical } from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {SettingsSection} from "../shared/SettingsAccordion";
import { BaseWidgetSettingsComponent } from "../shared/BaseWidgetSettings";
import type {BoardColumn, BoardItemsSettings, FilterGroup} from "../../types/board-items";
import { FilterGroupSettings } from "./settings/FilterGroupSettings";
import { ViewSettings } from "./settings/ViewSettings";
import { ActionButtonSettings } from "./settings/ActionButtonSettings";
import { SummarySettings } from "./settings/SummarySettings";

type ViewType = "table" | "grid";

interface BoardItemsSettingsProps {
  component: {
    settings: Partial<BoardItemsSettings>;
  };
  onSettingsChange: (settings: Partial<BoardItemsSettings>) => void;
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
    console.log("Selected column:", column);
    console.log("Column type:", column.type);
    console.log("Raw settings string:", column.settings_str);
    console.log(
      "Raw settings string (parsed):",
      column.settings_str ? JSON.parse(column.settings_str) : null,
    );

    let options: {
      id: string;
      label: string;
      value: string;
      color?: string;
    }[] = [];
    let numberRange: { min: number; max: number } | undefined;

    if (column.type === "dropdown" || column.type === "status") {
      try {
        const settings = column.settings_str
          ? JSON.parse(column.settings_str)
          : {};

        console.log("Raw column settings for status column:", {
          settings_str: column.settings_str,
          parsed: settings,
          hasLabels: !!settings.labels,
          hasColors: !!settings.labels_colors,
          labelEntries: settings.labels ? Object.entries(settings.labels) : [],
          colorEntries: settings.labels_colors
            ? Object.entries(settings.labels_colors)
            : [],
          rawLabelsColors: settings.labels_colors,
        });

        // Extract labels and colors from the settings
        if (settings.labels) {
          const processedOptions = Object.entries(settings.labels).map(
            ([mondayId, labelData]) => {
              // Monday.com labels can be either strings or objects with a name property
              const labelValue =
                typeof labelData === "object" && labelData !== null
                  ? (labelData as { name?: string }).name ?? ""
                  : String(labelData);

              // Get color from labels_colors if available (for status type)
              const colorData = settings.labels_colors?.[mondayId];
              const color = colorData?.color;

              console.log(`Processing status label ${mondayId}:`, {
                mondayId,
                labelValue,
                labelData,
                colorData,
                color,
                allColors: settings.labels_colors,
              });

              return {
                id: mondayId, // Keep the original Monday.com ID
                label: labelValue,
                value: labelValue,
                ...(color && { color }), // Only include color if it exists
              };
            },
          );

          options = processedOptions;
        }
        console.log("Final processed options with colors:", options);
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

        // Default to buttons filter type for numbers
        const filterType = group.filterType ?? "buttons";

        if (filterType === "price") {
          // Create three price ranges
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
          // Create 4 ranges for regular number filtering
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

        {/* Filter Type Selection for Number Columns */}
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

                let options: {
                  id: string;
                  label: string;
                  value: string;
                }[] = [];
                const settings = column.settings_str
                  ? JSON.parse(column.settings_str)
                  : {};
                const numberRange = {
                  min: settings.min ?? 0,
                  max: settings.max ?? 100,
                };

                if (value === "price") {
                  // Create three price ranges
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
                  // Create 4 ranges for regular number filtering
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

        {/* Visible Options Selection - Only show for dropdown/status columns */}
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

export function BoardItemsSettings({
  component,
  onSettingsChange,
}: BoardItemsSettingsProps) {
  const { boardId } = useBoardInfo();
  const { data, isLoading: isLoadingColumns } = useBoardItems(boardId);
  const columns = data?.boards[0]?.columns ?? [];

  if (isLoadingColumns) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    );
  }

  // Define widget-specific sections
  const customSections: SettingsSection[] = [
    {
      id: "search",
      title: "Search Settings",
      icon: Search,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Search</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to search through items
              </p>
            </div>
            <Switch
              checked={component.settings.showSearch ?? false}
              onCheckedChange={(checked) =>
                onSettingsChange({ showSearch: checked })
              }
            />
          </div>
        </div>
      ),
    },
    {
      id: "filters",
      title: "Filter Settings",
      icon: Filter,
      content: (
        <FilterGroupSettings
          settings={component.settings}
          onSettingsChange={onSettingsChange}
          columns={columns}
          isLoadingColumns={isLoadingColumns}
        />
      ),
    },
    {
      id: "view",
      title: "View Settings",
      icon: Eye,
      content: (
        <ViewSettings
          settings={component.settings}
          onSettingsChange={onSettingsChange}
          columns={columns}
        />
      ),
    },
    {
      id: "actions",
      title: "Action Button",
      icon: ArrowUpRightFromSquare,
      content: (
        <ActionButtonSettings
          settings={component.settings}
          onSettingsChange={onSettingsChange}
          columns={columns}
        />
      ),
    },
    {
      id: "summary",
      title: "Summary Settings",
      icon: ListCollapse,
      content: (
        <SummarySettings
          settings={component.settings}
          onSettingsChange={onSettingsChange}
          columns={columns}
        />
      ),
    },
  ];

  return (
    <BaseWidgetSettingsComponent
      settings={component.settings}
      onSettingsChange={onSettingsChange}
      customSections={customSections}
      enabledCommonSections={[]}
    />
  );
}
