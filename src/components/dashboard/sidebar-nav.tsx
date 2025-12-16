"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  Users,
  Settings,
  ShieldCheck,
  Plane,
  Banknote,
  Send,
  Wallet,
  Zap,
  BarChart3,
  FileText,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Accounts",
        href: "/dashboard/accounts",
        icon: Banknote,
      },
      {
        label: "Deposit",
        href: "/dashboard/deposit",
        icon: ArrowRightLeft,
      },
      {
        label: "Withdrawal",
        href: "/dashboard/withdrawal",
        icon: ArrowRightLeft,
      },
      {
        label: "Cards",
        href: "/dashboard/cards",
        icon: CreditCard,
      },
      {
        label: "Transfers",
        href: "/dashboard/transfers",
        icon: Send,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Transactions",
        href: "/dashboard/transactions",
        icon: ArrowRightLeft,
      },
      {
        label: "Flights",
        href: "/dashboard/flights",
        icon: Plane,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "Profile",
        href: "/dashboard/profile",
        icon: Users,
      },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-4 left-4 bottom-4 z-50 w-64 border border-border/50 bg-card/95 backdrop-blur-xl hidden lg:block overflow-hidden rounded-2xl shadow-2xl">
      {/* Subtle diagonal grid pattern for visual depth */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px), linear-gradient(to right, rgba(168, 85, 247, 0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          transform: 'rotate(-3deg) scale(1.2)'
        }}
      />
      <div className="flex h-full flex-col relative z-10">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border/50 px-6">
          <Link href="/dashboard" className="flex items-center">
            <div className="relative w-auto h-6">
              <Image
                src="/logo2.png"
                alt="InstantGlobal"
                width={90}
                height={24}
                className="h-full w-auto object-contain dark:invert"
              />
            </div>
          </Link>
        </div>

        {/* Navigation - with custom scrollbar */}
        <nav
          className="flex-1 px-3 py-6 space-y-6 overflow-y-auto overflow-x-hidden"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(168, 85, 247, 0.3) transparent'
          }}
        >
          {navSections.map((section, idx) => (
            <div key={section.title}>
              {/* Section Header */}
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>

              {/* Section Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                      )}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 rounded-lg bg-accent-500/10 border border-accent-500/20"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}

                      <Icon
                        className={cn(
                          "h-4.5 w-4.5 relative z-10 transition-colors",
                          isActive
                            ? "text-accent-600"
                            : "text-muted-foreground/60 group-hover:text-foreground"
                        )}
                      />
                      <span className="relative z-10 flex-1">{item.label}</span>

                      {item.badge && (
                        <span className="ml-auto relative z-10 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-accent-500/10 text-accent-600">
                          {item.badge}
                        </span>
                      )}

                      {/* Subtle hover indicator */}
                      {!isActive && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-accent-500/0 group-hover:bg-accent-500/50 rounded-r transition-colors" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer - User Profile */}
        <div className="border-t border-border/50 p-3 mt-auto">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center ring-2 ring-accent-500/20">
              <span className="text-white text-sm font-semibold">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-accent-600 transition-colors">
                Platform User
              </p>
              <p className="text-xs text-muted-foreground/70 truncate">
                Sandbox Mode
              </p>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground/50 group-hover:text-accent-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Custom scrollbar styles for webkit browsers */}
      <style jsx global>{`
        nav::-webkit-scrollbar {
          width: 6px;
        }
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        nav::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 3px;
        }
        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </aside>
  );
}

/**
 * Mobile sidebar with overlay
 */
export function MobileSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="fixed top-4 left-4 bottom-4 z-50 w-64 border border-border/50 bg-card/95 backdrop-blur-xl lg:hidden overflow-hidden rounded-2xl shadow-2xl"
      >
        {/* Subtle diagonal grid pattern for visual depth */}
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px), linear-gradient(to right, rgba(168, 85, 247, 0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            transform: 'rotate(-3deg) scale(1.2)'
          }}
        />
        <div className="flex h-full flex-col relative z-10">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border/50 px-6">
            <Link href="/dashboard" className="flex items-center">
              <div className="relative w-auto h-6">
                <Image
                  src="/logo2.png"
                  alt="InstantGlobal"
                  width={90}
                  height={24}
                  className="h-full w-auto object-contain dark:invert"
                />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-6">
            {navSections.map((section, idx) => (
              <div key={section.title}>
                {/* Section Header */}
                <div className="px-3 mb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>

                {/* Section Items */}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                        )}
                      >
                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="mobile-sidebar-active-pill"
                            className="absolute inset-0 rounded-lg bg-accent-500/10 border border-accent-500/20"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 35,
                            }}
                          />
                        )}

                        <Icon
                          className={cn(
                            "h-4.5 w-4.5 relative z-10 transition-colors",
                            isActive
                              ? "text-accent-600"
                              : "text-muted-foreground/60 group-hover:text-foreground"
                          )}
                        />
                        <span className="relative z-10 flex-1">{item.label}</span>

                        {item.badge && (
                          <span className="ml-auto relative z-10 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-accent-500/10 text-accent-600">
                            {item.badge}
                          </span>
                        )}

                        {/* Subtle hover indicator */}
                        {!isActive && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-accent-500/0 group-hover:bg-accent-500/50 rounded-r transition-colors" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer - User Profile */}
          <div className="border-t border-border/50 p-3 mt-auto">
            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/5 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center ring-2 ring-accent-500/20">
                <span className="text-white text-sm font-semibold">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-accent-600 transition-colors">
                  Platform User
                </p>
                <p className="text-xs text-muted-foreground/70 truncate">
                  Sandbox Mode
                </p>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground/50 group-hover:text-accent-600 transition-colors" />
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
