"use client";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="flex-1 p-6">
      <div className="text-2xl font-semibold mb-6">Hello, {user?.username || user?.fullName || "Farmer"}!</div>
      <div className="flex flex-row my-3 mx-6 gap-3">
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-white shadow-lg p-5 "></div>
          <div className="rounded-2xl bg-white shadow-lg p-5"></div>
        </div>
        <div className="rounded-2xl bg-white shadow-lg p-5">
          <span className="text-lg font-bold">🦐 ราคากุ้ง</span>
        </div>
      </div>
    </div>
  );
}
