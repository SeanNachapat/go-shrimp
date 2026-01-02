"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import shrimpImage from "../images/shrimp.png";
import RecordDataModal from "./RecordDataModal";

export default function Topbar() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [farmName, setFarmName] = useState("No Farm");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

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

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between p-5 relative bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 z-30">
        
        <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 object-contain"
              src={shrimpImage.src}
              alt="shrimp logo"
            />
            <div className="font-bold text-xl text-orange-600">
                Go-<span className="text-neutral-900 dark:text-white">Shrimp</span>
            </div>
        </div>

        <div className="flex flex-row gap-4 items-center">
            <button
                onClick={() => setIsRecordModalOpen(true)}
                className="hidden md:flex items-center gap-2 bg-white text-orange-600 border border-orange-200 shadow-sm px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors dark:bg-neutral-900 dark:text-white dark:border-neutral-800 dark:hover:bg-neutral-800"
            >
                <span className="material-symbols-outlined text-sm">add</span>
                <span className="text-xs font-semibold">{t("recordSale")}</span>
            </button>

          <div className="relative">
            <button 
              className="flex flex-row items-center"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img
                className="rounded-full size-10 border-2 border-white dark:border-transparent shadow-sm ring-2 ring-neutral-100 dark:ring-neutral-700"
                src={user?.picture || "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1f990.svg"}
                alt="Profile"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl py-5 px-6 z-50 border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col items-center gap-3 mb-5">
                  <div className="relative">
                       <img
                        className="rounded-full size-20 border-4 border-white dark:border-neutral-800 shadow-md"
                        src={user?.picture || "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1f990.svg"}
                        alt="Profile"
                      />
                      <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-neutral-800"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-bold text-neutral-900 dark:text-white text-lg">{user?.fullName || "Farmer"}</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">{user?.role || "Farmer"}</div>
                  </div>
                </div>
                
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-200">
                    <div className="p-2 bg-white dark:bg-neutral-700 rounded-full shadow-sm">
                        <span className="material-symbols-outlined text-orange-500">agriculture</span>
                    </div>
                    <div>
                        <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{t("currentFarm")}</div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">{farmName}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button 
                        onClick={toggleTheme}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl border border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-neutral-600 dark:text-neutral-300">
                            {theme === "light" ? "light_mode" : "dark_mode"}
                        </span>
                        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            {theme === "light" ? t("light") : t("dark")}
                        </span>
                    </button>
                    <button 
                        onClick={toggleLanguage}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl border border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                         <span className="material-symbols-outlined text-neutral-600 dark:text-neutral-300">translate</span>
                        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            {language === "en" ? "EN" : "TH"}
                        </span>
                    </button>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-700 pt-3">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    {t("logout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <RecordDataModal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} />
    </>
  );
}
