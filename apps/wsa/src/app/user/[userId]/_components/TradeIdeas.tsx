import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

import { GeneralCard } from "@acme/ui/general/GeneralCard";

import type { TradeIdea } from "../_data/mock-data";

interface Props {
  tradeIdeas: TradeIdea[];
}

export function TradeIdeas({ tradeIdeas }: Props) {
  const getStatusColor = (status: TradeIdea["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-blue-100 text-blue-800";
      case "STOPPED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <GeneralCard
      layout="stacked"
      contentClassName="space-y-6"
      title={
        <div className="border-b bg-[#2b0e4d] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#FC653C]">
                ▬ Trade Ideas ▬
              </p>
              <h3 className="mt-2 text-xl font-bold">Your Trade Ideas</h3>
              <p className="mt-1 text-sm font-normal text-gray-300">
                Track your trading ideas
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
              {tradeIdeas.length}
            </span>
          </div>
        </div>
      }
      content={
        <>
          {tradeIdeas.map((idea) => (
            <div
              key={idea.id}
              className="border-b border-gray-100 pb-6 last:border-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {idea.symbol}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      idea.type === "LONG"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {idea.type}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      idea.status,
                    )}`}
                  >
                    {idea.status}
                  </span>
                </div>
                {idea.pnl !== undefined && (
                  <span
                    className={`text-sm font-semibold ${getPnLColor(idea.pnl)}`}
                  >
                    {idea.pnl > 0 ? "+" : ""}
                    {idea.pnl}%
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Entry:</span>{" "}
                  <span className="font-medium">{idea.entry}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stop Loss:</span>{" "}
                  <span className="font-medium">{idea.stopLoss}</span>
                </div>
                <div>
                  <span className="text-gray-500">Take Profit:</span>{" "}
                  <span className="font-medium">{idea.takeProfit}</span>
                </div>
              </div>

              <p className="mt-3 text-gray-600">{idea.description}</p>

              {idea.chart && (
                <div className="relative mt-4 h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={idea.chart}
                    alt={`Chart for ${idea.symbol}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-red-500">
                    <Heart className="h-4 w-4" />
                    <span>{idea.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-500">
                    <MessageCircle className="h-4 w-4" />
                    <span>{idea.comments}</span>
                  </button>
                </div>
                <time className="text-sm text-gray-500">
                  {new Date(idea.timestamp).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          ))}
        </>
      }
    />
  );
}
