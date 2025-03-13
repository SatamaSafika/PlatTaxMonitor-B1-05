"use client";  // This marks the component as a client-side component

import { useRouter } from 'next/navigation';  // Use 'next/navigation' for routing in App Router
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page
    router.push('/dashboard');
  }, [router]);

  return null;  // No UI needed, just the redirect
}
