import { useState } from "react";

import "./Layout.css";

import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className={`erp-layout ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >

      <Sidebar />

      <Navbar
        onMenuClick={handleMenuClick}
      />

      <main className="erp-content">
        {children}
      </main>

    </div>
  );
}