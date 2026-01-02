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
    <div className="gap-3 p-5 relative min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">History</h1>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">All recorded data</span>
        </div>

        <div className="rounded-2xl bg-white shadow-sm p-6 overflow-x-auto border border-neutral-100 dark:bg-neutral-800 dark:border-neutral-700">
          <table className="w-full text-sm text-left text-neutral-500 dark:text-neutral-400">
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
                      <span className="bg-orange-50 text-orange-700 py-1 px-2 rounded-lg text-xs font-semibold">
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
                  <td className="px-6 py-4 flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-bold">
                            {(record.recordedBy?.username || record.recordedBy?.fullName || "U")[0].toUpperCase()}
                       </div>
                       {record.recordedBy?.username || record.recordedBy?.fullName || "Unknown"}
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
    </div>
  );
}
