"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, MonitorSmartphone, ShieldAlert, Download, RefreshCw } from "lucide-react";

type ActivityStatus = "SUCCESS" | "FAILURE" | "BLOCKED";
type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface ActivityLog {
	_id: string;
	userId?: string;
	eventType: string;
	status: ActivityStatus;
	riskLevel: RiskLevel;
	ipAddress: string;
	location?: { country?: string; region?: string; city?: string };
	device?: { type?: string; os?: string; browser?: string };
	timestamp: string;
	metadata?: Record<string, any>;
}

interface LogsResponse {
	logs: ActivityLog[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

function riskClass(risk: RiskLevel): string {
	if (risk === "CRITICAL") return "bg-red-600/20 text-red-300 border-red-500/40";
	if (risk === "HIGH") return "bg-orange-600/20 text-orange-300 border-orange-500/40";
	if (risk === "MEDIUM") return "bg-yellow-600/20 text-yellow-300 border-yellow-500/40";
	return "bg-emerald-600/20 text-emerald-300 border-emerald-500/40";
}

export default function SecurityActivityPage() {
	const [logsData, setLogsData] = useState<LogsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [eventType, setEventType] = useState("");
	const [status, setStatus] = useState("");
	const [riskLevel, setRiskLevel] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [sortBy, setSortBy] = useState("timestamp");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [activeSessions, setActiveSessions] = useState<any[]>([]);

	const queryString = useMemo(() => {
		const params = new URLSearchParams({
			page: String(page),
			limit: "20",
			sortBy,
			sortOrder,
		});
		if (eventType) params.set("eventType", eventType);
		if (status) params.set("status", status);
		if (riskLevel) params.set("riskLevel", riskLevel);
		if (from) params.set("from", from);
		if (to) params.set("to", to);
		return params.toString();
	}, [page, sortBy, sortOrder, eventType, status, riskLevel, from, to]);

	const fetchLogs = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const headers: Record<string, string> = {};
			if (token) headers.Authorization = `Bearer ${token}`;
			const res = await fetch(`/api/activity-logs?${queryString}`, { headers });
			const data = await res.json();
			setLogsData(data);
		} catch (error) {
			console.error("Failed to fetch activity logs:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchActiveSessions = async () => {
		try {
			const token = localStorage.getItem("token");
			const headers: Record<string, string> = {};
			if (token) headers.Authorization = `Bearer ${token}`;
			const res = await fetch("/api/activity-logs/admin/active-sessions", { headers });
			const data = await res.json();
			setActiveSessions(Array.isArray(data?.sessions) ? data.sessions : []);
		} catch (error) {
			console.error("Failed to fetch active sessions:", error);
		}
	};

	useEffect(() => {
		void fetchLogs();
	}, [queryString]);

	useEffect(() => {
		void fetchActiveSessions();
		const timer = setInterval(() => void fetchActiveSessions(), 30000);
		return () => clearInterval(timer);
	}, []);

	const reportNotMe = async (logId: string) => {
		try {
			const token = localStorage.getItem("token");
			const headers: Record<string, string> = { "Content-Type": "application/json" };
			if (token) headers.Authorization = `Bearer ${token}`;
			const res = await fetch(`/api/activity-logs/${logId}/report-suspicious`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					reason: "This was not me",
					forceLogoutAll: true,
				}),
			});
			if (!res.ok) {
				throw new Error("Failed to report suspicious activity");
			}
			alert("Reported and all active sessions were terminated for this account.");
			void fetchLogs();
		} catch (error) {
			console.error("Report suspicious activity error:", error);
			alert("Failed to report activity.");
		}
	};

	const exportLogs = async (type: "csv" | "json") => {
		try {
			const token = localStorage.getItem("token");
			const headers: Record<string, string> = {};
			if (token) headers.Authorization = `Bearer ${token}`;
			const params = new URLSearchParams(queryString);
			params.set("export", type);
			const res = await fetch(`/api/activity-logs?${params.toString()}`, { headers });
			if (!res.ok) throw new Error("Export failed");
			if (type === "json") {
				const data = await res.json();
				const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `activity-logs-${Date.now()}.json`;
				a.click();
				URL.revokeObjectURL(url);
				return;
			}
			const text = await res.text();
			const blob = new Blob([text], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `activity-logs-${Date.now()}.csv`;
			a.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Export error:", error);
			alert("Failed to export logs.");
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">Security Activity</h1>
				<p className="text-sm text-muted-foreground mt-1">Authentication, session and account security monitoring</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card variant="glass" padding="lg">
					<p className="text-xs text-muted-foreground">24h Active Sessions</p>
					<p className="text-2xl font-semibold mt-1">{activeSessions.length}</p>
				</Card>
				<Card variant="glass" padding="lg">
					<p className="text-xs text-muted-foreground">High Risk Sessions</p>
					<p className="text-2xl font-semibold mt-1">
						{activeSessions.filter((s) => s.riskLevel === "HIGH" || s.riskLevel === "CRITICAL").length}
					</p>
				</Card>
				<Card variant="glass" padding="lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs text-muted-foreground">Realtime Session View</p>
							<p className="text-xs text-muted-foreground mt-1">Auto-refresh every 30s</p>
						</div>
						<Button size="sm" variant="outline" onClick={fetchActiveSessions} className="gap-2">
							<RefreshCw className="h-3.5 w-3.5" />
							Refresh
						</Button>
					</div>
				</Card>
			</div>

			<Card variant="glass" padding="lg" className="space-y-4">
				<div className="grid gap-3 md:grid-cols-6">
					<Input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
					<Input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
					<Input placeholder="Event type (LOGIN)" value={eventType} onChange={(e) => setEventType(e.target.value)} />
					<Input placeholder="Status (SUCCESS)" value={status} onChange={(e) => setStatus(e.target.value)} />
					<Input placeholder="Risk (HIGH)" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)} />
					<div className="flex gap-2">
						<Button variant="outline" className="w-full" onClick={() => setPage(1)}>
							Apply
						</Button>
						<Button variant="outline" onClick={() => {
							setFrom("");
							setTo("");
							setEventType("");
							setStatus("");
							setRiskLevel("");
							setPage(1);
						}}>
							Clear
						</Button>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" className="gap-2" onClick={() => exportLogs("csv")}>
						<Download className="h-4 w-4" />
						Export CSV
					</Button>
					<Button variant="outline" className="gap-2" onClick={() => exportLogs("json")}>
						<Download className="h-4 w-4" />
						Export JSON
					</Button>
				</div>
			</Card>

			<Card variant="glass" padding="lg">
				<div className="mb-3 flex items-center justify-between">
					<p className="text-sm font-medium">Activity Logs</p>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}>
							Sort: {sortOrder.toUpperCase()}
						</Button>
						<Button variant="outline" size="sm" onClick={() => setSortBy((p) => (p === "timestamp" ? "riskLevel" : "timestamp"))}>
							By: {sortBy}
						</Button>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
								<th className="py-2 pr-3">Time</th>
								<th className="py-2 pr-3">Event</th>
								<th className="py-2 pr-3">Status</th>
								<th className="py-2 pr-3">Risk</th>
								<th className="py-2 pr-3">Device/Location</th>
								<th className="py-2 pr-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{!loading && (logsData?.logs || []).map((log) => (
								<tr key={log._id} className="border-b border-border/30 align-top">
									<td className="py-3 pr-3">{new Date(log.timestamp).toLocaleString()}</td>
									<td className="py-3 pr-3">{log.eventType}</td>
									<td className="py-3 pr-3">{log.status}</td>
									<td className="py-3 pr-3">
										<span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${riskClass(log.riskLevel)}`}>{log.riskLevel}</span>
									</td>
									<td className="py-3 pr-3">
										<div className="space-y-1 text-xs text-muted-foreground">
											<div className="flex items-center gap-1">
												<MonitorSmartphone className="h-3.5 w-3.5" />
												<span>{log.device?.type || "unknown"} / {log.device?.os || "unknown"} / {log.device?.browser || "unknown"}</span>
											</div>
											<div className="flex items-center gap-1">
												<MapPin className="h-3.5 w-3.5" />
												<span>{log.location?.city || "Unknown"}, {log.location?.region || ""} {log.location?.country || ""}</span>
											</div>
										</div>
									</td>
									<td className="py-3 pr-3">
										{(log.riskLevel === "HIGH" || log.riskLevel === "CRITICAL") && (
											<Button size="sm" variant="outline" className="gap-2" onClick={() => reportNotMe(log._id)}>
												<ShieldAlert className="h-3.5 w-3.5" />
												This was not me
											</Button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{loading && <p className="text-sm text-muted-foreground mt-3">Loading activity logs...</p>}
				{!loading && !logsData?.logs?.length && <p className="text-sm text-muted-foreground mt-3">No activity logs found.</p>}
				<div className="mt-4 flex items-center justify-between">
					<p className="text-xs text-muted-foreground">
						Page {logsData?.page || 1} of {logsData?.totalPages || 1}
					</p>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" disabled={(logsData?.page || 1) <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
							Prev
						</Button>
						<Button variant="outline" size="sm" disabled={(logsData?.page || 1) >= (logsData?.totalPages || 1)} onClick={() => setPage((p) => p + 1)}>
							Next
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}
