"use client";

import { useSession } from "next-auth/react";  // Import the next-auth session hook
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();  // Use session to check authentication status
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Don't redirect while checking session

    if (!session) {
      // If user is not authenticated, redirect to /login
      router.push('/login');
    } else {
      // If authenticated, redirect to /dashboard
      router.push('/dashboard');
    }
  }, [session, status, router]);

  return null;  // No UI needed
}
