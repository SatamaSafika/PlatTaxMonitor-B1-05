"use client";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/app/hooks/use-auth";

export default function Page() {
  const { status } = useAuth();

  // Show loading state while checking authentication
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-10 md:p-12 bg-[#07004e] relative">
      {/* Background overlay to soften the gradient */}
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

      {/* Login container */}
      <div className="absolute inset-0 bg-white p-12 rounded-lg shadow-lg z-90">
        {/* Form title */}
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Welcome Back to <br /> PlatTax Monitor!
        </h1>

        <LoginForm />

        {/* Forgot password */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Forgot your password?{" "}
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline hover:text-blue-800 transition-all"
          >
            Reset it here
          </a>
        </p>
      </div>
    </div>
  );
}
