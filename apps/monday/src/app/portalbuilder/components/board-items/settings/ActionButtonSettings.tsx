import type {BoardColumn, BoardItemsSettings} from "../../../types/board-items";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionButtonSettingsProps {
  settings: Partial<BoardItemsSettings>;
  onSettingsChange: (settings: Partial<BoardItemsSettings>) => void;
  columns: BoardColumn[];
}

export function ActionButtonSettings({
  settings,
  onSettingsChange,
  columns,
}: ActionButtonSettingsProps) {
  const currentShowActionButton = settings.showActionButton! ?? false;
  const currentActionButtonText = settings.actionButtonText! ?? "";
  const currentActionButtonColumn = settings.actionButtonColumn as
    | string
    | undefined;

  const linkColumns = columns.filter((col: BoardColumn) =>
    ["link", "file", "text"].includes(col.type),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="showActionButton">Show Action Button</Label>
        <Switch
          id="showActionButton"
          checked={currentShowActionButton}
          onCheckedChange={(checked) =>
            onSettingsChange({ showActionButton: checked })
          }
        />
      </div>

      {currentShowActionButton && (
        <div className="space-y-4 border-l-2 border-muted pl-6">
          <div className="space-y-2">
            <Label>Button Style</Label>
            <Select
              value={settings.actionButtonStyle ?? "button"}
              onValueChange={(value: "button" | "card") =>
                onSettingsChange({ actionButtonStyle: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select button style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="button">Button</SelectItem>
                <SelectItem value="card">Full Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Button Alignment</Label>
            <Select
              value={settings.actionButtonAlignment ?? "content"}
              onValueChange={(value: "content" | "bottom") =>
                onSettingsChange({ actionButtonAlignment: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select button alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="content">With Content</SelectItem>
                <SelectItem value="bottom">Bottom of Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Button Behavior</Label>
            <Select
              value={settings.actionButtonBehavior! ?? "new_tab"}
              onValueChange={(value: "new_tab" | "popup") =>
                onSettingsChange({ actionButtonBehavior: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select open behavior" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_tab">Open in New Tab</SelectItem>
                <SelectItem value="popup">Open in Popup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Action Type</Label>
            <Select
              value={settings.actionButtonType ?? "link"}
              onValueChange={(value: "link" | "details") =>
                onSettingsChange({ actionButtonType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">Open Link</SelectItem>
                <SelectItem value="details">Show Details</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {settings.actionButtonType === "link" && (
            <div className="space-y-2">
              <Label>Link Column</Label>
              <Select
                value={currentActionButtonColumn}
                onValueChange={(value: string) =>
                  onSettingsChange({ actionButtonColumn: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select link column" />
                </SelectTrigger>
                <SelectContent>
                  {linkColumns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a link or file column to use for the action button URL
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="actionButtonText">Button Text</Label>
            <Input
              id="actionButtonText"
              value={currentActionButtonText}
              onChange={(e) =>
                onSettingsChange({ actionButtonText: e.target.value })
              }
              placeholder="Enter button text"
            />
          </div>
        </div>
      )}
    </div>
  );
}
