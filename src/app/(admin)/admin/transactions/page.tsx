"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Txn {
	_id: string;
	type: string;
	status: string;
	currency?: string;
	amount: number;
	date?: string;
	createdAt?: string;
	user?: { email?: string; name?: string };
}

export default function AdminTransactionsPage() {
	const [transactions, setTransactions] = useState<Txn[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const token = localStorage.getItem("token");
				const headers: Record<string, string> = {};
				if (token) headers.Authorization = `Bearer ${token}`;
				const response = await fetch("/api/transactions", { headers });
				const data = await response.json();
				setTransactions(Array.isArray(data) ? data : data?.transactions || []);
			} catch (error) {
				console.error("Failed to fetch transactions:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchTransactions();
	}, []);

	if (loading) {
		return <div className="text-sm text-muted-foreground">Loading transactions...</div>;
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">Transactions</h1>
				<p className="text-sm text-muted-foreground mt-1">Platform-wide transaction feed</p>
			</div>

			<Card variant="glass" padding="lg" hover="lift">
				<CardHeader className="p-0 space-y-2">
					<CardTitle className="text-lg">Recent Transactions</CardTitle>
					<CardDescription>{transactions.length} records</CardDescription>
				</CardHeader>
				<CardContent className="p-0 mt-6">
					{transactions.length === 0 ? (
						<div className="text-center py-10 text-sm text-muted-foreground">No transactions found</div>
					) : (
						<div className="space-y-3">
							{transactions.slice(0, 200).map((txn) => (
								<div key={txn._id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
									<div>
										<p className="text-sm font-medium">{txn.type}</p>
										<p className="text-xs text-muted-foreground mt-1">
											{txn.user?.email || "Unknown user"} - {new Date(txn.createdAt || txn.date || Date.now()).toLocaleString()}
										</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-semibold">
											{txn.currency || "USD"} {Number(txn.amount || 0).toLocaleString()}
										</p>
										<Badge
											variant={
												txn.status === "completed" || txn.status === "approved"
													? "success"
													: txn.status === "pending" || txn.status === "processing"
													? "warning"
													: txn.status === "rejected" || txn.status === "failed"
													? "destructive"
													: "outline"
											}
											className="mt-1 text-xs"
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
		</div>
	);
}

