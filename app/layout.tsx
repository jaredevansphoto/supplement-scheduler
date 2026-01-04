import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Supplement Tracker",
  description: "Personal supplement management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <TopNav />
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
