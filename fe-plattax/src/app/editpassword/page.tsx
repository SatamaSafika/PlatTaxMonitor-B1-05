"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";

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
        alert("Password berhasil diubah!");
        router.push("/profile"); // atau halaman lain sesuai kebutuhanmu
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
