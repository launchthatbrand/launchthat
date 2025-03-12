import type {BoardColumn, BoardItemsSettings} from "../../../types/board-items";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrganizationSettingsProps {
  settings: Partial<BoardItemsSettings>;
  onSettingsChange: (settings: Partial<BoardItemsSettings>) => void;
  columns: BoardColumn[];
}

export function OrganizationSettings({
  settings,
  onSettingsChange,
  columns,
}: OrganizationSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Category Column</Label>
        <Select
          value={settings.categoryColumn ?? "none"}
          onValueChange={(value) =>
            onSettingsChange({
              categoryColumn: value === "none" ? undefined : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category column" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Category</SelectItem>
            {columns
              .filter((col) => col.type === "status")
              .map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Display a category badge at the top of each card
        </p>
      </div>

      <div className="space-y-2">
        <Label>Group By</Label>
        <Select
          value={settings.groupByColumn ?? "none"}
          onValueChange={(value) =>
            onSettingsChange({
              groupByColumn: value === "none" ? undefined : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select grouping column" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Grouping</SelectItem>
            <SelectItem value="monday_group">Monday Groups</SelectItem>
            {columns
              .filter((col) => ["status", "dropdown"].includes(col.type))
              .map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
