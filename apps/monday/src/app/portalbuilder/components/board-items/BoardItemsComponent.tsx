import type {PortalBuilderComponent} from "../../types";
import { useBoardInfo } from "../../hooks/useBoardInfo";
import { formatNumberWithSymbol } from "../../utils/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import mondaySdk from "monday-sdk-js";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Grid2X2,
  List,
  Table as TableIcon,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { ColumnListView } from "../shared/ColumnListView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBoardItems } from "../../hooks/useBoardItems";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

const monday = mondaySdk();

type ViewType = "table" | "grid";

interface FilterGroup {
  id: string;
  label: string;
  linkedColumn: string;
  columnType: "dropdown" | "status" | "numbers" | "label";
  filterType?: "buttons" | "price";
  options: {
    id: string;
    label: string;
    value: string;
    color?: string;
  }[];
  numberRange?: {
    min: number;
    max: number;
  };
  selectionMode?: "single" | "multiple";
  visibleOptionIds?: string[];
  alignment?: "start" | "center" | "end";
}

interface BoardItemsSettings {
  title: string;
  itemsPerPage: number;
  hiddenColumns: string[];
  viewType: ViewType;
  gridColumns?: number;
  groupByColumn?: string;
  showActionButton?: boolean;
  actionButtonText?: string;
  actionButtonColumn?: string;
  actionButtonType?: "link" | "details";
  actionButtonStyle?: "button" | "card";
  actionButtonBehavior?: "new_tab" | "popup";
  showFeaturedImage?: boolean;
  featuredImageColumn?: string;
  cardLayout?: {
    imagePosition?: "stacked" | "inline" | "none";
    imageFit?: "contain" | "cover" | "default";
    infoColumns?: number;
    enableTextTruncation?: boolean;
    textTruncationLines?: number;
    sameHeight?: boolean;
  };
  showSearch?: boolean;
  enableFilters?: boolean;
  filterGroups?: FilterGroup[];
  enableSummary?: boolean;
  summaryColumns?: string[];
  actionButtonAlignment?: "top" | "bottom";
  backgroundColor?: string;
  categoryColumn?: string;
}

interface BoardItem {
  id: string;
  name: string;
  column_values: {
    id: string;
    text: string;
    value: string;
    column: {
      id: string;
      title: string;
      type: string;
      settings_str?: string;
    };
  }[];
  group?: {
    id: string;
    title: string;
    color: string;
  };
}

interface BoardColumn {
  id: string;
  title: string;
  type: string;
  settings_str?: string;
}

interface BoardItemsComponentProps {
  component: PortalBuilderComponent;
  isPreview?: boolean;
}

// Add isLightColor function
const isLightColor = (color: string): boolean => {
  // Convert hex to RGB
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

// Add animation variants
const filterToggleVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const cardVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const groupVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const tableRowVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: { opacity: 0, x: 20 },
};

export function BoardItemsComponent({
  component,
  isPreview,
}: BoardItemsComponentProps) {
  const { boardId } = useBoardInfo();
  const settings = component.settings as unknown as BoardItemsSettings;
  const { data, isLoading } = useBoardItems(boardId);
  const [selectedItems, setSelectedItems] = useState<BoardItem[]>([]);

  // Track selected filters per group
  const [selectedFiltersByGroup, setSelectedFiltersByGroup] = useState<
    Record<string, string[]>
  >({});
  const [searchQuery, setSearchQuery] = useState("");

  const items = data?.boards[0]?.items_page.items ?? [];
  const allColumns =
    data?.boards[0]?.columns.filter(
      (col) => col.type !== "name" && !["name", "Name"].includes(col.title),
    ) ?? [];

  // Filter items based on search query and selected filters
  const filteredItems = items.filter((item) => {
    // First check if item matches selected filters
    if (
      settings.enableFilters &&
      settings.filterGroups &&
      settings.filterGroups.length > 0
    ) {
      // Check each filter group
      const matches = settings.filterGroups.map((group) => {
        const selectedFiltersForGroup = selectedFiltersByGroup[group.id] ?? [];
        if (selectedFiltersForGroup.length === 0) return true; // If no filters selected in group, consider it a match

        const columnValue = item.column_values.find(
          (cv) => cv.column.id === group.linkedColumn,
        );

        if (!columnValue?.text) return false;

        if (group.columnType === "numbers") {
          const numValue = parseFloat(columnValue.text);
          if (isNaN(numValue)) return false;

          // For number columns, any selected range should match
          return selectedFiltersForGroup.some((range) => {
            const [start, end] = range.split("-").map(parseFloat);
            return numValue >= start && numValue <= end;
          });
        } else {
          // For dropdown and status columns, normalize the values for comparison
          // Split the column value in case it contains multiple values
          const columnValues = columnValue.text
            .split(/,\s*/)
            .map((v) => v.toLowerCase().trim());
          const normalizedFilters = selectedFiltersForGroup.map((f) =>
            f.toLowerCase().trim(),
          );

          // In single mode, the value must match the one selected filter
          if (group.selectionMode === "single") {
            return columnValues.includes(normalizedFilters[0]);
          } else {
            // In multiple mode, check if any of the column values match any of the selected filters
            return columnValues.some((value) =>
              normalizedFilters.includes(value),
            );
          }
        }
      });

      // Item must match all filter groups
      if (!matches.every(Boolean)) return false;
    }

    // Then check if item matches search query
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();

    // Search in item name
    if (item.name.toLowerCase().includes(searchLower)) return true;

    // Search in column values
    return item.column_values.some(
      (cv) => cv.text?.toLowerCase().includes(searchLower),
    );
  });

  // Render filter groups
  const renderFilterGroups = () => {
    if (!settings.enableFilters || !settings.filterGroups?.length) return null;

    return (
      <div className="mb-4 space-y-4">
        {settings.filterGroups.map((group) => {
          const selectedFiltersForGroup =
            selectedFiltersByGroup[group.id] ?? [];
          const visibleOptions = group.options.filter((option) =>
            (
              group.visibleOptionIds ?? group.options.map((opt) => opt.id)
            ).includes(option.id),
          );

          const column = allColumns.find(
            (col) => col.id === group.linkedColumn,
          );
          if (!column) return null;

          const filterContainerClasses = cn("flex flex-wrap gap-2", {
            "justify-start": group.alignment === "start" || !group.alignment,
            "justify-center": group.alignment === "center",
            "justify-end": group.alignment === "end",
          });

          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {group.label && (
                <Label className="text-sm font-medium">{group.label}</Label>
              )}
              <div className={filterContainerClasses}>
                {group.columnType === "numbers" &&
                group.filterType === "price" ? (
                  <ToggleGroup
                    type="multiple"
                    value={selectedFiltersByGroup[group.id] ?? []}
                    onValueChange={(value: string[]) =>
                      setSelectedFiltersByGroup((prev) => ({
                        ...prev,
                        [group.id]: value,
                      }))
                    }
                    className={cn(
                      "flex flex-wrap gap-2",
                      group.alignment === "center" && "justify-center",
                      group.alignment === "end" && "justify-end",
                      !group.alignment && "justify-start",
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {/* {group.options.map((option) => (
                        <motion.div
                          key={option.id}
                          variants={filterToggleVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <ToggleGroupItem
                            value={option.value}
                            aria-label={option.label}
                            // className={cn(
                            //   "rounded-full px-3 py-1 text-sm transition-all duration-200",
                            //   option.color && {
                            //     "border !bg-red-400": true,

                            //     "hover:bg-[var(--status-color)] hover:bg-opacity-10":
                            //       true,
                            //     "text-foreground": true,
                            //     "data-[state=on]:bg-[var(--status-color)]":
                            //       true,
                            //     "data-[state=on]:text-white": true,
                            //     "data-[state=on]:border-transparent": true,
                            //   },
                            // )}
                            // style={
                            //   option.color
                            //     ? ({
                            //         "--status-color": option.color,
                            //       } as React.CSSProperties)
                            //     : undefined
                            // }
                          >
                            {option.label}
                          </ToggleGroupItem>
                        </motion.div>
                      ))} */}
                    </AnimatePresence>
                  </ToggleGroup>
                ) : group.columnType === "numbers" ? (
                  <div
                    className={cn(
                      "space-y-2",
                      group.alignment === "center" &&
                        "flex flex-col items-center",
                      group.alignment === "end" && "flex flex-col items-end",
                      !group.alignment && "flex flex-col items-start",
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {group.options.map((option) => (
                        <motion.div
                          key={option.id}
                          variants={filterToggleVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={option.id}
                              checked={selectedFiltersByGroup[
                                group.id
                              ]?.includes(option.value)}
                              onCheckedChange={(checked) => {
                                setSelectedFiltersByGroup((prev) => {
                                  const currentValues = prev[group.id] ?? [];
                                  return {
                                    ...prev,
                                    [group.id]: checked
                                      ? [...currentValues, option.value]
                                      : currentValues.filter(
                                          (v) => v !== option.value,
                                        ),
                                  };
                                });
                              }}
                            />
                            <Label htmlFor={option.id}>{option.label}</Label>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    {group.selectionMode === "single" ? (
                      <ToggleGroup
                        type="single"
                        value={selectedFiltersByGroup[group.id]?.[0] ?? ""}
                        onValueChange={(value: string) => {
                          setSelectedFiltersByGroup((prev) => ({
                            ...prev,
                            [group.id]: value ? [value] : [],
                          }));
                        }}
                        className={cn(
                          "flex flex-wrap gap-2",
                          group.alignment === "center" && "justify-center",
                          group.alignment === "end" && "justify-end",
                          !group.alignment && "justify-start",
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {visibleOptions.map((option) => (
                            <motion.div
                              key={option.id}
                              variants={filterToggleVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <ToggleGroupItem
                                value={option.value}
                                aria-label={option.label}
                                className={cn(
                                  "rounded-full px-3 py-1 text-sm transition-all duration-200",
                                  option.color && {
                                    "border bg-white": true,
                                    "border-[var(--status-color)] bg-[var(--status-color)]":
                                      true,
                                    "hover:bg-black hover:text-white": true,
                                    "text-foreground": true,
                                    "data-[state=on]:bg-[var(--status-color)]":
                                      true,
                                    "data-[state=on]:text-white ": true,
                                    "data-[state=on]:border-transparent": true,
                                    "data-[state=on]:bg-black": true,
                                  },
                                )}
                                style={
                                  option.color
                                    ? ({
                                        "--status-color": `color-mix(in srgb, ${option.color} 40%, transparent)`,
                                      } as React.CSSProperties)
                                    : undefined
                                }
                              >
                                {option.label}
                              </ToggleGroupItem>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </ToggleGroup>
                    ) : (
                      <ToggleGroup
                        type="multiple"
                        value={selectedFiltersByGroup[group.id] ?? []}
                        onValueChange={(value: string[]) =>
                          setSelectedFiltersByGroup((prev) => ({
                            ...prev,
                            [group.id]: value,
                          }))
                        }
                        className={cn(
                          "flex flex-wrap gap-2",
                          group.alignment === "center" && "justify-center",
                          group.alignment === "end" && "justify-end",
                          !group.alignment && "justify-start",
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {visibleOptions.map((option) => (
                            <motion.div
                              key={option.id}
                              variants={filterToggleVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <ToggleGroupItem
                                value={option.value}
                                aria-label={option.label}
                                className={cn(
                                  "rounded-full px-3 py-1 text-sm transition-all duration-200",
                                  option.color && {
                                    "border bg-white": true,
                                    "border-[var(--status-color)]": true,
                                    "hover:bg-[var(--status-color-hover)]":
                                      true,
                                    "text-foreground": true,
                                    "data-[state=on]:bg-[var(--status-color)]":
                                      true,
                                    "data-[state=on]:text-white": true,
                                    "data-[state=on]:border-transparent": true,
                                  },
                                )}
                                style={
                                  option.color
                                    ? ({
                                        "--status-color": option.color,
                                        "--status-color-light": `color-mix(in srgb, ${option.color} 10%, transparent)`,
                                        "--status-color-hover": `color-mix(in srgb, ${option.color} 15%, transparent)`,
                                      } as React.CSSProperties)
                                    : undefined
                                }
                              >
                                {option.label}
                              </ToggleGroupItem>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </ToggleGroup>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Filter out hidden columns
  const hiddenColumns = settings.hiddenColumns ?? [];
  const columns = allColumns.filter((col) => !hiddenColumns.includes(col.id));
  const viewType = settings.viewType ?? "table";
  const gridColumns = settings.gridColumns ?? 3;
  const groupByColumn = settings.groupByColumn ?? null;

  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupUrl, setPopupUrl] = useState<string | null>(null);

  const getActionUrl = (item: BoardItem, actionButtonColumn: string) => {
    const columnValue = item.column_values.find(
      (cv) => cv.column.id === actionButtonColumn,
    );

    if (!columnValue) return "";

    if (columnValue.column.type === "files") {
      try {
        const fileData = JSON.parse(columnValue.value);
        const fileId = fileData?.files?.[0]?.assetId;
        if (fileId) {
          return `/api/monday-files/${fileId}`;
        }
      } catch (e) {
        console.error("Error parsing file value:", e);
      }
    }

    return columnValue.text || "";
  };

  const handleItemAction = (
    item: BoardItem,
    settings: BoardItemsSettings,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    const actionType = settings.actionButtonType ?? "link";
    const behavior = settings.actionButtonBehavior ?? "new_tab";

    if (actionType === "details") {
      if (behavior === "new_tab") {
        window.open(`/monday/b/${boardId}/item/${item.id}`, "_blank");
      } else {
        setSelectedItem(item);
        setIsPopupOpen(true);
      }
      return;
    }

    if (actionType === "link" && settings.actionButtonColumn) {
      const url = getActionUrl(item, settings.actionButtonColumn);
      if (!url) return;

      if (behavior === "new_tab") {
        window.open(url, "_blank");
      } else {
        setPopupUrl(url);
        setIsPopupOpen(true);
      }
    }
  };

  const renderColumnValue = (columnValue: {
    column: { type: string };
    value: string;
    text: string;
  }) => {
    if (columnValue.column.type === "file") {
      try {
        // Only try to parse if we have a value
        if (!columnValue.value) return null;

        const fileData = JSON.parse(columnValue.value);
        // Check if files array exists and has items
        if (!fileData?.files?.length) return null;

        // Find first valid file with a link
        const file = fileData.files.find(
          (file: { fileType: string; linkToFile: string }) =>
            file.fileType === "LINK" && file.linkToFile,
        );

        if (file?.linkToFile) {
          return (
            <a href={file.linkToFile} target="_blank" rel="noopener noreferrer">
              {file.name || "View File"}
            </a>
          );
        }
        return null;
      } catch (e) {
        console.error("Error parsing file value:", e);
        return null;
      }
    }

    // Handle link type columns
    if (columnValue.column.type === "link") {
      if (!columnValue.value) return null;
      const parsedValue = JSON.parse(columnValue.value);
      console.log(parsedValue);
      return (
        <a
          href={parsedValue.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {parsedValue.text}
        </a>
      );
    }

    // Handle phone type columns
    if (columnValue.column.type === "phone") {
      if (!columnValue.value) return null;

      const phoneNumber = JSON.parse(columnValue.value);
      const digitsOnly = phoneNumber.phone.replace(/\D/g, "");

      // Format as (XXX) XXX-XXXX
      const formattedPhoneNumber = digitsOnly.replace(
        /^(\d{3})(\d{3})(\d{4})$/,
        "($1) $2-$3",
      );

      return (
        <a
          href={`tel:${digitsOnly}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {formattedPhoneNumber}
        </a>
      );
    }

    // Handle dropdown and status values as badges
    if (
      columnValue.column.type === "dropdown" ||
      columnValue.column.type === "status"
    ) {
      const values = columnValue.text.split(/,\s*/).filter(Boolean) ?? [];
      return (
        <div className="flex flex-wrap gap-1.5">
          {values.map((value, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-2 py-0.5 text-xs font-medium"
            >
              {value}
            </Badge>
          ))}
        </div>
      );
    }

    return columnValue.text;
  };

  const renderTableView = (items: BoardItem[]) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {columns.map((column) => (
              <TableHead key={column.id}>{column.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.tr
                key={item.id}
                variants={tableRowVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
                transition={{
                  delay: index * 0.05,
                }}
                className={cn(
                  "transition-colors hover:bg-muted/50",
                  settings.showActionButton &&
                    (settings.actionButtonStyle ?? "button") === "card" &&
                    "cursor-pointer",
                )}
                onClick={(e) => {
                  if (
                    settings.showActionButton &&
                    (settings.actionButtonStyle ?? "button") === "card"
                  ) {
                    handleItemAction(item, settings, e);
                  }
                }}
              >
                <TableCell>{item.name}</TableCell>
                {columns.map((column) => {
                  const value = item.column_values.find(
                    (cv) => cv.column.id === column.id,
                  );
                  return (
                    <TableCell key={column.id}>
                      {value ? renderColumnValue(value) : null}
                    </TableCell>
                  );
                })}
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    );
  };

  const renderGridCard = (item: BoardItem) => {
    const settings = component.settings as unknown as BoardItemsSettings;
    const showActionButton = settings.showActionButton ?? false;
    const actionStyle = settings.actionButtonStyle ?? "button";
    const actionButtonText = settings.actionButtonText ?? "View Details";
    const cardLayout = settings.cardLayout ?? {};
    const showFeaturedImage = settings.showFeaturedImage ?? true;
    const isSelected = selectedItems.some((i) => i.id === item.id);

    // Get category value if category column is set
    const categoryValue = settings.categoryColumn
      ? item.column_values.find(
          (cv) =>
            cv.column.id === settings.categoryColumn &&
            cv.column.type === "status",
        )
      : null;

    // Get color from status column value using the same logic as filter groups
    let categoryColor = "primary";
    if (categoryValue?.value) {
      try {
        const statusData = JSON.parse(categoryValue.value);
        if (statusData?.index !== undefined) {
          const columnSettings = JSON.parse(
            categoryValue.column.settings_str ?? "{}",
          );
          const labelId = Object.keys(columnSettings.labels ?? {})[
            statusData.index
          ];
          if (labelId && columnSettings.labels_colors?.[labelId]) {
            categoryColor = columnSettings.labels_colors[labelId].color;
          }
        }
      } catch (e) {
        console.error("Error parsing status value:", e);
      }
    }

    const handleCardClick = (e: React.MouseEvent) => {
      // Don't handle card click if the click was on a link or phone number
      if ((e.target as HTMLElement).closest("a")) {
        return;
      }

      if (settings.enableSummary) {
        setSelectedItems((prev) => {
          if (isSelected) {
            return prev.filter((i) => i.id !== item.id);
          } else {
            return [...prev, item];
          }
        });
      }

      if (showActionButton && actionStyle === "card") {
        handleItemAction(item, settings, e);
      }
    };

    const actionButtonUrl =
      showActionButton && actionStyle === "button"
        ? getActionUrl(item, settings.actionButtonColumn!)
        : undefined;

    const renderActionButton = () => {
      if (!showActionButton || !actionButtonUrl) return null;
      return (
        <a
          href={actionButtonUrl}
          onClick={(e) => handleItemAction(item, settings, e)}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
        >
          <span className="relative">
            {actionButtonText ?? "Learn More"}
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary-foreground/50 transition-all duration-300 group-hover:w-full" />
          </span>
          <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      );
    };

    const renderImage = () => {
      if (!showFeaturedImage || cardLayout.imagePosition === "none")
        return null;

      const imageColumn = item.column_values.find(
        (col) => col.column.id === settings.featuredImageColumn,
      );

      if (!imageColumn) return null;

      let imageUrl: string | null = null;

      if (imageColumn.column.type === "file" && imageColumn.value) {
        try {
          const fileData = JSON.parse(imageColumn.value);
          const fileId = fileData?.files?.[0]?.assetId;
          if (fileId) {
            imageUrl = `/api/monday-files/${fileId}`;
          }
        } catch (e) {
          console.error("Error parsing file value:", e);
          return null;
        }
      } else if (imageColumn.column.type === "link" && imageColumn.text) {
        imageUrl = imageColumn.text;
      }

      if (!imageUrl) return null;

      const isInline = cardLayout.imagePosition === "inline";

      return (
        <div
          className={cn(
            "relative",
            isInline ? "aspect-square w-1/3" : "aspect-[16/9] w-full",
            cardLayout.imageFit === "contain" && "h-[125px] p-3",
            "print:aspect-[2/1] print:h-[100px]",
          )}
        >
          <Image
            src={imageUrl}
            alt={item.name}
            width={500}
            height={500}
            loading="eager"
            className={cn(
              "h-full w-full",
              cardLayout.imageFit === "contain" && "object-contain",
              cardLayout.imageFit === "cover" && "object-cover",
              cardLayout.imageFit === "default" && "object-none",
              cardLayout.imageFit ?? "object-cover",
              isInline && "rounded-l-lg",
            )}
          />
        </div>
      );
    };

    return (
      <Card
        className={cn(
          "group flex h-full flex-col overflow-hidden transition-all duration-200",
          (actionStyle === "card" && showActionButton) ?? settings.enableSummary
            ? "cursor-pointer hover:shadow-md"
            : "",
          isSelected && "ring-2 ring-primary ring-offset-2",
          cardLayout.sameHeight && "h-full",
          "print:shadow-none print:ring-0 print:hover:shadow-none",
          "print:mx-4 print:my-4 print:h-auto print:border print:border-gray-300",
        )}
        onClick={handleCardClick}
      >
        {categoryValue?.text && (
          <Badge
            className="w-full rounded-none px-4 py-1.5 text-center text-sm font-medium"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
            }}
          >
            {categoryValue.text}
          </Badge>
        )}
        <div
          className={cn(
            "relative flex flex-1",
            cardLayout.imagePosition === "inline" ? "flex-row" : "flex-col",
            categoryValue?.text && "pt-8",
          )}
        >
          {cardLayout.imagePosition === "stacked" && renderImage()}
          {cardLayout.imagePosition === "inline" && renderImage()}
          <CardContent
            className={cn(
              "flex flex-col",
              "flex-1 p-6",
              "print:p-3",
              cardLayout.imagePosition === "inline" ? "min-w-0" : "",
            )}
          >
            <h3
              className={cn(
                "text-lg font-semibold leading-tight",
                "mb-3 line-clamp-2 text-gray-900",
                "print:mb-2 print:text-base",
              )}
            >
              {item.name}
            </h3>
            <div
              className={cn(
                "grid gap-4",
                "print:gap-2",
                cardLayout.infoColumns === 1 && "md:grid-cols-1",
                cardLayout.infoColumns === 2 && "md:grid-cols-2",
                cardLayout.infoColumns === 3 && "md:grid-cols-3",
                !cardLayout.infoColumns && "md:grid-cols-2",
              )}
            >
              {item.column_values
                .filter(
                  (col) =>
                    !settings.hiddenColumns.includes(col.column.id) &&
                    col.text &&
                    col.column.id !== settings.featuredImageColumn,
                )
                .map((col) => {
                  const column = columns.find((c) => c.id === col.column.id);
                  return (
                    <div
                      key={col.column.id}
                      className={cn(
                        "space-y-1.5 overflow-hidden",
                        (col.column.type === "long-text" ||
                          col.column.type === "description" ||
                          col.column.type === "file") &&
                          cardLayout.infoColumns === 1
                          ? "col-span-1"
                          : cardLayout.infoColumns === 2
                            ? "col-span-2"
                            : cardLayout.infoColumns === 3
                              ? "col-span-3"
                              : "col-span-2",
                      )}
                    >
                      {column?.type !== "long_text" && (
                        <dt className="text-sm font-medium text-gray-500">
                          {col.column.title}
                        </dt>
                      )}
                      <dd
                        className={cn(
                          "break-words text-sm text-gray-900",
                          cardLayout.enableTextTruncation
                            ? `line-clamp-${cardLayout.textTruncationLines ?? 2}`
                            : "whitespace-pre-wrap",
                        )}
                      >
                        {column?.type === "numbers"
                          ? formatNumberWithSymbol(
                              col.text,
                              column.settings_str,
                            )
                          : renderColumnValue(col)}
                      </dd>
                    </div>
                  );
                })}
            </div>
            {showActionButton && actionStyle === "button" && (
              <div
                className={cn(
                  "flex w-full",
                  settings.actionButtonAlignment === "bottom"
                    ? "mt-auto pt-4"
                    : "mt-4",
                )}
              >
                {renderActionButton()}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    );
  };

  const renderGridView = (items: BoardItem[]) => {
    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className={cn(
          "grid gap-4",
          "print:gap-2",
          settings.cardLayout?.sameHeight && "auto-rows-fr",
          "grid-cols-1",
          "print:grid-cols-2 print:gap-x-4 print:gap-y-0",
          "md:grid-cols-[repeat(var(--grid-cols,6),minmax(0,1fr))]",
        )}
        style={
          {
            "--grid-cols": Math.min(gridColumns, 6),
          } as React.CSSProperties
        }
      >
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
              layoutId={item.id}
              className={cn(
                settings.cardLayout?.sameHeight && "h-full",
                "print:!break-inside-avoid-page",
              )}
            >
              {renderGridCard(item)}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderGroupView = (items: BoardItem[]) => {
    // Group items by the selected column
    const groupedItems: Record<
      string,
      { items: BoardItem[]; color?: string; borderColor?: string }
    > = {};

    if (groupByColumn === "monday_group") {
      // Group by Monday.com groups
      items.forEach((item) => {
        const groupId = item.group?.id ?? "ungrouped";
        const groupName = item.group?.title ?? "Ungrouped";
        if (!groupedItems[groupName]) {
          groupedItems[groupName] = {
            items: [],
            color: item.group?.color,
            borderColor: item.group?.color
              ? `${item.group.color}33`
              : undefined,
          };
        }
        groupedItems[groupName].items.push(item);
      });
    } else {
      // Group by selected column
      const column = allColumns.find((col) => col.id === groupByColumn);
      if (!column) return null;

      items.forEach((item) => {
        const columnValue = item.column_values.find(
          (cv) => cv.column.id === groupByColumn,
        );
        const groupName = columnValue?.text ?? "No Value";
        if (!groupedItems[groupName]) {
          groupedItems[groupName] = { items: [] };
        }
        groupedItems[groupName].items.push(item);
      });
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${Math.min(gridColumns, 6)}, minmax(0, 1fr))`,
        }}
      >
        <AnimatePresence mode="popLayout">
          {Object.entries(groupedItems).map(([groupName, group]) => (
            <motion.div
              key={groupName}
              variants={groupVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
            >
              <Card className="flex flex-col">
                <CardHeader
                  className={cn(
                    "border-b py-3",
                    group.color ? `bg-[${group.color}]/10` : "bg-muted/50",
                  )}
                  style={{
                    borderColor: group.borderColor,
                    backgroundColor: group.color
                      ? `${group.color}10`
                      : undefined,
                  }}
                >
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    <span className="flex items-center gap-2">
                      {group.color && (
                        <motion.span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: group.color }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        />
                      )}
                      {groupName}
                    </span>
                  </CardTitle>
                  <motion.p
                    className="text-sm font-medium text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {group.items.length} item
                    {group.items.length !== 1 ? "s" : ""}
                  </motion.p>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[400px]">
                    <motion.div
                      className="space-y-3 p-4"
                      variants={containerVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <AnimatePresence mode="popLayout">
                        {group.items.map((item) => (
                          <motion.div
                            key={item.id}
                            variants={cardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            layout
                            layoutId={item.id}
                            className="relative"
                          >
                            {renderGridCard(item)}
                            <Separator className="my-3 last:hidden" />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderItems = (items: BoardItem[]) => {
    switch (viewType) {
      case "table":
        return renderTableView(items);
      case "grid":
        if (groupByColumn) {
          return renderGroupView(items);
        }
        return renderGridView(items);
      default:
        return null;
    }
  };

  const renderSummary = () => {
    if (!settings.enableSummary || selectedItems.length === 0) return null;

    return (
      <div className="mt-6 rounded-lg border bg-muted/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Selected Items Summary</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedItems([])}
          >
            Clear Selection
          </Button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""}{" "}
            selected
          </p>
          {settings.summaryColumns?.map((columnId) => {
            const column = allColumns.find((col) => col.id === columnId);
            if (!column) return null;

            if (column.type === "numbers") {
              // Calculate sum for numeric columns
              const sum = selectedItems.reduce((acc, item) => {
                const value = item.column_values.find(
                  (cv) => cv.column.id === columnId,
                )?.text;
                return acc + (parseFloat(value ?? "0") ?? 0);
              }, 0);

              return (
                <div key={column.id} className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    {column.title} (Total)
                  </dt>
                  <dd className="text-lg font-semibold">
                    {formatNumberWithSymbol(
                      sum.toString(),
                      column.settings_str,
                    )}
                  </dd>
                </div>
              );
            }

            return (
              <div key={column.id} className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">
                  {column.title}
                </dt>
                <dd className="space-y-1">
                  {selectedItems.map((item) => {
                    const value = item.column_values.find(
                      (cv) => cv.column.id === columnId,
                    );
                    return value?.text ? (
                      <div key={item.id} className="text-sm">
                        {renderColumnValue(value)}
                      </div>
                    ) : null;
                  })}
                </dd>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No items found in this board
      </div>
    );
  }

  return (
    <>
      <div
        className={cn("p-6", "print:p-0", "print:!bg-transparent")}
        style={{ backgroundColor: settings.backgroundColor ?? "#ffffff" }}
      >
        <div className={cn("mb-6 space-y-4", "print:hidden")}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {(settings.title as string | undefined) ?? "Board Items"}
            </h3>
          </div>

          {(settings.showSearch ?? false) ||
          (settings.enableFilters &&
            settings.filterGroups &&
            settings.filterGroups.length > 0) ? (
            <div className="space-y-4">
              {settings.showSearch && (
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}

              {settings.enableFilters && renderFilterGroups()}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          {renderItems(filteredItems.slice(0, settings.itemsPerPage))}
          {renderSummary()}
        </div>
      </div>

      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name ?? "View Content"}</DialogTitle>
          </DialogHeader>
          {selectedItem ? (
            <div className="max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                {columns.map((column) => {
                  const value = selectedItem.column_values.find(
                    (cv) => cv.column.title === column.title,
                  );
                  return value?.text ? (
                    <div key={column.id} className="grid gap-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        {column.title}
                      </span>
                      <span>{renderColumnValue(value)}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ) : popupUrl ? (
            <div className="aspect-video">
              <iframe
                src={popupUrl}
                className="h-full w-full"
                title="Content Preview"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function BoardItemsSidebar() {
  return (
    <div className="flex cursor-grab flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 hover:shadow-md">
      <div className="text-sm font-medium text-gray-900">Board Items</div>
      <div className="text-xs text-gray-500">
        Display board items in a table
      </div>
    </div>
  );
}
