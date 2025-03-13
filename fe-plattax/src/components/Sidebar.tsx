"use client"; // Mark this component as a client component

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react"; // Hamburger icon
import { usePathname } from "next/navigation"; // In App Router, use `usePathname`

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

  // Color palette from the image you provided
  const darkNavy: string = "#030117";
  const limeGreen: string = "#d5fb0f";

  return (
    <div className="relative flex">
      {/* Hamburger Icon (toggle button) */}
      <button
        onClick={toggleSidebar}
        style={{ backgroundColor: limeGreen }} // Set inline style for background color
        className="absolute top-4 left-4 z-50 text-white p-2 rounded-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        style={{ backgroundColor: darkNavy }} // Set inline style for background color
        className={`${
          isOpen ? "w-64" : "w-0"
        } flex flex-col h-screen p-4 transition-all duration-300 overflow-hidden`}
      >
        {isOpen && (
          <>
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <Image
                src="/PAKEINI/[1]LogoPlatTax.png"
                alt="PlatTax Logo"
                width={100}
                height={100}
              />
              <h1 className="text-white text-lg font-bold mt-2">
                PlatTax Monitor
              </h1>
            </div>

            {/* Menu */}
            <div className="flex flex-col gap-4">
              {/* Dashboard (Detect Plat renamed) */}
              <Link href="/dashboard" legacyBehavior>
                <a className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg transition-all transform hover:scale-105">
                  <Image
                    src="/PAKEINI/[2]DetectPlat.png"
                    alt="Detect Plat"
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <span className="font-bold">Detect Plat</span>
                </a>
              </Link>

              {/* Plat Record */}
              <Link href="/dashboard/plat-record" legacyBehavior>
                <a className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-lg transition-all transform hover:scale-105">
                  <Image
                    src="/PAKEINI/[3]PlatRecord.png"
                    alt="Plat Record"
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <span className="font-bold">Plat Record</span>
                </a>
              </Link>

              {/* Profile */}
              <Link href="/dashboard/profile" legacyBehavior>
                <a className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg transition-all transform hover:scale-105">
                  <Image
                    src="/PAKEINI/[4]Profile.png"
                    alt="Profile"
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <span className="font-bold">Profile</span>
                </a>
              </Link>
            </div>

            {/* Contact Us */}
            <div className="mt-auto flex flex-col items-center">
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
