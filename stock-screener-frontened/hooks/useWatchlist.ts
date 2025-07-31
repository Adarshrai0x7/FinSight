import { create } from "zustand";
import { db } from "@/lib/firebase"; // <-- ensure you have firebase.ts exporting initialized Firestore
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "@/hooks/useAuth";  // <-- or however you access user data

export type WatchItem = {
  symbol: string;
  name: string;
  price: string;
  change: string;
};

type WatchlistState = {
  items: WatchItem[];
  has: (symbol: string) => boolean;
  add: (symbol: string) => Promise<void>;
  remove: (symbol: string) => Promise<void>;
  load: () => Promise<void>;
};

export const useWatchlist = create<WatchlistState>((set, get) => ({
  items: [],

  has: (symbol: string) => get().items.some((s) => s.symbol === symbol),

  load: async () => {
    const user = useAuthStore.getState().user; // get current logged-in user
    if (!user) return;

    const ref = doc(db, "watchlists", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      set({ items: snap.data().items || [] });
    } else {
      await setDoc(ref, { items: [] });
      set({ items: [] });
    }
  },

  add: async (symbol: string) => {
  const user = useAuthStore.getState().user;
  if (!user) return;

  if (get().has(symbol)) return;

  const res = await fetch(`http://localhost:5000/api/stocks/quote/${symbol}`);
  const data = await res.json();
  if (!data || !data.price) throw new Error("Symbol not found");

  const newItem: WatchItem = {
    symbol: data.symbol,
    name: data.name || symbol,
    price: `$${parseFloat(data.price).toFixed(2)}`,
    change: `${((parseFloat(data.change) / parseFloat(data.price)) * 100).toFixed(2)}%`,

  };

  const newItems = [...get().items, newItem];
  set({ items: newItems });

  const ref = doc(db, "watchlists", user.uid);
  await setDoc(ref, { items: newItems }, { merge: true });
},

remove: async (symbol: string) => {
  const user = useAuthStore.getState().user;
  if (!user) return;

  const newItems = get().items.filter((s) => s.symbol !== symbol);
  set({ items: newItems });

  const ref = doc(db, "watchlists", user.uid);
  await setDoc(ref, { items: newItems }, { merge: true });
},

}));
