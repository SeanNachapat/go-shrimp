"use client";

import shrimpImage from "../images/shrimp.png";
import Topbar from "./topbar";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all z-20 flex items-center justify-center"
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* Overlay - Only appears on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black opacity-50 z-10 transition-opacity"
        />
      )}

      {/* Sidebar - Hidden on mobile by default, always visible on desktop */}
      <aside
        className={`
            fixed top-0 left-0 h-full w-56 bg-white shadow-xl z-20
            transition-transform duration-300 ease-in-out
            md:translate-x-0 md:relative md:block
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
          `}
      >
        <div className="flex flex-col bg-white max-w-full items-center h-screen py-5 px-3 gap-7">
          <Link href="/" className="w-full flex justify-center">
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
            <Link href="/" className="w-fit flex justify-center">
              <div className="rounded-4xl hover:outline px-5 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined">
                  space_dashboard
                </span>
                <span>Dashboard</span>
              </div>
            </Link>

            <Link href="/analytics" className="w-fit flex justify-center">
              <div className="rounded-4xl hover:outline px-5 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined">
                  browse_activity
                </span>
                <span>Analytics</span>
              </div>
            </Link>

            <Link href="/database" className="w-fit flex justify-center">
              <div className="rounded-4xl hover:outline px-5 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined">database</span>
                <span>Database</span>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
