export interface UserPreview {
  id: string;
  name: string;
  avatar: string;
  location: string;
  tradingExperience: string;
  preferredMarkets: string[];
  stats: {
    lessonsCompleted: number;
    tradeIdeasShared: number;
  };
}

export const mockUsers: UserPreview[] = [
  {
    id: "user123",
    name: "John Trading Pro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    location: "New York, USA",
    tradingExperience: "5+ years",
    preferredMarkets: ["Crypto", "Forex"],
    stats: {
      lessonsCompleted: 42,
      tradeIdeasShared: 89,
    },
  },
  {
    id: "user124",
    name: "Sarah Forex",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    location: "London, UK",
    tradingExperience: "3+ years",
    preferredMarkets: ["Forex", "Indices"],
    stats: {
      lessonsCompleted: 35,
      tradeIdeasShared: 67,
    },
  },
  {
    id: "user125",
    name: "Mike Crypto",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    location: "Singapore",
    tradingExperience: "2+ years",
    preferredMarkets: ["Crypto", "Stocks"],
    stats: {
      lessonsCompleted: 28,
      tradeIdeasShared: 45,
    },
  },
  {
    id: "user126",
    name: "Emma Options",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    location: "Toronto, Canada",
    tradingExperience: "4+ years",
    preferredMarkets: ["Options", "Stocks"],
    stats: {
      lessonsCompleted: 56,
      tradeIdeasShared: 123,
    },
  },
  {
    id: "user127",
    name: "Alex Tech",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    location: "San Francisco, USA",
    tradingExperience: "6+ years",
    preferredMarkets: ["Stocks", "Options"],
    stats: {
      lessonsCompleted: 78,
      tradeIdeasShared: 234,
    },
  },
  {
    id: "user128",
    name: "Lisa Futures",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    location: "Chicago, USA",
    tradingExperience: "7+ years",
    preferredMarkets: ["Futures", "Forex"],
    stats: {
      lessonsCompleted: 92,
      tradeIdeasShared: 178,
    },
  },
];
