"use client";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Akses kamera
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const formData = new FormData();
          formData.append("file", blob, "frame.jpg");

          const res = await fetch("http://localhost:8000/detect/", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          setResult(data);
        }, "image/jpeg");
      }
    }
  };

  return (
    <main className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Deteksi Plat Nomor</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded shadow w-full max-w-md"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button
        onClick={handleCapture}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Deteksi
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow w-full max-w-md">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
