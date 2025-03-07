import {
  type BoardColumn,
  type BoardItemsSettings,
} from "../../../types/board-items";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid2X2, Table as TableIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  SettingsAccordion,
  type SettingsSection,
} from "../../shared/SettingsAccordion";
import { CardLayoutSettings } from "./CardLayoutSettings";
import { OrganizationSettings } from "./OrganizationSettings";
import { Columns, Grid, LayoutGrid, Layers } from "lucide-react";
import { useSliderEventPrevention } from "../../../hooks/useSliderEventPrevention";
import { useMemo, useCallback } from "react";
import { ErrorBoundary } from "../../shared/ErrorBoundary";

type ViewType = "table" | "grid";

interface ViewSettingsProps {
  settings: Partial<BoardItemsSettings>;
  onSettingsChange: (settings: Partial<BoardItemsSettings>) => void;
  columns: BoardColumn[];
}

export function ViewSettings({
  settings,
  onSettingsChange,
  columns,
}: ViewSettingsProps) {
  const { preventSliderEvents } = useSliderEventPrevention();

  const currentViewType = settings.viewType! ?? "table";
  const currentGridColumns = settings.gridColumns ?? 3;
  const hiddenColumns = settings.hiddenColumns! ?? [];

  const validHiddenColumns = useMemo(
    () =>
      hiddenColumns.filter((id) =>
        columns.some((col: BoardColumn) => col.id === id),
      ),
    [hiddenColumns, columns],
  );

  const columnOptions = useMemo(
    () =>
      columns.map((col: BoardColumn) => ({
        label: col.title,
        value: col.id,
      })),
    [columns],
  );

  const handleViewTypeChange = useCallback(
    (value: string) => {
      if (value) {
        onSettingsChange({ viewType: value as ViewType });
      }
    },
    [onSettingsChange],
  );

  const handleGridColumnsChange = useCallback(
    ([value]: number[]) => {
      onSettingsChange({ gridColumns: value });
    },
    [onSettingsChange],
  );

  const handleHiddenColumnsChange = useCallback(
    (values: string[]) => {
      onSettingsChange({ hiddenColumns: values });
    },
    [onSettingsChange],
  );

  const sections = useMemo(
    () => [
      {
        id: "columns",
        title: "Column Settings",
        icon: Columns,
        content: (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hidden Columns</Label>
              <MultiSelect
                options={columnOptions}
                value={validHiddenColumns}
                defaultValue={validHiddenColumns}
                onValueChange={handleHiddenColumnsChange}
                placeholder="Select columns to hide"
              />
            </div>
          </div>
        ),
      },
      ...(currentViewType === "grid"
        ? [
            {
              id: "grid-layout",
              title: "Grid Layout",
              icon: Grid,
              content: (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Grid Columns</Label>
                    <div
                      className="flex items-center gap-4"
                      {...preventSliderEvents}
                    >
                      <Slider
                        min={1}
                        max={6}
                        step={1}
                        value={[currentGridColumns]}
                        onValueChange={handleGridColumnsChange}
                      />
                      <span className="w-12 text-sm">{currentGridColumns}</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: "organization",
              title: "Organization",
              icon: Layers,
              content: (
                <OrganizationSettings
                  settings={settings}
                  onSettingsChange={onSettingsChange}
                  columns={columns}
                />
              ),
            },
            {
              id: "card-layout",
              title: "Card Layout",
              icon: LayoutGrid,
              content: (
                <CardLayoutSettings
                  settings={settings}
                  onSettingsChange={onSettingsChange}
                  columns={columns}
                />
              ),
            },
          ]
        : []),
    ],
    [
      columnOptions,
      validHiddenColumns,
      currentViewType,
      currentGridColumns,
      handleHiddenColumnsChange,
      handleGridColumnsChange,
      settings,
      onSettingsChange,
      columns,
      preventSliderEvents,
    ],
  );

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>View Type</Label>
          <ToggleGroup
            type="single"
            value={currentViewType}
            onValueChange={handleViewTypeChange}
            className="justify-start"
          >
            <ToggleGroupItem value="table" aria-label="Table view">
              <TableIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid2X2 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <SettingsAccordion sections={sections} />
      </div>
    </ErrorBoundary>
  );
}
