'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar'; // Import the Sidebar component

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

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-grow p-6 bg-gray-100 ${isOpen ? 'ml-64' : 'ml-20'}`}
      >
        <div className="w-full flex flex-col items-center">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 text-center">
            <Image src="/icons/record-icon.png" alt="Record Icon" width={130} height={130} />
            <span
              className="text-2xl font-bold text-white px-8 py-3 bg-cover bg-center ml-[-36px] mt-[30px] min-w-[200px]"
              style={{
                backgroundImage: "url('/icons/title-bg.png')",
                backgroundSize: '200% 70%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                display: 'inline-block',
                color: '#FFFFFF',
              }}
            >
              Record
            </span>
          </div>

          {/* Table Container */}
          <div className="w-full max-w-5xl bg-white shadow-md rounded-lg overflow-hidden">
            <div className="max-h-[calc(9*2.5rem)] overflow-y-auto">
              <table className="w-full text-center border-collapse">
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
    </div>
  );
}
