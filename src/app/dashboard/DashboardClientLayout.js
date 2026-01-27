"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardClientLayout({ children }) {
  const pathname = usePathname();
  
  // Check if we are on the patient profile page: /dashboard/users/[id]
  // We want to hide the sidebar and header for a full-page view on this specifically
  const isProfilePage = pathname.includes("/dashboard/users/") && pathname !== "/dashboard/users";

  if (isProfilePage) {
    return (
      <div className="min-h-screen bg-muted flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
