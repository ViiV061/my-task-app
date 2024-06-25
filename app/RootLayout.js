"use client";

import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        {!isHomePage && <Sidebar />}
        <main className={`flex-1 p-6 ${isHomePage ? "w-full" : ""}`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
