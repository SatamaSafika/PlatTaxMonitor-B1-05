"use client";
import { useRef, useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface DetectionResult {
  plat_nomor: string;
  tanggal_pajak: string;
  confidence: number;
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [lastPlate, setLastPlate] = useState("");
  const [lastDetectedAt, setLastDetectedAt] = useState(0);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
    if (status === "loading") return; // Don't redirect while checking session

    // Kalau sudah login, baru aktifkan kamera
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });

    const interval = setInterval(() => {
      handleCapture();
    }, 3000);

    return () => clearInterval(interval);
  }, [session, lastPlate, lastDetectedAt]);

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

          try {
            const res = await fetch("http://localhost:8000/detect/", {
              method: "POST",
              body: formData,
            });

            const data = await res.json();
            const plate = data.results?.[0]?.plat_nomor;

            if (
              plate &&
              plate !== "Tidak ditemukan" &&
              plate !== lastPlate &&
              Date.now() - lastDetectedAt > 10000 // 10 detik jeda antar deteksi plat yang sama
            ) {
              setLastPlate(plate);
              setLastDetectedAt(Date.now());
              setResult(data.results[0]);
            }
          } catch (err) {
            console.error("Deteksi gagal:", err);
          }
        }, "image/jpeg");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col items-center w-screen justify-center p-4 space-y-4">
        <h1 className="text-xl font-bold">Deteksi Plat Nomor</h1>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded shadow w-full max-w-2/5"
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Hasil Deteksi */}
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Hasil Deteksi
            </h2>
            <p className="text-gray-700">
              <strong>Plate Number:</strong> {result.plat_nomor}
            </p>
            <p className="text-gray-700">
              <strong>Tax Date:</strong> {result.tanggal_pajak}
            </p>
            <p className="text-gray-700">
              <strong>Confidence:</strong>{" "}
              {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
