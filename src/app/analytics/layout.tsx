import type { Metadata } from "next";

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
      {children}
    </div>
  );
}
