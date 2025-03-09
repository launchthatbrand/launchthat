export interface Group {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  topics: string[];
  isPrivate: boolean;
  lastActive: string;
}

export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Forex Trading Strategies",
    description:
      "A community of forex traders sharing strategies, analysis, and market insights. Join us to discuss currency pairs, technical analysis, and trading psychology.",
    coverImage: "/groups/forex-trading.jpg",
    memberCount: 1234,
    topics: ["Forex", "Technical Analysis", "Trading Psychology"],
    isPrivate: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: "2",
    name: "Crypto Trading Elite",
    description:
      "Advanced cryptocurrency trading group focused on technical analysis, DeFi opportunities, and long-term investment strategies.",
    coverImage: "/groups/crypto-trading.jpg",
    memberCount: 856,
    topics: ["Crypto", "DeFi", "Technical Analysis"],
    isPrivate: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: "3",
    name: "Stock Market Fundamentals",
    description:
      "Learn and discuss fundamental analysis, value investing, and long-term stock market strategies. Perfect for beginners and intermediate traders.",
    coverImage: "/groups/stock-market.jpg",
    memberCount: 2156,
    topics: ["Stocks", "Fundamental Analysis", "Value Investing"],
    isPrivate: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "4",
    name: "Options Trading Masterminds",
    description:
      "Advanced options trading strategies, Greeks analysis, and risk management. Share and learn from experienced options traders.",
    coverImage: "/groups/options-trading.jpg",
    memberCount: 567,
    topics: ["Options", "Risk Management", "Advanced Trading"],
    isPrivate: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "5",
    name: "Day Trading Pros",
    description:
      "Fast-paced community for active day traders. Share setups, discuss market conditions, and improve your day trading skills.",
    coverImage: "/groups/day-trading.jpg",
    memberCount: 943,
    topics: ["Day Trading", "Scalping", "Market Analysis"],
    isPrivate: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
  },
  {
    id: "6",
    name: "Swing Trading Strategies",
    description:
      "Focus on multi-day to multi-week trading opportunities. Technical analysis, chart patterns, and trade management discussions.",
    coverImage: "/groups/swing-trading.jpg",
    memberCount: 1532,
    topics: ["Swing Trading", "Technical Analysis", "Risk Management"],
    isPrivate: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
];
