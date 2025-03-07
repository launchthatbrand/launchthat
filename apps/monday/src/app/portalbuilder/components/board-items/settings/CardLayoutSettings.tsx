import {
  type BoardColumn,
  type BoardItemsSettings,
} from "../../../types/board-items";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CardLayoutSettingsProps {
  settings: Partial<BoardItemsSettings>;
  onSettingsChange: (settings: Partial<BoardItemsSettings>) => void;
  columns: BoardColumn[];
}

export function CardLayoutSettings({
  settings,
  onSettingsChange,
  columns,
}: CardLayoutSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Show Featured Image</Label>
          <p className="text-sm text-muted-foreground">
            Display an image in the card
          </p>
        </div>
        <Switch
          checked={settings.showFeaturedImage ?? true}
          onCheckedChange={(checked) =>
            onSettingsChange({ showFeaturedImage: checked })
          }
        />
      </div>

      {settings.showFeaturedImage && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Featured Image Column</Label>
            <Select
              value={settings.featuredImageColumn}
              onValueChange={(value: string) =>
                onSettingsChange({
                  featuredImageColumn: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select image column" />
              </SelectTrigger>
              <SelectContent>
                {columns
                  .filter((col) => ["file", "link"].includes(col.type))
                  .map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Image Position</Label>
            <Select
              value={settings.cardLayout?.imagePosition ?? "stacked"}
              onValueChange={(value: "stacked" | "inline" | "none") =>
                onSettingsChange({
                  cardLayout: {
                    ...settings.cardLayout,
                    imagePosition: value,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select image position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stacked">Stacked</SelectItem>
                <SelectItem value="inline">Inline</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Image Fit</Label>
            <Select
              value={settings.cardLayout?.imageFit ?? "cover"}
              onValueChange={(value: "contain" | "cover" | "default") =>
                onSettingsChange({
                  cardLayout: {
                    ...settings.cardLayout,
                    imageFit: value,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select image fit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="default">Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Info Columns</Label>
        <div className="flex items-center gap-4">
          <Slider
            min={1}
            max={3}
            step={1}
            value={[settings.cardLayout?.infoColumns ?? 2]}
            onValueChange={([value]) =>
              onSettingsChange({
                cardLayout: {
                  ...settings.cardLayout,
                  infoColumns: value,
                },
              })
            }
          />
          <span className="w-12 text-sm">
            {settings.cardLayout?.infoColumns ?? 2}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Enable Text Truncation</Label>
          <p className="text-sm text-muted-foreground">
            Limit the number of lines for text content
          </p>
        </div>
        <Switch
          checked={settings.cardLayout?.enableTextTruncation ?? false}
          onCheckedChange={(checked) =>
            onSettingsChange({
              cardLayout: {
                ...settings.cardLayout,
                enableTextTruncation: checked,
              },
            })
          }
        />
      </div>

      {settings.cardLayout?.enableTextTruncation && (
        <div className="space-y-2">
          <Label>Text Truncation Lines</Label>
          <div className="flex items-center gap-4">
            <Slider
              min={1}
              max={5}
              step={1}
              value={[settings.cardLayout?.textTruncationLines ?? 2]}
              onValueChange={([value]) =>
                onSettingsChange({
                  cardLayout: {
                    ...settings.cardLayout,
                    textTruncationLines: value,
                  },
                })
              }
            />
            <span className="w-12 text-sm">
              {settings.cardLayout?.textTruncationLines ?? 2}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Same Height Cards</Label>
          <p className="text-sm text-muted-foreground">
            Make all cards in a row the same height
          </p>
        </div>
        <Switch
          checked={settings.cardLayout?.sameHeight ?? false}
          onCheckedChange={(checked) =>
            onSettingsChange({
              cardLayout: {
                ...settings.cardLayout,
                sameHeight: checked,
              },
            })
          }
        />
      </div>
    </div>
  );
}
