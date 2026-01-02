"use client";

import Topbar from "./topbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all z-20 flex items-center justify-center md:hidden"
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-20 z-10 transition-opacity md:hidden"
        />
      )}

      <aside
        className={`
            fixed top-0 left-0 h-full w-fit bg-white dark:bg-neutral-900 dark:border-r dark:border-neutral-800 shadow-xl z-20
            transition-transform duration-300 ease-in-out 
            md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-none md:z-auto
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
      >
        <div className="flex flex-col max-w-full items-baseline h-screen py-5 px-5 gap-7">
          
          <div className="flex flex-col w-full gap-2 text-base mt-2">
            <Link onClick={() => setIsSidebarOpen(false)} href="/" className="w-full">
              <div className={`rounded-xl px-5 py-3 flex items-center gap-3 transition-colors ${isActive("/") ? "bg-orange-50 text-orange-600 dark:bg-neutral-800 dark:text-orange-500 font-semibold" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}>
                <span className="material-symbols-outlined">
                  space_dashboard
                </span>
                <span>{t("dashboard")}</span>
              </div>
            </Link>

            <Link onClick={() => setIsSidebarOpen(false)} href="/analytics" className="w-full">
              <div className={`rounded-xl px-5 py-3 flex items-center gap-3 transition-colors ${isActive("/analytics") ? "bg-orange-50 text-orange-600 dark:bg-neutral-800 dark:text-orange-500 font-semibold" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}>
                <span className="material-symbols-outlined">
                  browse_activity
                </span>
                <span>{t("analytics")}</span>
              </div>
            </Link>

            <Link onClick={() => setIsSidebarOpen(false)} href="/history" className="w-full">
              <div className={`rounded-xl px-5 py-3 flex items-center gap-3 transition-colors ${isActive("/history") ? "bg-orange-50 text-orange-600 dark:bg-neutral-800 dark:text-orange-500 font-semibold" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}>
                <span className="material-symbols-outlined">history</span>
                <span>{t("history")}</span>
              </div>
            </Link>

            <Link onClick={() => setIsSidebarOpen(false)} href="/manage-farm" className="w-full">
              <div className={`rounded-xl px-5 py-3 flex items-center gap-3 transition-colors ${isActive("/manage-farm") ? "bg-orange-50 text-orange-600 dark:bg-neutral-800 dark:text-orange-500 font-semibold" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}>
                <span className="material-symbols-outlined">agriculture</span>
                <span>{t("farm")}</span>
              </div>
            </Link>

            <button onClick={logout} className="w-full text-red-600 mt-auto">
              <div className="rounded-xl px-5 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <span className="material-symbols-outlined">logout</span>
                <span>{t("logout")}</span>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
