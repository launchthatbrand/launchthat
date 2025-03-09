export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  bio: string;
  location: string;
  tradingExperience: string;
  preferredMarkets: string[];
  socialLinks: {
    twitter?: string;
    tradingview?: string;
    linkedin?: string;
  };
  stats: {
    lessonsCompleted: number;
    commentsPosted: number;
    tradeIdeasShared: number;
    totalLikes: number;
  };
}

export interface LessonComment {
  id: string;
  lessonId: string;
  lessonTitle: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
}

export interface TradeIdea {
  id: string;
  symbol: string;
  type: "LONG" | "SHORT";
  entry: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: string;
  status: "ACTIVE" | "CLOSED" | "STOPPED";
  pnl?: number;
  description: string;
  likes: number;
  comments: number;
  chart: string; // URL to chart image
}

export const mockUserProfile: UserProfile = {
  id: "user123",
  name: "John Trading Pro",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  joinDate: "2023-09-15",
  bio: "Full-time trader specializing in crypto and forex markets. Sharing my journey and insights with the community.",
  location: "New York, USA",
  tradingExperience: "5+ years",
  preferredMarkets: ["Crypto", "Forex", "Indices"],
  socialLinks: {
    twitter: "https://twitter.com/johntrader",
    tradingview: "https://tradingview.com/u/johntrader",
    linkedin: "https://linkedin.com/in/johntrader",
  },
  stats: {
    lessonsCompleted: 42,
    commentsPosted: 156,
    tradeIdeasShared: 89,
    totalLikes: 1243,
  },
};

export const mockComments: LessonComment[] = [
  {
    id: "c1",
    lessonId: "l1",
    lessonTitle: "Advanced Price Action Patterns",
    content:
      "Great explanation of the three drive pattern. I've been seeing this a lot in the crypto markets lately.",
    timestamp: "2024-02-15T14:30:00Z",
    likes: 24,
    replies: 5,
  },
  {
    id: "c2",
    lessonId: "l2",
    lessonTitle: "Risk Management Fundamentals",
    content:
      "The position sizing calculator really helped me understand how to properly scale my trades.",
    timestamp: "2024-02-10T09:15:00Z",
    likes: 18,
    replies: 3,
  },
  {
    id: "c3",
    lessonId: "l3",
    lessonTitle: "Market Structure Analysis",
    content:
      "This concept of market structure has completely changed how I view charts. Looking forward to more content!",
    timestamp: "2024-02-05T16:45:00Z",
    likes: 31,
    replies: 7,
  },
];

export const mockTradeIdeas: TradeIdea[] = [
  {
    id: "t1",
    symbol: "BTC/USD",
    type: "LONG",
    entry: 48500,
    stopLoss: 47800,
    takeProfit: 50000,
    timestamp: "2024-02-15T10:00:00Z",
    status: "ACTIVE",
    description:
      "Bitcoin showing strong support at the 200MA with bullish divergence on the 4H timeframe.",
    likes: 45,
    comments: 12,
    chart: "https://example.com/chart1.png",
  },
  {
    id: "t2",
    symbol: "EUR/USD",
    type: "SHORT",
    entry: 1.085,
    stopLoss: 1.088,
    takeProfit: 1.078,
    timestamp: "2024-02-14T15:30:00Z",
    status: "CLOSED",
    pnl: 2.3,
    description:
      "Double top formation at resistance with bearish RSI divergence.",
    likes: 38,
    comments: 8,
    chart: "https://example.com/chart2.png",
  },
  {
    id: "t3",
    symbol: "ETH/USD",
    type: "LONG",
    entry: 2800,
    stopLoss: 2750,
    takeProfit: 2950,
    timestamp: "2024-02-13T09:45:00Z",
    status: "STOPPED",
    pnl: -0.8,
    description: "Breakout from ascending triangle with increased volume.",
    likes: 29,
    comments: 15,
    chart: "https://example.com/chart3.png",
  },
];
