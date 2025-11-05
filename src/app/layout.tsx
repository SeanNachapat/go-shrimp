import type { Metadata } from "next";
import RootShell from "@/Components/RootShell";
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
      <body>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
