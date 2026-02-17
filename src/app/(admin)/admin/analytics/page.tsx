"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface AdminStats {
	users?: { total?: number; active?: number; pending?: number };
	transactions?: {
		deposits?: { total?: number; pending?: number };
		withdrawals?: { total?: number; pending?: number };
		investments?: { total?: number };
	};
	revenue?: { total?: number };
}

export default function AdminAnalyticsPage() {
	const [stats, setStats] = useState<AdminStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const run = async () => {
			try {
				const token = localStorage.getItem("token");
				const headers: Record<string, string> = {};
				if (token) headers.Authorization = `Bearer ${token}`;
				const res = await fetch("/api/users/admin/stats", { headers });
				const data = await res.json();
				setStats(data || {});
			} catch (err) {
				console.error("Failed to fetch analytics:", err);
			} finally {
				setLoading(false);
			}
		};
		run();
	}, []);

	if (loading) {
		return <div className="text-sm text-muted-foreground">Loading analytics...</div>;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
				<p className="text-sm text-muted-foreground mt-1">Operational and revenue overview</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card variant="glass" padding="lg">
					<p className="text-xs text-muted-foreground">Total Users</p>
					<p className="text-2xl font-semibold mt-1">{stats?.users?.total ?? 0}</p>
				</Card>
				<Card variant="glass" padding="lg">
					<p className="text-xs text-muted-foreground">Total Deposits</p>
					<p className="text-2xl font-semibold mt-1">{stats?.transactions?.deposits?.total ?? 0}</p>
				</Card>
				<Card variant="glass" padding="lg">
					<p className="text-xs text-muted-foreground">Total Withdrawals</p>
					<p className="text-2xl font-semibold mt-1">{stats?.transactions?.withdrawals?.total ?? 0}</p>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card variant="glass" padding="lg">
					<p className="text-xs text-muted-foreground">Pending Deposits</p>
					<p className="text-xl font-semibold mt-1">{stats?.transactions?.deposits?.pending ?? 0}</p>
				</Card>
				<Card variant="glass" padding="lg">
					<p className="text-xs text-muted-foreground">Pending Withdrawals</p>
					<p className="text-xl font-semibold mt-1">{stats?.transactions?.withdrawals?.pending ?? 0}</p>
				</Card>
				<Card variant="glass" padding="lg">
					<p className="text-xs text-muted-foreground">Revenue</p>
					<p className="text-xl font-semibold mt-1">${Number(stats?.revenue?.total ?? 0).toLocaleString()}</p>
				</Card>
			</div>
		</div>
	);
}

