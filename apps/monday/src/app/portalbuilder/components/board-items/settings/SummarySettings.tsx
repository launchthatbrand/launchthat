import {
  type BoardColumn,
  type BoardItemsSettings,
} from "../../../types/board-items";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";

interface SummarySettingsProps {
  settings: Partial<BoardItemsSettings>;
  onSettingsChange: (settings: Partial<BoardItemsSettings>) => void;
  columns: BoardColumn[];
}

export function SummarySettings({
  settings,
  onSettingsChange,
  columns,
}: SummarySettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Enable Summary</Label>
          <p className="text-sm text-muted-foreground">
            Allow users to select items and view a summary
          </p>
        </div>
        <Switch
          checked={settings.enableSummary}
          onCheckedChange={(checked) =>
            onSettingsChange({ enableSummary: checked })
          }
        />
      </div>

      {settings.enableSummary && (
        <div className="space-y-2">
          <Label>Summary Columns</Label>
          <p className="text-sm text-muted-foreground">
            Select columns to include in the summary
          </p>
          <MultiSelect
            value={settings.summaryColumns ?? []}
            onValueChange={(value) =>
              onSettingsChange({ summaryColumns: value })
            }
            options={columns
              .filter((col) => !settings.hiddenColumns?.includes(col.id))
              .map((col) => ({
                label: col.title,
                value: col.id,
              }))}
            placeholder="Select columns..."
          />
        </div>
      )}
    </div>
  );
}
