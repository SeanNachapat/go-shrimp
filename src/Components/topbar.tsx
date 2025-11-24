"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      <div className="w-screen flex flex-row items-center justify-between overflow-hidden p-5">
        <div className="text-sm rounded-2xl px-2 bg-white hidden md:flex">
          {formatDate(currentTime)} | {getTimezone()}, {formatTime(currentTime)}
        </div>

        <div className="hidden md:flex flex-row gap-5">
          <button className="">
            <span className="rounded-2xl px-2 py-1 bg-white text-sm">
              TH/EN
            </span>
          </button>
          <button className="flex items-center">
            <span className="material-symbols-outlined">wb_sunny</span>
            {/* <span className="material-symbols-outlined">moon_stars</span> */}
          </button>
          <button className="flex flex-row items-center">
            <img
              className="rounded-full size-9"
              src={user?.picture || "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1f990.svg"}
              alt="Profile"
            />
            <div className="flex items-center"></div>
          </button>
        </div>
      </div>
    </>
  );
}
