"use client";

import Image from "next/image";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation"; // Import useRouter

export default function DetectPlat() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submitting state
  const [detectionResult, setDetectionResult] = useState<{
    plat_nomor: string;
    tanggal_pajak: string;
    confidence: number;
  } | null>(null); // Store detection result
  const [showPopup, setShowPopup] = useState(false); // Control popup visibility
  const router = useRouter(); // Initialize the router

  // Handle the image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  // Handle form submission to send the image to FastAPI backend
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
        const data = await response.json(); // Parse the JSON response
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          setDetectionResult(result);
          setShowPopup(true); // Show the popup
        } else {
          alert("No results found in the response.");
        }
      } else {
        const errorData = await response.json(); // Parse error details if available
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
    <div className="flex h-screen">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-grow items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
          {/* High-fidelity Text */}
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Detect Plat Number
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Please upload an image of the vehicle’s license plate to detect the
            number.
          </p>

          {/* Illustration */}
          <Image
            src="/PAKEINI/[6]UploadGambar.png" // Path to your image
            alt="Upload Illustration"
            width={300}
            height={300}
            className="mb-8"
          />

          {/* Upload Button */}
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
          <div></div>

          {/* Image Preview */}
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

              {/* Submit Button */}
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

          {/* Display Popup */}
          {showPopup && detectionResult && (
            <div
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-opacity-50"
              style={{ background: "rgba(0, 0, 0, 0.3)", pointerEvents: "none" }} // Adds slight background opacity
            >
              <div
                className="relative bg-white border border-gray-300 rounded-lg shadow-2xl p-10 w-96 max-w-full"
                style={{ pointerEvents: "auto" }} // Allow interaction with popup
              >
                {/* Close Button */}
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPopup(false)}
                >
                  ✖️
                </button>

                {/* Detection Result */}
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
                  Detection Result
                </h2>
                <p className="text-lg text-gray-700 mb-2">
                  <strong>Plate Number:</strong> {detectionResult.plat_nomor}
                </p>
                <p className="text-lg text-gray-700 mb-2">
                  <strong>Tax Date:</strong> {detectionResult.tanggal_pajak}
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  <strong>Confidence:</strong>{" "}
                  {(detectionResult.confidence * 100).toFixed(2)}%
                </p>

                {/* Okay Button */}
                <button
                  onClick={() => {
                    setShowPopup(false);
                    router.push("/record"); // Redirect to plat record page
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-lg font-bold transition-all duration-300"
                >
                  Okay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
