"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RecordDataModal from "./RecordDataModal";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 px-2 py-2 pb-5 z-40 md:hidden flex justify-between items-end">
        
        <Link href="/" className="flex flex-col items-center gap-1 w-14">
          <span className={`material-symbols-outlined text-2xl ${isActive("/") ? "text-orange-600" : "text-neutral-300"}`}>
            grid_view
          </span>
          <span className={`text-[9px] font-bold ${isActive("/") ? "text-orange-600" : "text-neutral-300"}`}>
            HOME
          </span>
        </Link>

        <Link href="/manage-farm" className="flex flex-col items-center gap-1 w-14">
          <span className={`material-symbols-outlined text-2xl ${isActive("/manage-farm") ? "text-orange-600" : "text-neutral-300"}`}>
            agriculture
          </span>
          <span className={`text-[9px] font-bold ${isActive("/manage-farm") ? "text-orange-600" : "text-neutral-300"}`}>
            FARM
          </span>
        </Link>

        <div className="relative -top-5">
          <div className="absolute inset-0 bg-orange-100 rounded-full blur-md opacity-50"></div>
          <button 
            onClick={() => setIsRecordModalOpen(true)}
            className="relative bg-orange-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-orange-700 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>

        <Link href="/history" className="flex flex-col items-center gap-1 w-14">
          <span className={`material-symbols-outlined text-2xl ${isActive("/history") ? "text-orange-600" : "text-neutral-300"}`}>
            history
          </span>
          <span className={`text-[9px] font-bold ${isActive("/history") ? "text-orange-600" : "text-neutral-300"}`}>
            HISTORY
          </span>
        </Link>

        <Link href="/analytics" className="flex flex-col items-center gap-1 w-14">
          <span className={`material-symbols-outlined text-2xl ${isActive("/analytics") ? "text-orange-600" : "text-neutral-300"}`}>
            browse_activity
          </span>
          <span className={`text-[9px] font-bold ${isActive("/analytics") ? "text-orange-600" : "text-neutral-300"}`}>
            ANALYTICS
          </span>
        </Link>
      </div>

      <RecordDataModal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} />
    </>
  );
}
