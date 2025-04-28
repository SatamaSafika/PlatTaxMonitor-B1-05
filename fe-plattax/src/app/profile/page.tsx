"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Lock, LogOut } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session } = useSession();
  const username = session?.user?.name || "User";

  // Modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Don't redirect while checking session
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  // Logout function
  const handleLogout = async () => {
    console.log("Logging out...");
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col items-center gap-10">
        {/* Profile Picture */}
        <Image
          src="/icons/profile-pict.png"
          alt="Profile Picture"
          width={320}
          height={320}
          className="rounded-full border-8 border-gray-300"
        />

        {/* Welcome Text */}
        <h1 className="text-6xl font-bold text-gray-800">Hello, {username}!</h1>

        {/* Edit Password Button */}
        <Button
          className="p-6 text-2xl flex gap-4 items-center text-white bg-cover bg-center font-bold transition duration-200 hover:scale-105 hover:brightness-110"
          style={{
            backgroundImage: "url('/icons/title-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Lock size={48} /> Edit Password
        </Button>

        {/* Log Out Button */}
        <Button
          onClick={() => {
            console.log("Open logout confirmation modal");
            setShowLogoutModal(true);
          }}
          className="p-6 text-2xl flex gap-4 items-center text-white bg-red-600 hover:bg-red-700 transition duration-200 hover:scale-105 hover:brightness-110"
        >
          <LogOut size={48} /> Log Out
        </Button>
      </div>

      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              Apakah Anda yakin ingin keluar?
            </h2>
            <div className="flex justify-center gap-6 mt-6">
              <Button
                onClick={() => {
                  console.log("Cancel logout");
                  setShowLogoutModal(false);
                }}
                className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-6 py-3 text-lg"
              >
                Batal
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-lg"
              >
                Ya, Keluar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
