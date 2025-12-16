"use client";

import { useMemo, useEffect, useState } from "react";
import {
  AnalyticsKPIRow,
  AnalyticsChart,
  ResourceList,
  ActivityFeed,
  TotalVisitorsCard,
  LastQuarterVisitorsCard,
  BankingCard,
  StatGrid,
  KPIDataTable,
  type KPIData,
  type ChartData,
  type ResourceItem,
  type ActivityItem,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, Send, ArrowUpRight, ArrowDownRight, ShieldCheck, Plane } from "lucide-react";
import { bankingApi } from "@/lib/banking/api";
import { useAuth } from "@/components/providers/auth-provider";

const chartData: ChartData[] = [
  { month: "Jan", volume: 420, payouts: 180 },
  { month: "Feb", volume: 560, payouts: 220 },
  { month: "Mar", volume: 680, payouts: 245 },
  { month: "Apr", volume: 720, payouts: 260 },
  { month: "May", volume: 800, payouts: 320 },
  { month: "Jun", volume: 960, payouts: 380 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [account, setAccount] = useState<{ balance?: number; number?: string }>({});

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    fetch("/api/transactions", headers ? { headers } : {})
      .then((res) => res.json())
      .then(setTransactions)
      .catch(() => setTransactions([]));
    fetch("/api/users", headers ? { headers } : {})
      .then((res) => res.json())
      .then((res) => setUsers(res?.users || res || []))
      .catch(() => setUsers([]));
    if (user?.id) {
      bankingApi
        .getAccount(user.id)
        .then((res) => setAccount({ number: res.accountNumber, balance: 0 }))
        .catch(() => setAccount({ balance: 0 }));
    }
  }, [user?.id]);

  const primary = users[0] || { account: { balance: 0, number: "—" }, name: { first: "You", full: "You" } };

  const kpis: KPIData[] = useMemo(
    () => [
      {
        label: "Ledger Balance",
        value: `$${(account.balance ?? primary?.account?.balance ?? 0).toLocaleString()}`,
        change: 4.6,
        trend: "up",
        description: "USD equivalent",
        color: "accent",
      },
      {
        label: "Pending Transfers",
        value: `${transactions.filter((t) => t.status === "pending").length}`,
        change: -2.1,
        trend: "down",
        description: "Awaiting approval",
        color: "warning",
      },
      {
        label: "Verified Users",
        value: `${users.filter((u) => u.kyc?.status === "verified").length}`,
        change: 3.2,
        trend: "up",
        description: "KYC level 2",
        color: "primary",
      },
      {
        label: "Active Wallets",
        value: `${users.reduce((acc, u) => acc + (u.wallets?.length ?? 0), 0)}`,
        change: 1.4,
        trend: "up",
        description: "Multi-chain",
        color: "success",
      },
    ],
    [primary, transactions, users],
  );

  const resources: ResourceItem[] = [
    {
      id: "internal-transfer",
      label: "Inter-bank Transfer",
      description: "Move funds between platform users instantly.",
      badge: { label: "Zero fee", variant: "success" },
      metadata: [
        { label: "Latency", value: "<2s" },
        { label: "Status", value: "Healthy" },
      ],
      onClick: () => (window.location.href = "/dashboard/transfers"),
    },
    {
      id: "external-wire",
      label: "External Transfer",
      description: "Wire out with premium fee routing.",
      badge: { label: "Fee", variant: "warning" },
      metadata: [
        { label: "Fee", value: "2.5%" },
        { label: "Corridors", value: "Global" },
      ],
      onClick: () => (window.location.href = "/dashboard/transfers"),
    },
    {
      id: "giftcards",
      label: "Gift Cards",
      description: "Generate branded and open-loop cards.",
      badge: { label: "New", variant: "accent" },
      metadata: [
        { label: "SKUs", value: "15+" },
        { label: "Fee", value: "$2.99" },
      ],
      onClick: () => (window.location.href = "/dashboard/cards"),
    },
  ];

  const activity: ActivityItem[] = transactions.slice(0, 5).map((t) => ({
    id: t.id,
    type: "transaction",
    title: t.kind === "internal_transfer" ? "Internal transfer" : "External transfer",
    details: `${t.currency} ${t.amount.toLocaleString()} • ${t.description}`,
    timestamp: new Date(t.createdAt).toLocaleDateString(),
    badge: { label: t.status, variant: t.status === "completed" ? "success" : "warning" },
  }));

  return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">InstantGlobal OS • Unified money operations</p>
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {primary?.name?.first ?? "operator"}.</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2" asChild>
              <a href="/dashboard/transfers">
                <Send className="h-4 w-4" />
                New transfer
              </a>
            </Button>
            <Button className="gap-2" asChild>
              <a href="/dashboard/cards">
                <Wallet className="h-4 w-4" />
                Issue card
              </a>
            </Button>
          </div>
        </div>

        <AnalyticsKPIRow kpis={kpis} />

        <div className="grid gap-6 lg:grid-cols-4">
          <TotalVisitorsCard total={12450} className="lg:col-span-2" />
          <LastQuarterVisitorsCard total={65800} className="lg:col-span-2" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnalyticsChart
              title="Processing Volume"
              description="Card + treasury volume (USD equiv.)"
              type="area"
              data={chartData}
              xKey="month"
              yKeys={[
                { key: "volume", label: "Card Volume", color: "#a855f7" },
                { key: "payouts", label: "Payouts", color: "#22c55e" },
              ]}
              height={320}
            />
          </div>
          <div className="grid gap-4">
            <BankingCard
              name={primary?.name?.full ?? "Banking User"}
              maskedNumber={(account.number || primary?.account?.number || "0000").slice(-4)}
              balance={`$${(account.balance ?? primary?.account?.balance ?? 0).toLocaleString()}`}
              expiry="08/27"
              status="Active"
              accent="violet"
            />
            <KPIDataTable className="bg-card/40" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card variant="glass" padding="lg" hover="lift" className="lg:col-span-2">
            <CardHeader className="p-0 space-y-1">
              <CardTitle className="text-lg">Playbooks</CardTitle>
              <CardDescription>Prebuilt flows for operations</CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-6">
              <ResourceList items={resources} />
            </CardContent>
          </Card>
          <ActivityFeed activities={activity} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Operational shortcuts</h2>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <ArrowUpRight className="h-4 w-4" />
              <span>Quick links</span>
            </div>
          </div>
          <StatGrid
            items={[
              { icon: ShieldCheck, label: "KYC pending", value: "—" },
              { icon: ArrowUpRight, label: "External fees", value: `${process.env.NEXT_PUBLIC_EXTERNAL_TRANSFER_FEE_PERCENT || 2.5}%`, description: "Adjust in Admin" },
              { icon: ArrowDownRight, label: "Gift card fee", value: `$${process.env.NEXT_PUBLIC_GIFT_CARD_FEE || 4.5}` },
              { icon: Plane, label: "Flight vendors", value: "2" },
            ]}
          />
        </div>
      </div>
  );
}
