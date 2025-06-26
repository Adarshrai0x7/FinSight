// Create a new file, for example: app/components/NextAuthProvider.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

// Define the props for the provider, which include the children to be rendered.
interface NextAuthProviderProps {
  children: React.ReactNode;
}

// This is the provider component that wraps your app in SessionProvider.
export default function NextAuthProvider({ children }: NextAuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
