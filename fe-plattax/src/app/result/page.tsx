"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // For App Router in Next.js 13
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Smooth animations
import Sidebar from "@/components/Sidebar"; // Import Sidebar

export default function ResultPage() {
  const router = useRouter();
  const [resultData, setResultData] = useState({
    platNumber: "",
    taxDate: "",
    platYearEnd: "",
    description: "",
    imageUrl: "",  });

  useEffect(() => {
    // Simulated API call to fetch result data (replace with actual API call)
    setResultData({
      platNumber: "B 2156 TOR",
      taxDate: "28 September",
      platYearEnd: "2027",
      description:
        "Kendaraan belum membayar pajak sejak 2021! Silakan check email untuk detail tagihan kendaraan.",
      imageUrl: "/PAKEINI/[7]Contoh.jpeg", // Update to actual image path
    });
  }, []);

  const handleClose = () => {
    router.push("/dashboard"); // Navigate back to the dashboard
  };

  return (
    <motion.div
      className="flex h-screen bg-gray-200" // Darker background
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <Sidebar forceClose={true} /> {/* Force the sidebar to close */}

      {/* Main content */}
      <motion.div
        className="flex-grow p-8 flex flex-col items-center justify-center"
        initial={{ x: 200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {/* Result Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-blue-800">
            Result
          </h2>

          {/* Plate Image */}
          {resultData.imageUrl ? (
            <motion.div
              className="flex justify-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={resultData.imageUrl} // Ensure imageUrl is not empty
                alt="Detected Plate"
                width={400}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          ) : (
            <p className="text-center text-red-500">No image available</p>
          )}

          {/* Result Info */}
          <div className="bg-blue-500 text-white p-6 rounded-lg text-lg mb-6">
            <p className="mb-2">
              <span className="font-bold">Nomor Plat :</span>{" "}
              {resultData.platNumber}
            </p>
            <p className="mb-2">
              <span className="font-bold">Tanggal Pajak :</span>{" "}
              {resultData.taxDate}
            </p>
            <p className="mb-2">
              <span className="font-bold">Tahun Berakhir Plat :</span>{" "}
              {resultData.platYearEnd}
            </p>
            <p>
              <span className="font-bold">Keterangan :</span>{" "}
              {resultData.description}
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleClose}
              className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg text-lg transition-all duration-200"
              whileHover={{ scale: 1.1 }}
            >
              CLOSE
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
