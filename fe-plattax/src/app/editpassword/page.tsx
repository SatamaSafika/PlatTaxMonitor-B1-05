"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, LogOut } from "lucide-react";
import Sidebar from "@/components/Sidebar"; // Pastikan Sidebar ini ada dan sudah diimport

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const username = session?.user?.name || "User";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      signOut({ callbackUrl: "/login" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Profile Section */}
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
          onClick={() => router.push("/editpassword")}
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
          onClick={handleLogout}
          className="p-6 text-2xl flex gap-4 items-center text-white bg-red-600 hover:bg-red-700 transition duration-200 hover:scale-105 hover:brightness-110"
        >
          <LogOut size={48} /> Log Out
        </Button>
      </div>
    </div>
  );
}
