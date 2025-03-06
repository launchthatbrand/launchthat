// Types
interface CourseProgressData {
  completedLessons: number;
  totalLessons: number;
  recentLessons: {
    title: string;
    completedAt: string | null;
    progress: number;
  }[];
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

interface TradingNewsItem {
  id: number;
  title: string;
  source: string;
  timestamp: string;
  category: string;
  severity: "low" | "medium" | "high";
  pairs: string[];
  isUpcoming: boolean;
}

interface SocialPost {
  id: number;
  content: string;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  platform: "twitter" | "instagram" | "youtube";
  media?: {
    type: "image" | "video";
    url: string;
    thumbnail: string;
    title?: string;
    views?: string;
    duration?: string;
  };
  stats?: {
    likes: number;
    retweets?: number;
    replies?: number;
  };
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  href: string;
  eta?: string;
}

// Course Progress Data
export const courseProgress: CourseProgressData = {
  completedLessons: 12,
  totalLessons: 25,
  recentLessons: [
    {
      title: "Understanding Market Structure",
      completedAt: "2024-03-15T10:30:00Z",
      progress: 100,
    },
    {
      title: "Support and Resistance Levels",
      completedAt: "2024-03-14T15:45:00Z",
      progress: 100,
    },
    {
      title: "Risk Management Fundamentals",
      completedAt: null,
      progress: 45,
    },
  ],
};

// Achievements Data
export const achievements: Achievement[] = [
  {
    id: 1,
    title: "First Trade",
    description: "Complete your first paper trading exercise",
    earned: true,
    earnedAt: "2024-03-10T09:00:00Z",
  },
  {
    id: 2,
    title: "Risk Master",
    description: "Complete the Risk Management module with 100% score",
    earned: true,
    earnedAt: "2024-03-12T14:30:00Z",
  },
  {
    id: 3,
    title: "Chart Analyst",
    description: "Successfully identify 5 chart patterns",
    earned: false,
  },
];

// Trading News Data
export const tradingNews: TradingNewsItem[] = [
  {
    id: 1,
    title: "Fed Annual Economic Policy Symposium",
    source: "Trading Economics",
    timestamp: "2025-08-22T16:00:00Z",
    category: "Macro",
    severity: "high" as const,
    pairs: ["EUR/USD", "USD/JPY", "GBP/USD"],
    isUpcoming: true,
  },
  {
    id: 2,
    title: "ECB Strategic Policy Review Results",
    source: "European Central Bank",
    timestamp: "2025-06-15T12:45:00Z",
    category: "Macro",
    severity: "high" as const,
    pairs: ["EUR/USD", "EUR/GBP", "EUR/CHF"],
    isUpcoming: true,
  },
  {
    id: 3,
    title: "Bank of England Future Framework Implementation",
    source: "Bank of England",
    timestamp: "2025-04-10T13:30:00Z",
    category: "Economic",
    severity: "high" as const,
    pairs: ["GBP/USD", "EUR/GBP", "GBP/JPY"],
    isUpcoming: true,
  },
  {
    id: 4,
    title: "Fed Interest Rate Decision",
    source: "Federal Reserve",
    timestamp: "2025-01-29T19:00:00Z",
    category: "Macro",
    severity: "high" as const,
    pairs: ["EUR/USD", "USD/JPY", "GBP/USD"],
    isUpcoming: true,
  },
  {
    id: 5,
    title: "Bank of Japan Maintains Negative Interest Rates",
    source: "Bloomberg",
    timestamp: "2024-03-15T11:30:00Z",
    category: "Macro",
    severity: "high" as const,
    pairs: ["USD/JPY", "EUR/JPY", "GBP/JPY"],
    isUpcoming: false,
  },
  {
    id: 6,
    title: "ECB Signals Potential Rate Cut",
    source: "Financial Times",
    timestamp: "2024-03-15T10:45:00Z",
    category: "Macro",
    severity: "high" as const,
    pairs: ["EUR/USD", "EUR/GBP", "EUR/CHF"],
    isUpcoming: false,
  },
  {
    id: 7,
    title: "Oil Prices Surge on Supply Concerns",
    source: "Reuters",
    timestamp: "2024-03-15T09:20:00Z",
    category: "Commodities",
    severity: "medium" as const,
    pairs: ["USD/CAD", "USD/NOK", "AUD/USD"],
    isUpcoming: false,
  },
  {
    id: 8,
    title: "Australian Employment Data Beats Expectations",
    source: "MarketWatch",
    timestamp: "2024-03-15T08:15:00Z",
    category: "Economic",
    severity: "medium" as const,
    pairs: ["AUD/USD", "AUD/JPY", "AUD/NZD"],
    isUpcoming: false,
  },
  {
    id: 9,
    title: "Gold Reaches New All-Time High",
    source: "Bloomberg",
    timestamp: "2024-03-15T07:30:00Z",
    category: "Commodities",
    severity: "high" as const,
    pairs: ["XAU/USD", "USD/CHF", "USD/JPY"],
    isUpcoming: false,
  },
  {
    id: 10,
    title: "UK GDP Growth Slows in Q4",
    source: "BBC",
    timestamp: "2024-03-15T06:45:00Z",
    category: "Economic",
    severity: "medium" as const,
    pairs: ["GBP/USD", "EUR/GBP", "GBP/JPY"],
    isUpcoming: false,
  },
  {
    id: 11,
    title: "Swiss National Bank Intervenes in FX Market",
    source: "Reuters",
    timestamp: "2024-03-15T05:30:00Z",
    category: "Intervention",
    severity: "high" as const,
    pairs: ["USD/CHF", "EUR/CHF", "GBP/CHF"],
    isUpcoming: false,
  },
  {
    id: 12,
    title: "Canadian Retail Sales Data Released",
    source: "Trading Economics",
    timestamp: "2024-03-15T04:15:00Z",
    category: "Economic",
    severity: "low" as const,
    pairs: ["USD/CAD", "CAD/JPY", "EUR/CAD"],
    isUpcoming: false,
  },
  {
    id: 13,
    title: "New Zealand Consumer Confidence Improves",
    source: "ForexLive",
    timestamp: "2024-03-15T03:00:00Z",
    category: "Economic",
    severity: "low" as const,
    pairs: ["NZD/USD", "AUD/NZD", "NZD/JPY"],
    isUpcoming: false,
  },
  {
    id: 14,
    title: "Major Support Level Broken in EUR/USD",
    source: "TradingView",
    timestamp: "2024-03-15T02:30:00Z",
    category: "Technical",
    severity: "medium" as const,
    pairs: ["EUR/USD"],
    isUpcoming: false,
  },
  {
    id: 15,
    title: "Chinese Industrial Production Surges",
    source: "Bloomberg",
    timestamp: "2024-03-15T01:45:00Z",
    category: "Economic",
    severity: "medium" as const,
    pairs: ["USD/CNH", "AUD/USD", "NZD/USD"],
    isUpcoming: false,
  },
  {
    id: 16,
    title: "Cryptocurrency Market Impacts Forex Volatility",
    source: "CoinDesk",
    timestamp: "2024-03-15T01:00:00Z",
    category: "Crypto",
    severity: "low" as const,
    pairs: ["BTC/USD", "ETH/USD", "USD/JPY"],
    isUpcoming: false,
  },
  {
    id: 17,
    title: "Bank of England Stress Test Results",
    source: "Financial Times",
    timestamp: "2024-03-14T23:45:00Z",
    category: "Banking",
    severity: "medium" as const,
    pairs: ["GBP/USD", "EUR/GBP"],
    isUpcoming: false,
  },
  {
    id: 18,
    title: "OPEC+ Meeting Outcomes Announced",
    source: "Reuters",
    timestamp: "2024-03-14T22:30:00Z",
    category: "Commodities",
    severity: "high" as const,
    pairs: ["USD/CAD", "USD/NOK", "USD/RUB"],
    isUpcoming: false,
  },
  {
    id: 19,
    title: "US Manufacturing PMI Data Released",
    source: "MarketWatch",
    timestamp: "2024-03-14T21:15:00Z",
    category: "Economic",
    severity: "medium" as const,
    pairs: ["EUR/USD", "USD/JPY", "USD/CHF"],
    isUpcoming: false,
  },
  {
    id: 20,
    title: "Mexican Peso Hits Record High",
    source: "Bloomberg",
    timestamp: "2024-03-14T20:00:00Z",
    category: "Currency",
    severity: "medium" as const,
    pairs: ["USD/MXN"],
    isUpcoming: false,
  },
  {
    id: 21,
    title: "Global Market Risk Sentiment Shifts",
    source: "Financial Times",
    timestamp: "2024-03-14T19:30:00Z",
    category: "Market Sentiment",
    severity: "high" as const,
    pairs: ["EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF", "AUD/USD"],
    isUpcoming: false,
  },
];

// Social Posts Data
export const socialPosts: SocialPost[] = [
  {
    id: 1,
    content:
      "Just wrapped up filming the advanced price action module! 📈 Remember: Success leaves clues. Your mindset determines your outcome. #ForeverInProfit #Trading #Lifestyle",
    author: "Quillan Black",
    handle: "@cuebanks",
    avatar: "/avatars/quillan.jpg",
    timestamp: "2024-03-15T11:00:00Z",
    platform: "instagram",
    media: {
      type: "image",
      url: "/social/trading-setup.jpg",
      thumbnail: "/social/trading-setup-thumb.jpg",
    },
  },
  {
    id: 2,
    content:
      "🔴 LIVE NOW: Breaking down the $450K EURUSD trade step by step. Join the stream and learn how we caught this massive move! Link in bio. #ForeverInProfit #Trading",
    author: "Quillan Black",
    handle: "@ForeverInProfit",
    avatar: "/avatars/quillan.jpg",
    timestamp: "2024-03-14T15:00:00Z",
    platform: "youtube",
    media: {
      type: "video",
      url: "https://youtube.com/watch?v=abc123",
      thumbnail: "/social/trade-breakdown-thumb.jpg",
      title: "How We Caught a $450K Move on EURUSD | Live Trading Breakdown",
      views: "24K",
      duration: "1:24:35",
    },
  },
  {
    id: 3,
    content:
      "The difference between where you are and where you want to be is the ACTIONS you haven't taken yet. Stop waiting for the perfect moment - it doesn't exist. #Trading #Success",
    author: "Quillan Black",
    handle: "@cuebanks",
    avatar: "/avatars/quillan.jpg",
    timestamp: "2024-03-14T12:30:00Z",
    platform: "twitter",
    stats: {
      likes: 1243,
      retweets: 342,
      replies: 89,
    },
  },
  {
    id: 4,
    content:
      "POV: It's 2015, and you're thinking this might be the way out. Fast forward to 2024 - trust the process, stay consistent. New mentorship spots opening soon. 📱 #ForeverInProfit #FromNothingToSomething",
    author: "Quillan Black",
    handle: "@cuebanks",
    avatar: "/avatars/quillan.jpg",
    timestamp: "2024-03-13T18:30:00Z",
    platform: "instagram",
    media: {
      type: "image",
      url: "/social/porsche-lifestyle.jpg",
      thumbnail: "/social/porsche-lifestyle-thumb.jpg",
    },
  },
  {
    id: 5,
    content:
      "New video dropping tomorrow! 🔥 'Top 5 Market Structure Mistakes That Cost Traders Money' - Make sure you hit that notification bell! #Trading #Education",
    author: "Quillan Black",
    handle: "@ForeverInProfit",
    avatar: "/avatars/quillan.jpg",
    timestamp: "2024-03-13T16:45:00Z",
    platform: "youtube",
    media: {
      type: "video",
      url: "https://youtube.com/watch?v=xyz789",
      thumbnail: "/social/market-structure-thumb.jpg",
      title: "Top 5 Market Structure Mistakes That Cost Traders Money",
      views: "12K",
      duration: "18:45",
    },
  },
  {
    id: 6,
    content:
      "Quick tip: Your trading plan is only as good as your discipline to follow it. Consistency > Perfection. What's your biggest trading challenge right now? Drop it below 👇",
    author: "Quillan Black",
    handle: "@cuebanks",
    avatar: "/avatars/quillan.jpg",
    timestamp: "2024-03-13T14:20:00Z",
    platform: "twitter",
    stats: {
      likes: 892,
      retweets: 156,
      replies: 234,
    },
  },
  {
    id: 7,
    content:
      "Behind the scenes of our new advanced course module. When you're ready to level up your trading game, we're ready to show you how. 📚 #ForeverInProfit #TradingEducation",
    author: "Quillan Black",
    handle: "@cuebanks",
    avatar: "/avatars/quillan.jpg",
    timestamp: "2024-03-12T20:15:00Z",
    platform: "instagram",
    media: {
      type: "image",
      url: "/social/course-preview.jpg",
      thumbnail: "/social/course-preview-thumb.jpg",
    },
  },
];

// Onboarding Steps Data
export const onboardingSteps: OnboardingStep[] = [
  {
    id: "profile",
    title: "Complete Your Profile",
    description:
      "Add your trading experience and goals to personalize your learning path",
    completed: true,
    href: "/profile",
    eta: "2 mins",
  },
  {
    id: "assessment",
    title: "Trading Knowledge Assessment",
    description:
      "Take a quick test to help us understand your current trading level",
    completed: true,
    href: "/assessment",
    eta: "10 mins",
  },
  {
    id: "broker",
    title: "Connect Your Broker",
    description:
      "Link your trading account to track your progress and performance",
    completed: false,
    href: "/settings/broker",
    eta: "5 mins",
  },
  {
    id: "first-lesson",
    title: "Complete First Lesson",
    description: "Start with the fundamentals of price action trading",
    completed: false,
    href: "/lessons/fundamentals",
    eta: "15 mins",
  },
  {
    id: "join-community",
    title: "Join the Community",
    description: "Connect with other traders in our private Discord server",
    completed: false,
    href: "/community",
    eta: "3 mins",
  },
];
