import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - GoShrimp",
  description: "Login for Thai Shrimp Farm",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
