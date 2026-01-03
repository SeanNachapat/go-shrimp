"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Database() {
  const { user } = useAuth();
  const [recentRecords, setRecentRecords] = useState<any[]>([]);
  
  const fetchRecentRecords = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/records`);
      if (res.ok) {
        const data = await res.json();
        setRecentRecords(data);
      }
    } catch (error) {
      console.error("Failed to fetch recent records:", error);
    }
  };

  useEffect(() => {
    fetchRecentRecords();
  }, []);

  return (
    <div className="p-3 md:p-5 relative min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full overflow-hidden">
      <div className="flex flex-col gap-3 max-w-full">
        <div className="flex justify-between items-center mb-2 px-1">
            <h1 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-white">History</h1>
            <span className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">All recorded data</span>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block rounded-2xl bg-white shadow-sm p-6 overflow-x-auto border border-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 w-full overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-neutral-500 dark:text-neutral-400 min-w-[800px]">
              <thead className="text-xs text-neutral-700 uppercase bg-neutral-50/50 dark:text-neutral-300 dark:bg-neutral-700">
                <tr>
                  <th scope="col" className="px-6 py-4 rounded-l-lg">Date</th>
                  <th scope="col" className="px-6 py-4">Time</th>
                  <th scope="col" className="px-6 py-4">Pond</th>
                  <th scope="col" className="px-6 py-4">Temp (°C)</th>
                  <th scope="col" className="px-6 py-4">Salinity (ppt)</th>
                  <th scope="col" className="px-6 py-4">pH</th>
                  <th scope="col" className="px-6 py-4">DO (mg/L)</th>
                  <th scope="col" className="px-6 py-4">Ca (mg/L)</th>
                  <th scope="col" className="px-6 py-4">Mg (mg/L)</th>
                  <th scope="col" className="px-6 py-4">Avg Weight (g)</th>
                  <th scope="col" className="px-6 py-4 rounded-r-lg">Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((record) => (
                  <tr key={record._id} className="bg-white border-b hover:bg-neutral-50 transition-colors dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{new Date(record.readingDatetime).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(record.readingDatetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td className="px-6 py-4">
                        <span className="bg-orange-50 text-orange-700 py-1 px-2 rounded-lg text-xs font-semibold whitespace-nowrap">
                          {record.pondId?.pondName || "Unknown"}
                        </span>
                    </td>
                    <td className="px-6 py-4">{record.waterQuality?.temperatureCelsius || "-"}</td>
                    <td className="px-6 py-4">{record.waterQuality?.salinityPpt || "-"}</td>
                    <td className="px-6 py-4">{record.waterQuality?.phLevel || "-"}</td>
                    <td className="px-6 py-4">{record.waterQuality?.dissolvedOxygenMgl || "-"}</td>
                    <td className="px-6 py-4">{record.waterQuality?.calciumMgl || "-"}</td>
                    <td className="px-6 py-4">{record.waterQuality?.magnesiumMgl || "-"}</td>
                    <td className="px-6 py-4">{record.healthObservation?.avgWeightG || "-"}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[150px]">
                           <div className="w-6 h-6 min-w-[1.5rem] rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-bold">
                                {(record.recordedBy?.username || record.recordedBy?.fullName || "U")[0].toUpperCase()}
                           </div>
                           <span className="truncate">{record.recordedBy?.username || record.recordedBy?.fullName || "Unknown"}</span>
                        </div>
                    </td>
                  </tr>
                ))}
                {recentRecords.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center text-gray-400 italic">
                      No history records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden flex flex-col gap-3">
             {recentRecords.map((record) => (
                 <div key={record._id} className="bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 flex flex-col gap-3">
                     <div className="flex justify-between items-start border-b border-neutral-50 dark:border-neutral-700 pb-3">
                        <div>
                             <div className="text-sm font-bold text-neutral-900 dark:text-white">
                                 {new Date(record.readingDatetime).toLocaleDateString()}
                             </div>
                             <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                 {new Date(record.readingDatetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </div>
                        </div>
                        <span className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 py-1 px-2.5 rounded-lg text-xs font-semibold">
                          {record.pondId?.pondName || "Unknown"}
                        </span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2">
                         <div className="bg-neutral-50 dark:bg-neutral-700/50 p-2 rounded-lg flex flex-col items-center">
                             <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">DO (mg/L)</span>
                             <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{record.waterQuality?.dissolvedOxygenMgl || "-"}</span>
                         </div>
                         <div className="bg-neutral-50 dark:bg-neutral-700/50 p-2 rounded-lg flex flex-col items-center">
                             <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">pH</span>
                             <span className="text-lg font-bold text-green-600 dark:text-green-400">{record.waterQuality?.phLevel || "-"}</span>
                         </div>
                         <div className="bg-neutral-50 dark:bg-neutral-700/50 p-2 rounded-lg flex flex-col items-center">
                             <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">Temp (°C)</span>
                             <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{record.waterQuality?.temperatureCelsius || "-"}</span>
                         </div>
                         <div className="bg-neutral-50 dark:bg-neutral-700/50 p-2 rounded-lg flex flex-col items-center">
                             <span className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">Salinity</span>
                             <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{record.waterQuality?.salinityPpt || "-"}</span>
                         </div>
                     </div>
                     
                     <div className="flex justify-between items-center pt-2 text-xs text-neutral-400">
                        <span>Recorded by:</span>
                        <div className="flex items-center gap-1.5 font-medium text-neutral-600 dark:text-neutral-300">
                             <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-600 flex items-center justify-center text-[10px] text-neutral-600 dark:text-neutral-200 font-bold">
                                {(record.recordedBy?.username || record.recordedBy?.fullName || "U")[0].toUpperCase()}
                           </div>
                           {record.recordedBy?.username || record.recordedBy?.fullName || "Unknown"}
                        </div>
                     </div>
                 </div>
             ))}
             {recentRecords.length === 0 && (
                <div className="text-center py-10 text-neutral-400 italic bg-white dark:bg-neutral-800 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
                    No history records found
                </div>
             )}
        </div>
      </div>
    </div>
  );
}
