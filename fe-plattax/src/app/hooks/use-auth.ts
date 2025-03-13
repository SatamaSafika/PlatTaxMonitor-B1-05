// src/hooks/use-auth.ts
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if authentication is still loading
    if (status === "loading") return;

    // If no session exists, redirect to login or register
    if (!session) {
      const path = window.location.pathname === "/register" ? "/register" : "/login";
      router.replace(path);
    }
    
    if (session) {
      router.push("/");
    }
  }, [session, status, router]);

  return { session, status };
}