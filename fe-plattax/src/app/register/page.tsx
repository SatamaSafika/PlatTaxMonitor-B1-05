"use client";
import { RegisterForm } from "@/components/register-form";
// import Image from "next/image";
import { useAuth } from "@/app/hooks/use-auth";

export default function RegisterPage() {
  const { status } = useAuth();

  // Show loading state while checking authentication
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* <Image src="/" alt="" fill /> */}
      <div className="w-full max-w-sm z-10">
        <RegisterForm />
      </div>
    </div>
  );
}
