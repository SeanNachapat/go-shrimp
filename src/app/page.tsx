"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [farmName, setFarmName] = useState("My Farm");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFarm = async () => {
      if (user?._id) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/farms`);
          if (res.ok) {
            const farms = await res.json();
            const userFarm = farms.find((f: any) => f.farmerId === user._id);
            if (userFarm) {
              setFarmName(userFarm.farmName);
            }
          }
        } catch (error) {
          console.error("Failed to fetch farm:", error);
        }
      }
    };
    fetchFarm();
  }, [user]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, 
    });
  };

  const getSeconds = (date: Date) => {
    return date.getSeconds().toString().padStart(2, '0');
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).toUpperCase(); 
  };

  return (
    <div className="flex-1 p-6 pb-24 md:pb-6 bg-neutral-50 min-h-screen dark:bg-neutral-900">
       <div className="flex justify-between items-end mb-6">
           <div>
               <h2 className="text-slate-400 font-bold text-xs tracking-wider uppercase mb-1">Welcome</h2>
               <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{farmName}</h1>
           </div>
           <div className="text-right">
                <div className="text-4xl font-bold text-slate-900 dark:text-white flex items-start justify-end leading-none">
                    {formatTime(currentTime)}
                    <span className="text-lg mt-1 ml-1 text-slate-400 font-medium">{getSeconds(currentTime)}</span>
                </div>
                <div className="text-xs font-bold text-orange-500 tracking-wider uppercase mt-1">
                    {formatDate(currentTime)}
                </div>
           </div>
       </div>

      <div className="flex flex-row my-3 mx-6 gap-3">
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-white shadow-lg p-5 dark:bg-neutral-800"></div>
          <div className="rounded-2xl bg-white shadow-lg p-5 dark:bg-neutral-800"></div>
        </div>
        <div className="rounded-2xl bg-white shadow-lg p-5 dark:bg-neutral-800 dark:text-white">
          <span className="text-lg font-bold">🦐 ราคากุ้ง</span>
        </div>
      </div>
    </div>
  );
}
