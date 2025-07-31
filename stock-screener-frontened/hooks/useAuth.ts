import { create } from "zustand";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
};

export const useAuthStore = create<AuthState>((set) => {
  // Listen to Firebase Auth state
  onAuthStateChanged(auth, (firebaseUser) => {
    set({ user: firebaseUser, loading: false });
  });

  return {
    user: auth.currentUser,
    loading: true,
  };
});
