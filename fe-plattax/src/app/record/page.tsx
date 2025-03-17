'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function RecordPage() {
  const [records, setRecords] = useState([
    { id: 1, plate: 'XYZ789', owner: 'Jane Smith', taxDate: 'Some Info', violation: 'Details' },
    { id: 2, plate: 'ABC123', owner: 'John Doe', taxDate: 'Some Info', violation: 'Details' },
    { id: 3, plate: 'LMN456', owner: 'Alice Brown', taxDate: 'Some Info', violation: 'Details' },
    { id: 4, plate: 'DEF456', owner: 'Michael White', taxDate: 'Some Info', violation: 'Details' },
    { id: 5, plate: 'GHI789', owner: 'Emily Johnson', taxDate: 'Some Info', violation: 'Details' },
    { id: 6, plate: 'JKL123', owner: 'David Williams', taxDate: 'Some Info', violation: 'Details' },
    { id: 7, plate: 'MNO456', owner: 'Sarah Brown', taxDate: 'Some Info', violation: 'Details' },
    { id: 8, plate: 'PQR789', owner: 'Daniel Garcia', taxDate: 'Some Info', violation: 'Details' },
    { id: 9, plate: 'STU123', owner: 'Laura Martinez', taxDate: 'Some Info', violation: 'Details' }, // Untuk trigger scroll
  ]);

  useEffect(() => {
    // Simulasi fetch data dari NeonDB (nantinya akan diaktifkan)
  }, []);

  return (
    <div className="flex min-h-screen p-6 bg-gray-100">
      {/* Sidebar akan berada di kiri, tabel bergeser ke kanan */}
      <div className="w-1/4"></div> {/* Placeholder untuk sidebar */}
      
      <div className="w-3/4 flex flex-col items-center">  
        {/* Container judul & icon */}
        <div className="flex items-center gap-4 mb-6 text-center">
          {/* Icon tetap sendiri */}
          <Image src="/icons/record-icon.png" alt="Record Icon" width={130} height={130} />
          
          {/* Teks "Record" dengan background image */}
          <span className="text-2xl font-bold text-white px-8 py-3 bg-cover bg-center ml-[-36px] mt-[30px] min-w-[200px]"
                style={{ 
                  backgroundImage: "url('/icons/title-bg.png')",
                  backgroundSize: "200% 70%", // Perbesar background
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left center", // Pastikan posisi sesuai
                  display: "inline-block",
                  color: "#FFFFFF" // Warna teks putih
                }}>
            Record
          </span>
        </div>

        {/* Container tabel dengan scroll */}
        <div className="w-4/5 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="max-h-[calc(9*2.5rem)] overflow-y-auto">
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
                {records.map((record, index) => (
                  <tr key={record.id} className="border-b hover:bg-gray-100 h-10">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{record.plate}</td>
                    <td className="p-2">{record.owner}</td>
                    <td className="p-2">{record.taxDate}</td>
                    <td className="p-2">{record.violation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
