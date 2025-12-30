"use client";

import { DashboardGuard } from "./guard";
import { SidebarNav, SidebarAvatar } from "@/components/dashboard/sidebar-nav";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const displayName = user?.name?.first || user?.name?.full || user?.email?.split("@")[0] || "User";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <DashboardGuard>
      <div className="min-h-screen bg-background relative">
        {/* Static Grid Background - Fixed */}
        <div
          className="fixed inset-0 opacity-50 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168, 85, 247, 0.02) 1px, transparent 1px), linear-gradient(to right, rgba(168, 85, 247, 0.02) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Sidebar - Floating */}
        <SidebarNav />

        {/* Main Content Area - Floating on grid */}
        <div className="lg:ml-72 relative z-10">
          {/* Page Content */}
          <main className="relative">
            <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-4 lg:py-6">
              <div className="max-w-6xl mx-auto space-y-6">
                <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 border-b-border/70 bg-card/70 px-4 py-3 shadow-sm backdrop-blur">
                  <Input
                    placeholder="Search dashboards, cards, transfers..."
                    className="w-full sm:max-w-sm bg-background/60"
                  />
                  <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    <div className="relative">
                      <button
                        className="focus:outline-none"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Open user menu"
                      >
                        <SidebarAvatar />
                      </button>
                      {menuOpen && (
                        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-card shadow-md">
                          <Link
                            href="/dashboard/profile"
                            className="block px-3 py-2 text-sm hover:bg-accent/10"
                            onClick={() => setMenuOpen(false)}
                          >
                            Profile & Settings
                          </Link>
                          <Link
                            href="/dashboard"
                            className="block px-3 py-2 text-sm hover:bg-accent/10"
                            onClick={() => setMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent/10"
                            onClick={() => {
                              setMenuOpen(false);
                              if (typeof window !== "undefined") {
                                localStorage.removeItem("token");
                                window.location.href = "/login";
                              }
                            }}
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </header>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </DashboardGuard>
  );
}
