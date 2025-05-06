"use client";

import Image from "next/image";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function DetectPlat() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectionResults, setDetectionResults] = useState<
    { plat_nomor: string; bulan_tahun_pajak: string }[]
  >([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please upload an image first!");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/detect/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const formattedResults = data.results.map((item: any) => ({
            plat_nomor: item.plat_nomor,
            bulan_tahun_pajak: item.bulan_tahun_pajak,
          }));
          setDetectionResults(formattedResults);
        } else {
          alert("No results found in the response.");
        }
      } else {
        const errorData = await response.json();
        alert(`Error submitting image: ${errorData.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting image:", error);
      alert("There was a problem submitting the image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-grow items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Detect Plat Number
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Please upload an image of the vehicle’s license plate to detect the
            number.
          </p>

          <Image
            src="/PAKEINI/[6]UploadGambar.png"
            alt="Upload Illustration"
            width={300}
            height={300}
            className="mb-8"
          />

          <div className="flex flex-row items-center gap-4">
            <Link href={"/detect"}>
              <div className="flex items-center justify-center bg-emerald-400 hover:bg-emerald-700 text-white py-4 px-8 rounded-lg text-lg font-bold transition-all duration-300 hover:shadow-xl transform hover:scale-105">
                Detect Now!
              </div>
            </Link>
            <label htmlFor="imageUpload" className="cursor-pointer">
              <div className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg text-lg font-bold transition-all duration-300 hover:shadow-xl transform hover:scale-105">
                Upload Your Photo Here!
              </div>
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {selectedImage && (
            <>
              <div className="mt-6">
                <p className="text-center text-gray-500 mb-4">Preview:</p>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Uploaded Preview"
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`mt-6 bg-green-600 text-white py-2 px-6 rounded-lg text-lg font-bold transition-all duration-200 hover:shadow-xl ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
              >
                {isSubmitting ? "Processing..." : "Submit/Process Image"}
              </button>
            </>
          )}

          {detectionResults.length > 0 && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Detection Result
              </h2>
              {detectionResults.map((result, index) => (
                <div key={index} className="mb-4 p-2 border-b border-gray-300">
                  <p className="text-gray-700">
                    <strong>Plate Number:</strong> {result.plat_nomor}
                  </p>
                  <p className="text-gray-700">
                    <strong>Tax Date:</strong> {result.bulan_tahun_pajak}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
