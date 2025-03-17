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
    <div 
        className="flex min-h-screen items-center justify-center p-10 md:p-12 bg-[#07004e] relative"
        > 
          {/* Background overlay to soften the gradient */}
          <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
    
          {/* Login container */}
          <div className="absolute inset-0 bg-white p-12 rounded-lg shadow-lg relative z-90">
            {/* Form title */}
            <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
              Welcome to<br/> PlatTax Monitor!
            </h1>
    
            <RegisterForm />
          </div>
        </div>
  );
}
