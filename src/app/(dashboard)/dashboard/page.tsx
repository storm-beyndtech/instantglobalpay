"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import {
	AnalyticsKPIRow,
	AnalyticsChart,
	ResourceListCompact,
	ActivityFeed,
	BankingCard,
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

const defaultChartData: ChartData[] = [
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
	const [account, setAccount] = useState<{ balance?: number; number?: string; name?: string }>({});

	useEffect(() => {
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
		const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

		fetch("/api/transactions", headers ? { headers } : {})
			.then((res) => res.json())
			.then((res) => setTransactions(res?.transactions || res || []))
			.catch(() => setTransactions([]));
		fetch("/api/users", headers ? { headers } : {})
			.then((res) => res.json())
			.then((res) => setUsers(res?.users || res || []))
			.catch(() => setUsers([]));
		if (user?.id) {
			bankingApi
				.getAccount(user.id)
				.then((res) =>
					setAccount({
						number: res.accountNumber,
						balance: (res as any).balance ?? (res as any).availableBalance ?? 0,
						name: (res as any).name,
					}),
				)
				.catch(() => setAccount({ balance: 0 }));
		}
	}, [user?.id]);

	const primary = users[0] || { account: { balance: 0, number: "—" }, name: { first: "You", full: "You" } };

	const userTransactions = useMemo(
		() =>
			transactions.filter(
				(t) => t.user?.id === user?.id || t.userId === user?.id || t.user?._id === user?.id,
			),
		[transactions, user?.id],
	);

	const primaryBalance = (primary as any)?.account?.balance ?? 0;

	const availableBalance = useMemo(() => {
		if (account.balance !== undefined) return account.balance;
		const total = userTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
		return total || primaryBalance;
	}, [account.balance, primaryBalance, userTransactions]);

	const chartData: ChartData[] = useMemo(() => {
		const monthMap: Record<string, { volume: number; payouts: number }> = {};
		userTransactions.forEach((t) => {
			const created = t.createdAt ? new Date(t.createdAt) : new Date();
			const month = created.toLocaleString("en-US", { month: "short" });
			if (!monthMap[month]) monthMap[month] = { volume: 0, payouts: 0 };
			const amt = Number(t.amount || 0);
			if (amt >= 0) {
				monthMap[month].volume += amt;
			} else {
				monthMap[month].payouts += Math.abs(amt);
			}
		});
		const series = Object.entries(monthMap).map(([month, data]) => ({
			month,
			volume: data.volume,
			payouts: data.payouts,
		}));
		return series.length ? series : defaultChartData;
	}, [userTransactions]);

	const completedTransfers = userTransactions.filter((t) => t.status === "completed").length;
	const pendingTransfers = userTransactions.filter((t) => t.status === "pending").length;

	const kpis: KPIData[] = useMemo(
		() => [
			{
				label: "Available balance",
				value: `$${(availableBalance ?? primary?.account?.balance ?? 0).toLocaleString()}`,
				change: completedTransfers ? 2.4 : 0.4,
				trend: "up",
				description: "USD equivalent on hand",
				color: "accent",
			},
			{
				label: "Pending Transfers",
				value: `${pendingTransfers}`,
				change: pendingTransfers ? -2.1 : 0,
				trend: pendingTransfers ? "down" : "up",
				description: "Awaiting approval",
				color: "warning",
			},
			{
				label: "Completed Transfers",
				value: `${completedTransfers}`,
				change: completedTransfers ? 5.2 : 0.2,
				trend: "up",
				description: "Processed successfully",
				color: "success",
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
		[availableBalance, completedTransfers, pendingTransfers, users, primary],
	);

	const resources: ResourceItem[] = [
		{
			id: "internal-transfer",
			label: "Inter-bank Transfer",
			description: "Move funds between platform users instantly.",
			badge: { label: "Zero fee", variant: "success" },
			metadata: [{ label: "Latency", value: "<2s" }],
			onClick: () => (window.location.href = "/dashboard/transfers"),
		},
		{
			id: "external-wire",
			label: "External Transfer",
			description: "Wire out with premium fee routing.",
			badge: { label: "Fee", variant: "warning" },
			metadata: [{ label: "Fee", value: "2.5%" }],
			onClick: () => (window.location.href = "/dashboard/transfers"),
		},
		{
			id: "giftcards",
			label: "Gift Cards",
			description: "Generate branded, open-loop cards.",
			badge: { label: "New", variant: "accent" },
			metadata: [{ label: "Fee", value: "$2.99" }],
			onClick: () => (window.location.href = "/dashboard/cards/giftcards"),
		},
	];

	const typeLabels: Record<string, string> = {
		deposit: "Deposit",
		withdraw: "Withdrawal",
		internal_transfer: "Internal Transfer",
		external_transfer: "External Transfer",
	};

	const activity: ActivityItem[] = userTransactions.slice(0, 5).map((t, index) => ({
		id: t.id || `transaction-${index}`,
		type: "transaction",
		title: typeLabels[t.type] || t.type || "Transaction",
		details: `${t.currency} ${t.amount.toLocaleString()} - ${t.description || 'No description'}`,
		timestamp: new Date(t.createdAt).toLocaleDateString(),
		badge: { label: t.status, variant: t.status === "completed" ? "success" : "warning" },
	}));

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-1">
					<p className="text-sm text-muted-foreground">InstantGlobal - Unified Banking Operations</p>
					<h1 className="text-3xl font-semibold tracking-tight">
						Welcome back, {account.name?.split(" ")[0] ?? "Dear"}.
					</h1>
				</div>
				<div className="flex flex-wrap gap-3">
					<Button variant="outline" className="gap-2" asChild>
						<Link href="/dashboard/transfers">
							<Send className="h-4 w-4" />
							New transfer
						</Link>
					</Button>
					<Button className="gap-2" asChild>
						<Link href="/dashboard/cards">
							<Wallet className="h-4 w-4" />
							Issue card
						</Link>
					</Button>
				</div>
			</div>

			<AnalyticsKPIRow kpis={kpis} />

			<div className="grid gap-6 lg:grid-cols-4">
				<div className="order-1 lg:order-2 lg:col-span-2">
					<BankingCard
						name={account.name || primary?.name?.full || "Banking User"}
						maskedNumber={(account.number || primary?.account?.number || "0000").slice(-4)}
						balance={`$${(availableBalance ?? primary?.account?.balance ?? 0).toLocaleString()}`}
						expiry="08/27"
						status="Active"
						accent="violet"
						className="w-full lg:ml-auto"
					/>
					<div className="mt-4 hidden lg:block">
						<ActivityFeed activities={activity} />
					</div>
				</div>

				<div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
					<AnalyticsChart
						title="Processing Volume"
						description="Your card and treasury volume (USD equiv.)"
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
			</div>

			<div className="grid gap-6 lg:grid-cols-5">
				<Card variant="glass" padding="lg" hover="lift" className="lg:col-span-3">
					<CardHeader className="p-0 space-y-1">
						<CardTitle className="text-lg">Playbooks</CardTitle>
						<CardDescription>Prebuilt flows for operations</CardDescription>
					</CardHeader>
					<CardContent className="p-0 mt-6">
						<ResourceListCompact items={resources} showDividers />
					</CardContent>
				</Card>
				<div className="lg:col-span-2">
					<KPIDataTable className="bg-card/40" />
				</div>
			</div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Operational shortcuts</h2>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <ArrowUpRight className="h-4 w-4" />
            <span>Quick links</span>
          </div>
        </div>
        <Card variant="glass" padding="lg">
          <CardContent className="p-0">
            <div className="text-sm">
              <ResourceListCompact items={resources} showDividers />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
