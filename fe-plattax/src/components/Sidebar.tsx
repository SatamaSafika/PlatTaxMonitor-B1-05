"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  forceClose?: boolean; // Optional prop to force close the sidebar
}

export default function Sidebar({ forceClose }: SidebarProps) {
  const pathname = usePathname(); // Use `usePathname` instead of `useRouter`
  const [isOpen, setIsOpen] = useState<boolean>(true); // Default is open

  // Effect to automatically close the sidebar on /result page or when forceClose is true
  useEffect(() => {
    if (pathname === "/result" || forceClose) {
      setIsOpen(false); // Close the sidebar
    }
  }, [pathname, forceClose]);

  // Toggle function for sidebar
  const toggleSidebar = (): void => {
    setIsOpen(!isOpen);
  };

  // Redirect logic for Plat Record
  const handlePlatRecordClick = () => {
    window.location.href = "http://localhost:3000/record";
  };

  // Redirect logic for Profile
  const handleProfileClick = () => {
    window.location.href = "http://localhost:3000/profile";
  };

  // Color palette from the image you provided
  const darkNavy: string = "#030117";

  return (
    <div className="relative flex">
      {/* Hamburger Icon (toggle button) */}
      <button
        onClick={toggleSidebar}
        style={{ backgroundColor: darkNavy }}
        className={`fixed top-4 ${isOpen ? 'left-[260px]' : 'left-6'} z-50 text-white p-2 rounded-lg transition-all duration-300`}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
<<<<<<< HEAD
        <div
          style={{ backgroundColor: darkNavy }} 
          className={`${
            isOpen ? "w-64" : "w-0"
          } flex flex-col h-screen fixed top-0 left-0 p-4 transition-all duration-300 overflow-y-auto`}
        >
=======
      <div
        style={{ backgroundColor: darkNavy }}
        className={`${
          isOpen ? "w-64" : "w-0"
        } flex flex-col h-screen p-4 transition-all duration-300 overflow-hidden`}
      >
>>>>>>> a2ea9b0aca613e841b96b3065359265758431be1
        {isOpen && (
          <>
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <Image
                src="/PAKEINI/[1]LogoPlatTax.png"
                alt="PlatTax Logo"
                width={150}
                height={150}
              />
              <h1 className="text-white text-lg font-bold mt-2">
                PlatTax Monitor
              </h1>
            </div>

            {/* Menu */}
            <div className="flex flex-col gap-8">
              {/* Dashboard (Detect Plat renamed) */}
              <Link
                href="/dashboard"
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-all transform hover:scale-105"
              >
                {" "}
                {/* Increased button height */}
                <Image
                  src="/PAKEINI/[2]DetectPlat.png"
                  alt="Detect Plat"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <span className="font-bold text-xl">Detect Plat</span>
              </Link>

              {/* Plat Record with click event */}
              <button
                onClick={handlePlatRecordClick}
                className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg transition-all transform hover:scale-105"
              >
                {" "}
                {/* Increased button height */}
                <Image
                  src="/PAKEINI/[3]PlatRecord.png"
                  alt="Plat Record"
                  width={50}
                  height={50}
                  className="mr-2"
                />
                <span className="font-bold text-xl">Plat Record</span>
              </button>

              {/* Profile */}
              <button
                onClick={handleProfileClick}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all transform hover:scale-105"
              >
                {" "}
                {/* Increased button height */}
                <Image
                  src="/PAKEINI/[4]Profile.png"
                  alt="Profile"
                  width={50}
                  height={50}
                  className="mr-2"
                />
                <span className="font-bold text-xl">Profile</span>
              </button>
            </div>

            {/* Spacer to push the Contact Us to the bottom */}
            <div className="flex-grow"></div>

            {/* Contact Us */}
            <div className="mt-auto flex flex-col items-center mb-6">
              <Image
                src="/PAKEINI/[5]ContactUs.png"
                alt="Contact Us"
                width={50}
                height={50}
              />
              <p className="text-white mt-2 text-center">
                Contact Us Via Our Email! <br />
                <span className="text-lime-400 font-bold">
                  plattax.monitor@gmail.com
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
