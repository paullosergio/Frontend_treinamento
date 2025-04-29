"use client";

import "./globals.css";
import Sidebar from "../components/Sidebar";
import { useState } from "react";


const metadata = {
  title: "Treinamento AutoPromotora",
  description: "Treinamento AutoPromotora",
};

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="pt-BR">
      <body>
        <div className="flex">
          <Sidebar onToggle={setIsSidebarOpen} />
          <main
            className={`flex-1 transition-all duration-300 p-8 min-h-screen bg-white ${
              isSidebarOpen ? "ml-64" : "ml-16"
            }`}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
