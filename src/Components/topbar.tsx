"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [farmName, setFarmName] = useState("No Farm");

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
          const res = await fetch("http://localhost:4000/api/farms");
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

  const formatTime = (date: any) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: any) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between p-5 relative">
        <div className="text-sm rounded-2xl px-2 bg-white hidden md:flex">
          {formatDate(currentTime)} | {getTimezone()}, {formatTime(currentTime)}
        </div>

        <div className="hidden md:flex flex-row gap-5 items-center">
          <button className="">
            <span className="rounded-2xl px-2 py-1 bg-white text-sm">
              TH/EN
            </span>
          </button>
          <button className="flex items-center">
            <span className="material-symbols-outlined">wb_sunny</span>
          </button>
          <div className="relative">
            <button 
              className="flex flex-row items-center"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img
                className="rounded-full size-9 border-2 border-white shadow-sm"
                src={user?.picture || "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1f990.svg"}
                alt="Profile"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-4 px-5 z-50 border border-gray-100">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <img
                    className="rounded-full size-16 border-4 border-blue-50"
                    src={user?.picture || "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1f990.svg"}
                    alt="Profile"
                  />
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-lg">{user?.fullName || "Farmer"}</div>
                    <div className="text-sm text-gray-500 capitalize">{user?.role || "Farmer"}</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-3 mb-3">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <span className="material-symbols-outlined text-gray-400">agriculture</span>
                    <span className="text-sm font-medium">Farm:</span>
                    <span className="text-sm text-blue-600 font-semibold">{farmName}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
