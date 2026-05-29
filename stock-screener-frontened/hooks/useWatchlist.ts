import { create } from "zustand";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthStore } from "@/hooks/useAuth";
import { API_CONFIG } from "@/lib/api-config";

export type WatchItem = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
};

type WatchlistState = {
  items: WatchItem[];
  isAdding: boolean;
  addError: string | null;
  has: (symbol: string) => boolean;
  add: (symbol: string) => Promise<void>;
  remove: (symbol: string) => Promise<void>;
  load: () => Promise<void>;
  refreshPrices: () => Promise<void>;
};

const BASE_URL = API_CONFIG.STOCK_API;

const fetchQuote = async (symbol: string): Promise<WatchItem | null> => {
  try {
    const res = await fetch(`${BASE_URL}/api/stocks/quote/${symbol}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.price) return null;

    const price = parseFloat(data.price);
    // data.change from Yahoo is the absolute $ change, not a percent
    const change = typeof data.change === "number" ? data.change : parseFloat(data.change ?? "0");
    const prevPrice = price - change;
    const changePercent = prevPrice !== 0 ? (change / prevPrice) * 100 : 0;

    return {
      symbol: data.symbol ?? symbol.toUpperCase(),
      name: data.name ?? symbol,
      price: `$${price.toFixed(2)}`,
      change: `${change >= 0 ? "+" : ""}${change.toFixed(2)}`,
      changePercent: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
      isPositive: change >= 0,
    };
  } catch {
    return null;
  }
};

export const useWatchlist = create<WatchlistState>((set, get) => ({
  items: [],
  isAdding: false,
  addError: null,

  has: (symbol: string) =>
    get().items.some((s) => s.symbol === symbol.toUpperCase()),

  load: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const ref = doc(db, "watchlists", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      set({ items: snap.data().items ?? [] });
    } else {
      await setDoc(ref, { items: [] });
      set({ items: [] });
    }
  },

  add: async (symbol: string) => {
    const user = useAuthStore.getState().user;
    if (!user) { set({ addError: "Please log in to use your watchlist." }); return; }
    if (get().has(symbol)) return;
    if (get().isAdding) return; // guard against rapid clicks

    set({ isAdding: true, addError: null });
    try {
      const item = await fetchQuote(symbol);
      if (!item) {
        set({ addError: `Symbol "${symbol}" not found. Check the ticker and try again.` });
        return;
      }
      const newItems = [...get().items, item];
      set({ items: newItems });
      const ref = doc(db, "watchlists", user.uid);
      await setDoc(ref, { items: newItems }, { merge: true });
    } catch (e) {
      set({ addError: "Failed to add symbol. Please try again." });
    } finally {
      set({ isAdding: false });
    }
  },

  remove: async (symbol: string) => {
    const user = useAuthStore.getState().user;
    const newItems = get().items.filter((s) => s.symbol !== symbol.toUpperCase());
    set({ items: newItems });
    if (!user) return;
    const ref = doc(db, "watchlists", user.uid);
    await setDoc(ref, { items: newItems }, { merge: true });
  },

  refreshPrices: async () => {
    const { items } = get();
    if (items.length === 0) return;
    const updated = await Promise.all(
      items.map(async (item) => {
        const fresh = await fetchQuote(item.symbol);
        return fresh ?? item; // keep old if fetch fails
      })
    );
    set({ items: updated });

    const user = useAuthStore.getState().user;
    if (!user) return;
    const ref = doc(db, "watchlists", user.uid);
    await setDoc(ref, { items: updated }, { merge: true });
  },
}));
