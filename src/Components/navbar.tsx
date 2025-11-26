"use client";

import shrimpImage from "../images/shrimp.png";
import Topbar from "./topbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all z-20 flex items-center justify-center"
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-20 z-10 transition-opacity"
        />
      )}

      <aside
        className={`
            fixed top-0 left-0 h-full w-50 bg-white shadow-xl z-20
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
      >
        <div className="flex flex-col bg-white max-w-full items-baseline h-screen py-5 px-5 gap-7">
          <Link href="/" className="w-full flex ">
            <div className="flex flex-row gap-2 items-center">
              <img
                className="size-14"
                src={shrimpImage.src}
                alt="shrimp logo"
              />
              <div className="font-bold text-left leading-none text-xl">
                <div>Go</div>
                <div>Shrimp</div>
              </div>
            </div>
          </Link>
          <div className="flex flex-col items-center gap-5 text-base">
            <Link onClick={() => setIsSidebarOpen(false)} href="/" className="w-fit flex justify-center">
              <div className="rounded-4xl hover:outline px-5 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined">
                  space_dashboard
                </span>
                <span>Dashboard</span>
              </div>
            </Link>

            <Link onClick={() => setIsSidebarOpen(false)} href="/analytics" className="w-fit flex justify-center">
              <div className="rounded-4xl hover:outline px-5 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined">
                  browse_activity
                </span>
                <span>Analytics</span>
              </div>
            </Link>

            <Link onClick={() => setIsSidebarOpen(false)} href="/database" className="w-fit flex justify-center">
              <div className="rounded-4xl hover:outline px-5 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined">database</span>
                <span>Database</span>
              </div>
            </Link>

            <Link onClick={() => setIsSidebarOpen(false)} href="/manage-farm" className="w-fit flex justify-center">
              <div className="rounded-4xl hover:outline px-5 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined">agriculture</span>
                <span>Farm</span>
              </div>
            </Link>

            <button onClick={logout} className="w-fit flex justify-center text-red-600">
              <div className="rounded-4xl hover:outline px-5 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined">logout</span>
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
