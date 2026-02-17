"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface Coin {
	name: string;
	address: string;
	network: string;
	price: number;
}

interface UtilData {
	_id?: string;
	coins: Coin[];
	bankDetails: {
		bankName: string;
		accountName: string;
		accountNumber: string;
		routingNumber: string;
		swift: string;
		iban: string;
		bankAddress: string;
	};
}

const EMPTY_UTIL: UtilData = {
	coins: [],
	bankDetails: {
		bankName: "",
		accountName: "",
		accountNumber: "",
		routingNumber: "",
		swift: "",
		iban: "",
		bankAddress: "",
	},
};

export default function AdminSettingsPage() {
	const [data, setData] = useState<UtilData>(EMPTY_UTIL);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const load = async () => {
			try {
				const token = localStorage.getItem("token");
				const headers: Record<string, string> = {};
				if (token) headers.Authorization = `Bearer ${token}`;
				const res = await fetch("/api/utils", { headers });
				const util = await res.json();
				if (util && util._id) {
					setData({
						_id: util._id,
						coins: Array.isArray(util.coins) ? util.coins : [],
						bankDetails: { ...EMPTY_UTIL.bankDetails, ...(util.bankDetails || {}) },
					});
				}
			} catch (error) {
				console.error("Failed to load settings:", error);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const save = async () => {
		setSaving(true);
		try {
			const token = localStorage.getItem("token");
			const headers: Record<string, string> = { "Content-Type": "application/json" };
			if (token) headers.Authorization = `Bearer ${token}`;

			const method = data._id ? "PUT" : "POST";
			const endpoint = data._id ? `/api/utils/update/${data._id}` : "/api/utils";
			const res = await fetch(endpoint, {
				method,
				headers,
				body: JSON.stringify({
					coins: data.coins,
					bankDetails: data.bankDetails,
				}),
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				alert(`Failed to save settings: ${err.message || res.statusText}`);
				return;
			}

			const saved = await res.json();
			setData((prev) => ({ ...prev, _id: saved?._id || prev._id }));
			alert("Settings saved");
		} catch (error) {
			console.error("Save settings error:", error);
			alert("Failed to save settings");
		} finally {
			setSaving(false);
		}
	};

	const addCoin = () => {
		setData((prev) => ({
			...prev,
			coins: [...prev.coins, { name: "", network: "", address: "", price: 0 }],
		}));
	};

	const removeCoin = (idx: number) => {
		setData((prev) => ({
			...prev,
			coins: prev.coins.filter((_, i) => i !== idx),
		}));
	};

	if (loading) {
		return <div className="text-sm text-muted-foreground">Loading settings...</div>;
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
				<p className="text-sm text-muted-foreground mt-1">Configure utility data, wallet addresses and account details</p>
			</div>

			<Card variant="glass" padding="lg" hover="lift">
				<CardHeader className="p-0 space-y-2">
					<CardTitle className="text-lg">Bank Account Details</CardTitle>
					<CardDescription>Used for deposit and wire instructions</CardDescription>
				</CardHeader>
				<CardContent className="p-0 mt-6 grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Bank Name</Label>
						<Input value={data.bankDetails.bankName} onChange={(e) => setData((p) => ({ ...p, bankDetails: { ...p.bankDetails, bankName: e.target.value } }))} />
					</div>
					<div className="space-y-2">
						<Label>Account Name</Label>
						<Input value={data.bankDetails.accountName} onChange={(e) => setData((p) => ({ ...p, bankDetails: { ...p.bankDetails, accountName: e.target.value } }))} />
					</div>
					<div className="space-y-2">
						<Label>Account Number</Label>
						<Input value={data.bankDetails.accountNumber} onChange={(e) => setData((p) => ({ ...p, bankDetails: { ...p.bankDetails, accountNumber: e.target.value } }))} />
					</div>
					<div className="space-y-2">
						<Label>Routing Number</Label>
						<Input value={data.bankDetails.routingNumber} onChange={(e) => setData((p) => ({ ...p, bankDetails: { ...p.bankDetails, routingNumber: e.target.value } }))} />
					</div>
					<div className="space-y-2">
						<Label>SWIFT</Label>
						<Input value={data.bankDetails.swift} onChange={(e) => setData((p) => ({ ...p, bankDetails: { ...p.bankDetails, swift: e.target.value } }))} />
					</div>
					<div className="space-y-2">
						<Label>IBAN</Label>
						<Input value={data.bankDetails.iban} onChange={(e) => setData((p) => ({ ...p, bankDetails: { ...p.bankDetails, iban: e.target.value } }))} />
					</div>
					<div className="space-y-2 md:col-span-2">
						<Label>Bank Address</Label>
						<Input value={data.bankDetails.bankAddress} onChange={(e) => setData((p) => ({ ...p, bankDetails: { ...p.bankDetails, bankAddress: e.target.value } }))} />
					</div>
				</CardContent>
			</Card>

			<Card variant="glass" padding="lg" hover="lift">
				<CardHeader className="p-0 space-y-2">
					<CardTitle className="text-lg">Crypto Wallet Utility Data</CardTitle>
					<CardDescription>Manage coin/network wallet addresses and price references</CardDescription>
				</CardHeader>
				<CardContent className="p-0 mt-6 space-y-4">
					{data.coins.map((coin, idx) => (
						<div key={idx} className="grid gap-3 md:grid-cols-5 border border-border rounded-lg p-3">
							<Input placeholder="Coin (USDT)" value={coin.name} onChange={(e) => setData((p) => {
								const next = [...p.coins];
								next[idx] = { ...next[idx], name: e.target.value };
								return { ...p, coins: next };
							})} />
							<Input placeholder="Network (TRC20)" value={coin.network} onChange={(e) => setData((p) => {
								const next = [...p.coins];
								next[idx] = { ...next[idx], network: e.target.value };
								return { ...p, coins: next };
							})} />
							<Input className="md:col-span-2" placeholder="Wallet Address" value={coin.address} onChange={(e) => setData((p) => {
								const next = [...p.coins];
								next[idx] = { ...next[idx], address: e.target.value };
								return { ...p, coins: next };
							})} />
							<div className="flex gap-2">
								<Input type="number" placeholder="Price" value={coin.price} onChange={(e) => setData((p) => {
									const next = [...p.coins];
									next[idx] = { ...next[idx], price: Number(e.target.value || 0) };
									return { ...p, coins: next };
								})} />
								<Button variant="outline" size="icon" onClick={() => removeCoin(idx)}>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
					<div className="flex gap-3">
						<Button variant="outline" onClick={addCoin} className="gap-2">
							<Plus className="h-4 w-4" />
							Add Wallet Utility
						</Button>
						<Button onClick={save} disabled={saving}>
							{saving ? "Saving..." : "Save Settings"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

