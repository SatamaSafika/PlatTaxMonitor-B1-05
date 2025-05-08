"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Update the path to the correct location
import { signOut } from "next-auth/react";

export default function EditPasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password baru tidak cocok!");
      return;
    }
  
    try {
      const response = await fetch("/api/editpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Terjadi kesalahan.");
      } else {
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error("Update password error:", error);
      setError("Gagal menghubungi server.");
    }
  }; 

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-10 flex flex-col items-center gap-8">
        <h1 className="text-5xl font-bold text-gray-800">Edit Password</h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password Lama
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-md rounded-2xl p-6 border border-blue-300 shadow-lg bg-white">
              <DialogHeader className="flex items-center gap-2">
                <div className="bg-green-100 text-green-600 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <DialogTitle className="text-green-700 text-lg font-semibold">
                  Password Berhasil Diubah!
                </DialogTitle>
              </DialogHeader>

              <div className="text-sm text-gray-600 mt-2">
                Silakan keluar dan masuk kembali menggunakan password baru Anda untuk melanjutkan.
              </div>

            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button
                variant="ghost"
                className="border border-gray-300"
                onClick={() => router.push("/profile")}
              >
                Nanti Dulu
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign Out Sekarang
              </Button>
            </DialogFooter>

            </DialogContent>
          </Dialog>


          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-center font-semibold bg-red-100 border border-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full text-xl py-4 text-white font-bold bg-cover bg-center transition duration-200 hover:scale-105 hover:brightness-110"
            style={{
              backgroundImage: "url('/icons/title-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            Simpan Perubahan
          </Button>
        </form>
      </div>
    </div>
  );
}
