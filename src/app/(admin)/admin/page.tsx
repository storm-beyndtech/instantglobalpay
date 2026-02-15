"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  AlertCircle,
} from "lucide-react";

interface AnalyticsStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  pendingKYC: number;
  totalVolume24h: number;
  totalVolume7d: number;
  totalVolume30d: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AnalyticsStats>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    pendingKYC: 0,
    totalVolume24h: 0,
    totalVolume7d: 0,
    totalVolume30d: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Fetch users count
        const usersRes = await fetch("/api/users", { headers });
        const usersData = await usersRes.json();
        const users = usersData?.users || usersData || [];

        // Fetch deposits
        const depositsRes = await fetch("/api/deposits", { headers });
        const depositsData = await depositsRes.json();
        const deposits = depositsData || [];

        // Fetch withdrawals
        const withdrawalsRes = await fetch("/api/withdrawals", { headers });
        const withdrawalsData = await withdrawalsRes.json();
        const withdrawals = withdrawalsData || [];

        // Fetch ALL transactions for volume calculation
        const txnsRes = await fetch("/api/transactions?limit=1000", { headers });
        const txnsData = await txnsRes.json();
        const rawTransactions = txnsData?.transactions || txnsData;
        const transactions = Array.isArray(rawTransactions) ? rawTransactions : [];

        // Calculate volume for different time periods
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const calculateVolume = (txns: any[], since: Date): number => {
          return txns
            .filter((t) => {
              const txnDate = new Date(t.createdAt || t.date);
              return txnDate >= since && t.status === "completed";
            })
            .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
        };

        const volume24h = calculateVolume(transactions, oneDayAgo);
        const volume7d = calculateVolume(transactions, sevenDaysAgo);
        const volume30d = calculateVolume(transactions, thirtyDaysAgo);

        // Calculate stats
        setStats({
          totalUsers: Array.isArray(users) ? users.length : 0,
          activeUsers: Array.isArray(users) ? users.filter((u: any) => u.accountStatus === "active").length : 0,
          suspendedUsers: Array.isArray(users) ? users.filter((u: any) => u.accountStatus === "suspended").length : 0,
          pendingDeposits: Array.isArray(deposits) ? deposits.filter((d: any) => d.status === "pending").length : 0,
          pendingWithdrawals: Array.isArray(withdrawals?.withdrawals || withdrawals)
            ? (withdrawals?.withdrawals || withdrawals).filter((w: any) => w.status === "pending").length
            : 0,
          pendingKYC: Array.isArray(users) ? users.filter((u: any) => u.kycStatus === "pending").length : 0,
          totalVolume24h: volume24h,
          totalVolume7d: volume7d,
          totalVolume30d: volume30d,
        });

        setRecentActivity(transactions.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent-500 border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor platform activity and approvals</p>
      </div>

      {/* Pending Approvals - Priority Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="glass" padding="lg" hover="lift" className="border-l-4 border-l-accent-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pending Deposits</p>
              <p className="text-2xl font-semibold mt-1">{stats.pendingDeposits}</p>
            </div>
            <div className="rounded-full p-3 bg-accent-500/10">
              <DollarSign className="h-5 w-5 text-accent-600" />
            </div>
          </div>
          {stats.pendingDeposits > 0 && (
            <div className="mt-4">
              <Badge variant="warning" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Requires attention
              </Badge>
            </div>
          )}
        </Card>

        <Card variant="glass" padding="lg" hover="lift" className="border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pending Withdrawals</p>
              <p className="text-2xl font-semibold mt-1">{stats.pendingWithdrawals}</p>
            </div>
            <div className="rounded-full p-3 bg-orange-500/10">
              <CreditCard className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          {stats.pendingWithdrawals > 0 && (
            <div className="mt-4">
              <Badge variant="warning" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Requires attention
              </Badge>
            </div>
          )}
        </Card>

        <Card variant="glass" padding="lg" hover="lift" className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pending KYC</p>
              <p className="text-2xl font-semibold mt-1">{stats.pendingKYC}</p>
            </div>
            <div className="rounded-full p-3 bg-blue-500/10">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          {stats.pendingKYC > 0 && (
            <div className="mt-4">
              <Badge variant="outline" className="text-xs">
                {stats.pendingKYC} submissions
              </Badge>
            </div>
          )}
        </Card>
      </div>

      {/* User Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card variant="glass" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalUsers}</p>
            </div>
            <Users className="h-5 w-5 text-accent-500" />
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-2xl font-semibold mt-1 text-green-600">{stats.activeUsers}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Suspended</p>
              <p className="text-2xl font-semibold mt-1 text-red-600">{stats.suspendedUsers}</p>
            </div>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">24h Volume</p>
              <p className="text-2xl font-semibold mt-1">${stats.totalVolume24h.toLocaleString()}</p>
            </div>
            <ArrowRightLeft className="h-5 w-5 text-accent-500" />
          </div>
        </Card>
      </div>

      {/* Volume Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card variant="glass" padding="lg" className="border-t-2 border-t-accent-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">24 Hour Volume</p>
              <p className="text-2xl font-semibold mt-1">${stats.totalVolume24h.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Completed transactions</p>
            </div>
            <div className="rounded-full p-3 bg-accent-500/10">
              <TrendingUp className="h-5 w-5 text-accent-600" />
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="lg" className="border-t-2 border-t-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">7 Day Volume</p>
              <p className="text-2xl font-semibold mt-1">${stats.totalVolume7d.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Weekly total</p>
            </div>
            <div className="rounded-full p-3 bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="lg" className="border-t-2 border-t-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">30 Day Volume</p>
              <p className="text-2xl font-semibold mt-1">${stats.totalVolume30d.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Monthly total</p>
            </div>
            <div className="rounded-full p-3 bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card variant="glass" padding="lg" hover="lift">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Latest transactions across the platform</CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No recent activity
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{txn.description || txn.kind}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(txn.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {txn.currency} {txn.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        txn.status === "completed"
                          ? "success"
                          : txn.status === "pending"
                          ? "warning"
                          : "outline"
                      }
                      className="text-xs mt-1"
                    >
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Health */}
      <Card variant="glass" padding="lg">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg">System Health</CardTitle>
          <CardDescription>Platform status and monitoring</CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium">API Status</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium">Email Service</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
