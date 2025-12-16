"use client";

import { DashboardGuard } from "./guard";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <div className="min-h-screen bg-background relative">
        {/* Static Grid Background - Fixed */}
        <div
          className="fixed inset-0 opacity-50 pointer-events-none z-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.02) 1px, transparent 1px), linear-gradient(to right, rgba(168, 85, 247, 0.02) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Sidebar - Floating */}
        <SidebarNav />

        {/* Main Content Area - Floating on grid */}
        <div className="lg:ml-72 relative z-10">
          {/* Page Content */}
          <main className="relative">
            <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DashboardGuard>
  );
}
