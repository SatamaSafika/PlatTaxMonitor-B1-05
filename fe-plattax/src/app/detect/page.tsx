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
  const detectedPlatesRef = useRef<Set<string>>(new Set());

  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>(
    []
  );
  const [emailStatuses, setEmailStatuses] = useState<boolean[]>([]);
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

      if (!video || !canvas) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

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
          const allResults: DetectionResult[] = data.results || [];

          // Filter hasil yang valid dan belum pernah terdeteksi
          const newResults = allResults.filter((result) => {
            const normalizedPlate = result.plat_nomor.trim().toUpperCase();
            return (
              normalizedPlate &&
              normalizedPlate !== "TIDAK DITEMUKAN" &&
              !detectedPlatesRef.current.has(normalizedPlate)
            );
          });

          // Kalau tidak ada hasil baru, langsung keluar
          if (newResults.length === 0) return;

          // Tambahkan plat baru ke Set
          newResults.forEach((r) =>
            detectedPlatesRef.current.add(r.plat_nomor.trim().toUpperCase())
          );

          // Update hasil deteksi di frontend
          setDetectionResults((prev) => [...prev, ...newResults]);

          // Kirim email untuk hasil baru
          const emailStatuses = await Promise.all(
            newResults.map(async (result: DetectionResult) => {
              try {
                const emailResponse = await fetch("/api/sendEmail", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    to: "neabarbara2@gmail.com",
                    subject: "Tagihan Pajak Kendaraan Anda",
                    message: `
                        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                          <div style="background-color: #004aad; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0;">Informasi Tagihan Pajak Kendaraan Anda - Plattax Monitor</h1>
                          </div>

                          <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px;">
                            <p>Halo <strong>${result.nama_pemilik}</strong>,</p>
                            <p>Kendaraan Anda dengan plat <strong>${result.plat_nomor}</strong> telah terdeteksi oleh sistem Plattax Monitor.</p>
                            <p>Detail informasi kendaraan Anda:</p>
                            <ul style="line-height: 1.6;">
                              <li><strong>Nama Pemilik:</strong> ${result.nama_pemilik}</li>
                              <li><strong>Plat Nomor:</strong> ${result.plat_nomor}</li>
                              <li><strong>Tanggal Pajak Terakhir:</strong> ${result.tax_date}</li>
                              <li><strong>Harga Pajak Tahunan:</strong> <span style="color:#007b00;"><strong>Rp ${Number(result.harga_pajak).toLocaleString('id-ID')}</strong></span></li>
                              <li><strong>Total Tagihan Tertunggak:</strong> <span style="color:#d60000;"><strong>Rp ${Number(result.nilai_tagihan).toLocaleString('id-ID')}</strong></span></li>
                            </ul>
                            <p>Segera lakukan pembayaran sebelum dikenakan denda tambahan atau sanksi lainnya.</p>
                            <p>Terima kasih telah menggunakan layanan <strong>Plattax Monitor</strong>.</p>
                            <p>Hormat kami,<br>Tim Plattax</p>
                          </div>

                          <div style="text-align: center; margin-top: 30px;">
                          <p style="font-size: 12px; color: #888;">Email ini dikirim secara otomatis oleh sistem Plattax Monitor.</p>
                          </div>
                        </div>
                      `,
                  }),
                });
                return emailResponse.ok;
              } catch (error) {
                console.error("Error sending email:", error);
                return false;
              }
            })
          );

          setEmailStatuses((prev) => [...prev, ...emailStatuses]);
        } catch (err) {
          console.error("Deteksi gagal:", err);
        }
      }, "image/jpeg");
    };

    const interval = setInterval(() => {
      handleCapture();
    }, 3000);

    return () => clearInterval(interval);
  }, [session, status, router]);

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
