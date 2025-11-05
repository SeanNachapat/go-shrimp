"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Topbar from "./topbar";

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";

  const hideShellFor = ["/login"];
  const hideShell = hideShellFor.some((p) => pathname.startsWith(p));

  return (
    <div className="antialiased flex flex-row min-h-screen">
      {!hideShell && <Navbar />}

      <div className="flex-1 flex flex-col">
        {!hideShell && <Topbar />}
        {children}
      </div>
    </div>
  );
}
