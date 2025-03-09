import { useState } from "react";
import { CalendarX, Search, X } from "lucide-react";

import { GeneralCard } from "@acme/ui/general/GeneralCard";

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
    <GeneralCard
      title="Trading News & Events"
      layout="stacked"
      className="!translate-y-0"
      content={
        <div className="flex flex-col">
          {/* Filters header */}
          <div className="border-b p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {/* Severity filter */}
                  <select
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                    value={selectedSeverity}
                    onChange={(e) => {
                      const values: string[] = [];
                      for (const option of Array.from(e.target.options)) {
                        if (option.selected) {
                          values.push(option.value);
                        }
                      }
                      setSelectedSeverity(values);
                    }}
                    multiple
                  >
                    <option value="high">High Impact</option>
                    <option value="medium">Medium Impact</option>
                    <option value="low">Low Impact</option>
                  </select>

                  {/* Favorites toggle */}
                  <button
                    className={`rounded-md border px-2 py-1 text-sm ${
                      showFavoritesOnly
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300"
                    }`}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  >
                    <span className="mr-1">★</span>
                    Favorites
                  </button>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news or currency pairs..."
                  className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-4 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Currency pair filters */}
              <div className="flex flex-wrap gap-1">
                {allPairs.map((pair) => (
                  <button
                    key={pair}
                    className={`rounded-full px-2 py-1 text-xs ${
                      favoritePairs.includes(pair)
                        ? "bg-primary text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => toggleFavoritePair(pair)}
                  >
                    {favoritePairs.includes(pair) ? "★ " : ""}
                    {pair}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* News content */}
          <div className="flex-1 overflow-auto">
            {filteredNews.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-center text-gray-500">
                <div>
                  <CalendarX className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2">No matching news or events found</p>
                  <button
                    className="mt-2 text-sm text-primary underline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSeverity([]);
                      setShowFavoritesOnly(false);
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNews.map((item) => {
                  const time = formatTime(item.timestamp);
                  return (
                    <div key={item.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex h-2 w-2 rounded-full ${
                                item.severity === "high"
                                  ? "bg-red-500"
                                  : item.severity === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                            />
                            <span
                              className={`text-xs ${
                                time.status === "soon"
                                  ? "font-medium text-orange-600"
                                  : time.status === "upcoming"
                                    ? "text-gray-500"
                                    : "text-gray-400"
                              }`}
                            >
                              {time.text}
                            </span>
                            <span className="text-xs text-gray-400">
                              • {item.source}
                            </span>
                          </div>
                          <h4 className="mt-1 font-medium">{item.title}</h4>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.pairs.map((pair) => (
                              <span
                                key={pair}
                                className={`rounded-full px-2 py-0.5 text-xs ${
                                  favoritePairs.includes(pair)
                                    ? "bg-primary/10 text-primary"
                                    : "bg-gray-100"
                                }`}
                                onClick={() => toggleFavoritePair(pair)}
                              >
                                {favoritePairs.includes(pair) ? "★ " : ""}
                                {pair}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            item.severity === "high"
                              ? "bg-red-100 text-red-800"
                              : item.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.severity === "high"
                            ? "High Impact"
                            : item.severity === "medium"
                              ? "Medium Impact"
                              : "Low Impact"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
