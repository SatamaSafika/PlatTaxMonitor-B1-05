"use client";
import { useRef, useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface DetectionResult {
  plat_nomor: string;
  tax_date: string;
  nama_pemilik: string;
  harga_pajak: number;
  nilai_tagihan: number;
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>(
    []
  );
  const [lastPlate, setLastPlate] = useState("");
  const [lastDetectedAt, setLastDetectedAt] = useState(0);
  const [emailStatuses, setEmailStatuses] = useState<boolean[]>([]); // Track email statuses
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
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/detect/`,
                {
                  method: "POST",
                  body: formData,
                }
              );

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
                setDetectionResults((prevResults) => [
                  ...prevResults,
                  data.results[0],
                ]);

                // Kirim email untuk setiap hasil deteksi
                const emailStatuses = await Promise.all(
                  data.results.map(async (result: DetectionResult) => {
                    try {
                      const emailResponse = await fetch("/api/sendEmail", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          to: "neabarbara2@gmail.com", // Ganti dengan email dari database
                          subject: "Tagihan Pajak Kendaraan Anda",
                          message: `
                            <p>Kendaraan dengan plat <strong>${result.plat_nomor}</strong> telah terdeteksi oleh sistem kami.</p>
                            <p>Total tagihan Anda: <strong>Rp ${result.nilai_tagihan}</strong>.</p>
                            <p>Segera bayar sebelum terkena denda tambahan.</p>
                          `,
                        }),
                      });
                      return emailResponse.ok; // True jika email terkirim, false jika gagal
                    } catch (error) {
                      console.error("Error sending email:", error);
                      return false;
                    }
                  })
                );
                setEmailStatuses(emailStatuses); // Update email statuses
              }
            } catch (err) {
              console.error("Deteksi gagal:", err);
            }
          }, "image/jpeg");
        }
      }
    };

    const interval = setInterval(() => {
      handleCapture();
    }, 3000);

    return () => clearInterval(interval);
  }, [session, lastPlate, lastDetectedAt, status, router]);

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
        {detectionResults.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {detectionResults.map((result, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md border border-gray-300"
              >
                <h2 className="text-lg font-bold text-gray-800 mb-2 text-center">
                  Detection Result {index + 1}
                </h2>
                <p className="text-gray-700">
                  <strong>Plate Number:</strong> {result.plat_nomor}
                </p>
                <p className="text-gray-700">
                  <strong>Tax Date:</strong> {result.tax_date}
                </p>
                <p className="text-gray-700">
                  <strong>Owner&apos;s Name:</strong> {result.nama_pemilik}
                </p>
                <p className="text-gray-700">
                  <strong>Tax Price:</strong> {result.harga_pajak}
                </p>
                <p className="text-gray-700">
                  <strong>Tax Amount:</strong> {result.nilai_tagihan}
                </p>
                {/* Keterangan Email */}
                {emailStatuses[index] ? (
                  <p className="text-green-600 font-bold mt-2">Email Sent!</p>
                ) : (
                  <p className="text-red-600 font-bold mt-2">Email Failed!</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
