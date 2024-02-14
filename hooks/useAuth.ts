"use client";
import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const userId = session?.user?.id;

  return { isAuthenticated, userId };
}
