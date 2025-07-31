"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust this path to your firebase setup

interface TradeModalProps {
  open: boolean;
  onClose: () => void;
  type: "BUY" | "SELL";
  symbol: string;
  currentPrice: number | null;
}

export default function TradeModal({
  open,
  onClose,
  type,
  symbol,
  currentPrice,
}: TradeModalProps) {
  const [quantity, setQuantity] = useState(0);
  const [mode, setMode] = useState<"delivery" | "intraday">("delivery");
  const [loading, setLoading] = useState(false);

  const handleTrade = async () => {
    if (!currentPrice || quantity <= 0) return;
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const userDocRef = doc(db, "users", user.uid);
      const holdingRef = doc(db, "users", user.uid, "holdings", symbol);
      const holdingSnap = await getDoc(holdingRef);

      if (type === "BUY") {
  if (holdingSnap.exists()) {
    const existing = holdingSnap.data();
    const newQty = existing.quantity + quantity;
    const newAvg =
      (existing.avgPrice * existing.quantity + currentPrice * quantity) / newQty;

    await updateDoc(holdingRef, {
      quantity: newQty,
      avgPrice: newAvg,
      transactionPrice: currentPrice,
      livePrice: currentPrice,
      profitLoss: (currentPrice - newAvg) * newQty,
      orderType: type.toLowerCase(),
      orderMode: mode,
      dateTime: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } else {
    await setDoc(holdingRef, {
      symbol,
      name: symbol,
      quantity,
      avgPrice: currentPrice,
      transactionPrice: currentPrice,
      livePrice: currentPrice,
      profitLoss: 0,
      orderType: type.toLowerCase(),
      orderMode: mode,
      dateTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  }
}


      if (type === "SELL") {
  if (!holdingSnap.exists()) throw new Error("No holdings to sell");

  const existing = holdingSnap.data();
  const newQty = existing.quantity - quantity;
  const avgPrice = existing.avgPrice;

  if (newQty < 0) throw new Error("Not enough stock to sell");

  if (newQty === 0) {
    await updateDoc(holdingRef, {
      quantity: 0,
      transactionPrice: currentPrice,
      livePrice: currentPrice,
      profitLoss: 0,
      orderType: type.toLowerCase(),
      orderMode: mode,
      dateTime: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } else {
    await updateDoc(holdingRef, {
      quantity: newQty,
      transactionPrice: currentPrice,
      livePrice: currentPrice,
      profitLoss: (currentPrice - avgPrice) * newQty,
      orderType: type.toLowerCase(),
      orderMode: mode,
      dateTime: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}


      onClose();
    } catch (err) {
      console.error("Trade error:", err);
      alert("Error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-gray-900 p-6 rounded-xl w-full max-w-md text-white">
          <Dialog.Title className="text-xl font-bold mb-4">
            {type === "BUY" ? "Buy" : "Sell"} {symbol}
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="text-sm">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 text-white"
                min="1"
              />
            </div>

            <div>
              <label className="text-sm">Order Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "delivery" | "intraday")}
                className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="delivery">Delivery</option>
                <option value="intraday">Intraday</option>
              </select>
            </div>

            <div>
              <label className="text-sm">Price</label>
              <p className="text-green-400 font-bold">${currentPrice?.toFixed(2)}</p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleTrade} disabled={loading}>
                {loading ? "Processing..." : type}
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
