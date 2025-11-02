import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../Components/navbar";
import Topbar from "../Components/topbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoShrimp",
  description: "Dashboard for Thai Shrimp Farmer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`antialiased flex flex-row`}>
        <Navbar />
        <div className="flex flex-col">
          <Topbar />
          {children}
        </div>
      </body>
    </html>
  );
}
