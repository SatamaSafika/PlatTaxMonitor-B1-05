"use client";

import Image from "next/image";
import { useState } from "react";
import Sidebar from "@/components/Sidebar"; // Adjust this path if necessary

export default function DetectPlat() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submitting state

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
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle success (e.g., show a success message or redirect)
        alert("Image successfully submitted!");
      } else {
        // Handle error (e.g., show an error message)
        alert("Error submitting image.");
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
            Please upload an image of the vehicle’s license plate to detect the number.
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
              <Image
                src="/next.svg" // Optional: you can use another small icon here
                alt="Upload Icon"
                width={30}
                height={30}
                className="mr-2"
              />
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
                  isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                {isSubmitting ? "Processing..." : "Submit/Process Image"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
