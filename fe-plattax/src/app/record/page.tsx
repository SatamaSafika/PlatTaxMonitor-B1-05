"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";

type Record = {
  plate: string;
  owner: string | null;
  taxdate: string | null;
  violation: string | null;
};

export default function RecordPage() {
  const { data: session, status } = useSession();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Don't redirect while checking session
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch("/api/records");
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error("Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow p-6 bg-gray-100">
        <div className="w-full flex flex-col items-center">
          {/* Container judul & icon */}
          <div className="flex items-center gap-4 mb-6 text-center">
            <Image
              src="/icons/record-icon.png"
              alt="Record Icon"
              width={130}
              height={130}
            />
            <span
              className="text-2xl font-bold text-white px-8 py-3 bg-cover bg-center ml-[-36px] mt-[30px] min-w-[200px]"
              style={{
                backgroundImage: "url('/icons/title-bg.png')",
                backgroundSize: "200% 70%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
                display: "inline-block",
                color: "#FFFFFF",
              }}
            >
              Record
            </span>
          </div>

          {/* Table Container */}
          <div className="w-full max-w-5xl bg-white shadow-md rounded-lg overflow-hidden">
            <div className="max-h-[calc(9*2.5rem)] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-4 space-x-2">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              ) : (
                <table className="w-full text-center border-collapse table-fixed">
                  <thead className="sticky top-0 bg-[#50B1EB] text-white">
                    <tr className="h-10">
                      <th className="p-2 w-[10%]">No</th>
                      <th className="p-2 w-[20%]">Plat Number</th>
                      <th className="p-2 w-[25%]">Owner Name</th>
                      <th className="p-2 w-[20%]">Tax Date</th>
                      <th className="p-2 w-[25%]">Violation Bill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length > 0 ? (
                      records.map((record, index) => (
                        <tr
                          key={index}
                          className={`hover:bg-gray-100 h-10 ${
                            index === records.length - 1 ? "" : "border-b"
                          }`}
                        >
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{record.plate}</td>
                          <td className="p-2">{record.owner ?? "-"}</td>
                          <td className="p-2">
                            {record.taxdate?.trim() &&
                            !isNaN(new Date(record.taxdate).getTime())
                              ? new Date(record.taxdate).toLocaleDateString(
                                  "id-ID",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "Data Tidak Tersedia"}
                          </td>
                          <td className="p-2">
                            {record.violation
                              ? `Rp ${parseFloat(
                                  record.violation
                                ).toLocaleString()}`
                              : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS untuk animasi titik bergelombang */}
      <style jsx>{`
        .dot {
          width: 10px;
          height: 10px;
          background-color: black;
          border-radius: 50%;
          animation: wave 1.2s infinite ease-in-out;
        }

        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes wave {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
