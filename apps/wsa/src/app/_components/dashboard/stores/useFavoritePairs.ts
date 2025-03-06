import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritePairsState {
  favoritePairs: string[];
  addFavoritePair: (pair: string) => void;
  removeFavoritePair: (pair: string) => void;
  toggleFavoritePair: (pair: string) => void;
}

export const useFavoritePairs = create<FavoritePairsState>()(
  persist(
    (set) => ({
      favoritePairs: [],
      addFavoritePair: (pair) =>
        set((state) => ({
          favoritePairs: [...new Set([...state.favoritePairs, pair])],
        })),
      removeFavoritePair: (pair) =>
        set((state) => ({
          favoritePairs: state.favoritePairs.filter((p) => p !== pair),
        })),
      toggleFavoritePair: (pair) =>
        set((state) => ({
          favoritePairs: state.favoritePairs.includes(pair)
            ? state.favoritePairs.filter((p) => p !== pair)
            : [...state.favoritePairs, pair],
        })),
    }),
    {
      name: "favorite-pairs",
    },
  ),
);
