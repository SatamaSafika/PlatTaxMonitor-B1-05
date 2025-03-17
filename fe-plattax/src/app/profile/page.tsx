"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const username = session?.user?.name || "User";

  return (
    <div className="flex min-h-screen p-6 bg-gray-100 ml-[-150px]">
      <div className="w-1/4"></div> {/* Placeholder sidebar */}
      
      <div className="w-3/4 flex flex-col items-center gap-10">  
        {/* Profile Picture */}
        <Image 
          src="/icons/profile-pict.png" 
          alt="Profile Picture" 
          width={320}  // Diperbesar 2x dari sebelumnya (160)
          height={320} 
          className="rounded-full border-8 border-gray-300"
        />
        
        {/* Welcome Text */}
        <h1 className="text-8xl font-bold text-gray-800">
          Hello, {username}!
        </h1>
        
        {/* Edit Password Button */}
        <Button 
          className="p-6 text-3xl flex gap-4 items-center text-white bg-cover bg-center font-bold"
          style={{ 
            backgroundImage: "url('/icons/title-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Lock size={64} /> <strong>Edit Password</strong>
        </Button>
      </div>
    </div>
  );
}
