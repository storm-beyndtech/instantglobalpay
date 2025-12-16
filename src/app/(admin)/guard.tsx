"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // No user -> redirect to login
      if (!user) {
        router.push("/login");
        return;
      }

      // User exists but not admin -> redirect to user dashboard
      if (!user.isAdmin && user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
    }
  }, [user, loading, router]);

  // Show nothing while checking auth
  if (loading || !user || (!user.isAdmin && user.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent-500 border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
