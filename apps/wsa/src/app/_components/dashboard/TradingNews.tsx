import { useState } from "react";
import { Bell, Heart, Search, Star } from "lucide-react";

import { Badge } from "@acme/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Input } from "@acme/ui/components/input";
import { ScrollArea } from "@acme/ui/components/scroll-area";
import { Toggle } from "@acme/ui/components/toggle";
import { cn } from "@acme/ui/lib/utils";

import { useFavoritePairs } from "./stores/useFavoritePairs";

interface NewsItem {
  id: number;
  title: string;
  source: string;
  timestamp: string;
  category: string;
  severity: "high" | "medium" | "low";
  pairs: string[];
  isUpcoming: boolean;
}

interface TradingNewsProps {
  news: NewsItem[];
}

const SEVERITY_COLORS = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours < 0) {
    return {
      text: date.toLocaleString(),
      status: "past",
    };
  } else if (diffHours <= 24) {
    return {
      text: `Coming up in ${Math.round(diffHours)} hours`,
      status: "soon",
    };
  } else {
    return {
      text: date.toLocaleString(),
      status: "upcoming",
    };
  }
}

export function TradingNews({ news }: TradingNewsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { favoritePairs, toggleFavoritePair } = useFavoritePairs();

  // Get unique pairs from all news items
  const allPairs = Array.from(
    new Set(news.flatMap((item) => item.pairs)),
  ).sort();

  // Filter news based on search, severity, and favorites
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pairs.some((pair) =>
        pair.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesSeverity =
      selectedSeverity.length === 0 || selectedSeverity.includes(item.severity);

    const matchesFavorites =
      !showFavoritesOnly ||
      item.pairs.some((pair) => favoritePairs.includes(pair));

    return matchesSearch && matchesSeverity && matchesFavorites;
  });

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Trading News
          </CardTitle>
          <Toggle
            variant="outline"
            aria-label="Show favorites only"
            pressed={showFavoritesOnly}
            onPressedChange={setShowFavoritesOnly}
          >
            <Star
              className={cn(
                "h-4 w-4",
                showFavoritesOnly && "fill-current text-yellow-500",
              )}
            />
          </Toggle>
        </div>

        <div className="mt-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news or currency pairs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Severity Filters */}
          <div className="flex flex-wrap gap-2">
            {["low", "medium", "high"].map((severity) => (
              <Toggle
                key={severity}
                pressed={selectedSeverity.includes(severity)}
                onPressedChange={(pressed) => {
                  setSelectedSeverity((prev) =>
                    pressed
                      ? [...prev, severity]
                      : prev.filter((s) => s !== severity),
                  );
                }}
                className={cn(
                  "capitalize",
                  selectedSeverity.includes(severity) &&
                    SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS],
                )}
              >
                {severity}
              </Toggle>
            ))}
          </div>

          {/* Currency Pair Quick Filters */}
          <ScrollArea className="max-h-20">
            <div className="flex flex-wrap gap-2">
              {allPairs.map((pair) => (
                <Toggle
                  key={pair}
                  pressed={favoritePairs.includes(pair)}
                  onPressedChange={() => toggleFavoritePair(pair)}
                  className={cn(
                    "text-xs",
                    favoritePairs.includes(pair) &&
                      "bg-yellow-100 text-yellow-800",
                  )}
                >
                  <Heart
                    className={cn(
                      "mr-1 h-3 w-3",
                      favoritePairs.includes(pair) && "fill-current",
                    )}
                  />
                  {pair}
                </Toggle>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredNews.map((item) => {
              const timeInfo = formatTime(item.timestamp);
              return (
                <div
                  key={item.id}
                  className={cn(
                    "relative rounded-lg border p-4",
                    timeInfo.status === "upcoming" &&
                      "border-gray-200 bg-white",
                    timeInfo.status === "soon" &&
                      "border-orange-200 bg-orange-50",
                    timeInfo.status === "past" && "border-red-200 bg-red-50",
                  )}
                >
                  {timeInfo.status !== "past" && (
                    <Badge
                      className={cn(
                        "absolute right-2 top-2",
                        timeInfo.status === "upcoming" && "bg-gray-500",
                        timeInfo.status === "soon" && "bg-orange-500",
                      )}
                      variant="secondary"
                    >
                      {timeInfo.status === "upcoming" ? "Upcoming" : "Today"}
                    </Badge>
                  )}

                  <div className="space-y-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            item.severity === "high"
                              ? "border-red-500 text-red-500"
                              : item.severity === "medium"
                                ? "border-yellow-500 text-yellow-500"
                                : "border-green-500 text-green-500",
                          )}
                        >
                          {item.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {item.source}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {timeInfo.text}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.pairs.map((pair) => (
                        <Badge
                          key={pair}
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            favoritePairs.includes(pair) &&
                              "bg-yellow-100 text-yellow-800",
                          )}
                        >
                          {pair}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
