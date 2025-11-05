import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Database - GoShrimp",
  description: "Database management for Thai Shrimp Farm",
};

export default function DatabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-semibold mb-6">Analytics Management</h1>
      {children}
    </div>
  );
}
