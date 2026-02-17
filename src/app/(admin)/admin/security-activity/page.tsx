"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Loader2,
	RefreshCw,
	MapPin,
	Monitor,
	Smartphone,
	Tablet,
	Globe,
	Clock,
	ChevronDown,
	ChevronUp,
	User,
	Activity,
	Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
	_id: string;
	userId: {
		_id: string;
		email: string;
		name?: { first?: string; last?: string; full?: string };
	};
	action: string;
	resource: string;
	resourceId: string;
	details?: {
		before?: any;
		after?: any;
		metadata?: any;
	};
	ipAddress: string;
	userAgent: string;
	location?: {
		country?: string;
		countryCode?: string;
		region?: string;
		city?: string;
		timezone?: string;
		isp?: string;
		latitude?: number;
		longitude?: number;
	};
	deviceInfo?: {
		browser?: string;
		browserVersion?: string;
		os?: string;
		osVersion?: string;
		device?: string;
		deviceType?: string;
	};
	createdAt: string;
	timestamp: string;
}

interface ServerAuditLog {
	_id: string;
	action?: string;
	actor?: { userId?: string; email?: string };
	target?: { entityType?: string; entityId?: string };
	request?: {
		ip?: string;
		userAgent?: string;
		country?: string;
		region?: string;
		city?: string;
		timezone?: string;
		latitude?: number;
		longitude?: number;
		meta?: Record<string, any>;
	};
	changes?: { before?: any; after?: any };
	createdAt?: string;
}

interface Stats {
	total: number;
	today: number;
	thisWeek: number;
	uniqueAdmins: number;
}

function parseDeviceInfo(userAgent: string) {
	const ua = (userAgent || "").toLowerCase();
	const deviceType = /ipad|tablet/.test(ua) ? "tablet" : /mobile|iphone|android/.test(ua) ? "mobile" : "desktop";
	const os = ua.includes("windows")
		? "Windows"
		: ua.includes("mac os") || ua.includes("macintosh")
			? "macOS"
			: ua.includes("android")
				? "Android"
				: ua.includes("iphone") || ua.includes("ipad")
					? "iOS"
					: ua.includes("linux")
						? "Linux"
						: "Unknown";
	const browser = ua.includes("edg/")
		? "Edge"
		: ua.includes("opr/") || ua.includes("opera")
			? "Opera"
			: ua.includes("chrome/")
				? "Chrome"
				: ua.includes("safari/") && !ua.includes("chrome/")
					? "Safari"
					: ua.includes("firefox/")
						? "Firefox"
						: "Unknown";
	return { deviceType, os, browser };
}

export default function AdminSecurityActivityPage() {
	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [stats, setStats] = useState<Stats>({ total: 0, today: 0, thisWeek: 0, uniqueAdmins: 0 });
	const [filter, setFilter] = useState({ action: "", resource: "", search: "" });
	const [expandedLog, setExpandedLog] = useState<string | null>(null);

	useEffect(() => {
		void fetchLogs();
		void fetchStats();
	}, [page, filter]);

	const fetchLogs = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const params = new URLSearchParams({
				page: page.toString(),
				limit: "15",
			});
			if (filter.action) params.set("action", filter.action);
			if (filter.resource) params.set("resource", filter.resource);
			if (filter.search) params.set("search", filter.search);

			const res = await fetch(`/api/users/admin/audit-logs?${params.toString()}`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});
			const data = await res.json().catch(() => ({}));
			const normalizedLogs: AuditLog[] = Array.isArray(data.logs)
				? data.logs.map((log: ServerAuditLog) => {
						const device = parseDeviceInfo(String(log.request?.userAgent || ""));
						return {
							_id: String(log._id),
							userId: {
								_id: String(log.actor?.userId || ""),
								email: String(log.actor?.email || ""),
								name: { full: String(log.actor?.email || "Unknown Admin") },
							},
							action: String(log.action || ""),
							resource: String(log.target?.entityType || ""),
							resourceId: String(log.target?.entityId || ""),
							details: {
								before: log.changes?.before,
								after: log.changes?.after,
								metadata: log.request?.meta || {},
							},
							ipAddress: String(log.request?.ip || ""),
							userAgent: String(log.request?.userAgent || ""),
							location: {
								country: String(log.request?.country || ""),
								countryCode: String(log.request?.country || ""),
								region: String(log.request?.region || ""),
								city: String(log.request?.city || ""),
								timezone: String(log.request?.timezone || ""),
								latitude: Number(log.request?.latitude || 0) || undefined,
								longitude: Number(log.request?.longitude || 0) || undefined,
							},
							deviceInfo: {
								browser: device.browser,
								os: device.os,
								deviceType: device.deviceType,
							},
							createdAt: String(log.createdAt || ""),
							timestamp: String(log.createdAt || ""),
						};
					})
				: [];
			setLogs(normalizedLogs);
			setTotalPages(data.totalPages || 1);
		} catch (err) {
			console.error("Failed to fetch audit logs", err);
			setLogs([]);
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await fetch("/api/users/admin/audit-stats", {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});
			const data = await res.json().catch(() => ({}));
			setStats(data || { total: 0, today: 0, thisWeek: 0, uniqueAdmins: 0 });
		} catch (err) {
			console.error("Failed to fetch stats", err);
		}
	};

	const formatDate = (iso?: string) => {
		if (!iso) return "--";
		const d = new Date(iso);
		return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
	};

	const formatRelativeTime = (iso?: string) => {
		if (!iso) return "--";
		const now = new Date();
		const then = new Date(iso);
		const diffMs = now.getTime() - then.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return formatDate(iso);
	};

	const getDeviceIcon = (deviceType?: string) => {
		switch (deviceType?.toLowerCase()) {
			case "mobile":
				return <Smartphone className="h-4 w-4" />;
			case "tablet":
				return <Tablet className="h-4 w-4" />;
			case "desktop":
			default:
				return <Monitor className="h-4 w-4" />;
		}
	};

	const getActionColor = (action: string) => {
		if (action.includes("APPROVE") || action.includes("CREATE")) return "success";
		if (action.includes("REJECT") || action.includes("DELETE")) return "destructive";
		if (action.includes("UPDATE") || action.includes("MODIFY")) return "warning";
		return "default";
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-semibold tracking-tight">Admin Activity Logs</h1>
					<p className="text-sm text-muted-foreground">Comprehensive audit trail with location &amp; device tracking</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={() => void fetchLogs()} disabled={loading}>
						<RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
						Refresh
					</Button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<Card variant="glass" padding="lg">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-primary-500/10">
							<Activity className="h-5 w-5 text-primary-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Total Actions</p>
							<p className="text-2xl font-bold">{(stats?.total || 0).toLocaleString()}</p>
						</div>
					</div>
				</Card>
				<Card variant="glass" padding="lg">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-accent-500/10">
							<Clock className="h-5 w-5 text-accent-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Today</p>
							<p className="text-2xl font-bold">{(stats?.today || 0).toLocaleString()}</p>
						</div>
					</div>
				</Card>
				<Card variant="glass" padding="lg">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-green-500/10">
							<Calendar className="h-5 w-5 text-green-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">This Week</p>
							<p className="text-2xl font-bold">{(stats?.thisWeek || 0).toLocaleString()}</p>
						</div>
					</div>
				</Card>
				<Card variant="glass" padding="lg">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-purple-500/10">
							<User className="h-5 w-5 text-purple-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Active Admins</p>
							<p className="text-2xl font-bold">{(stats?.uniqueAdmins || 0).toLocaleString()}</p>
						</div>
					</div>
				</Card>
			</div>

			<Card variant="glass" padding="lg">
				<div className="grid gap-3 md:grid-cols-3">
					<Input
						placeholder="Search by admin, email, or resource ID..."
						value={filter.search}
						onChange={(e) => {
							setPage(1);
							setFilter({ ...filter, search: e.target.value });
						}}
					/>
					<Input
						placeholder="Filter by action (e.g. APPROVE_DEPOSIT)"
						value={filter.action}
						onChange={(e) => {
							setPage(1);
							setFilter({ ...filter, action: e.target.value });
						}}
					/>
					<Input
						placeholder="Filter by resource (e.g. deposit, user)"
						value={filter.resource}
						onChange={(e) => {
							setPage(1);
							setFilter({ ...filter, resource: e.target.value });
						}}
					/>
				</div>
			</Card>

			<Card variant="glass" padding="none">
				<CardHeader className="border-b border-border p-4">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg">Activity Log</CardTitle>
							<CardDescription>Page {page} of {totalPages}</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					{loading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-accent-500" />
						</div>
					) : logs.length === 0 ? (
						<div className="py-12 text-center text-muted-foreground text-sm">No audit logs found.</div>
					) : (
						<div className="divide-y divide-border">
							{logs.map((log) => {
								const isExpanded = expandedLog === log._id;
								const adminName =
									log.userId?.name?.full || log.userId?.name?.first || log.userId?.email || "Unknown Admin";

								return (
									<div key={log._id} className="p-4 hover:bg-accent/5 transition-colors">
										<div className="flex items-start gap-4">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<Badge variant={getActionColor(log.action) as any} className="text-xs font-semibold">
														{log.action}
													</Badge>
													<Badge variant="outline" className="text-[11px] uppercase">
														{log.resource}
													</Badge>
												</div>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<User className="h-3 w-3" />
													<span>{adminName}</span>
													<span className="text-xs">.</span>
													<span className="text-xs">{formatRelativeTime(log.createdAt || log.timestamp)}</span>
												</div>
											</div>

											<div className="flex-shrink-0 space-y-1 text-right">
												{log.location && (
													<div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
														<MapPin className="h-3 w-3" />
														<span>
															{log.location.city || "Unknown"}, {log.location.countryCode || "??"}
														</span>
													</div>
												)}
												{log.deviceInfo && (
													<div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
														{getDeviceIcon(log.deviceInfo.deviceType)}
														<span>
															{log.deviceInfo.os || "Unknown"} . {log.deviceInfo.browser || "Unknown"}
														</span>
													</div>
												)}
											</div>

											<Button
												variant="ghost"
												size="sm"
												onClick={() => setExpandedLog(isExpanded ? null : log._id)}
												className="h-8 w-8 p-0"
											>
												{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
											</Button>
										</div>

										{isExpanded && (
											<div className="mt-4 pt-4 border-t border-border/50 space-y-3">
												<div className="grid gap-3 md:grid-cols-2">
													<div className="space-y-2">
														<h4 className="text-xs font-semibold text-muted-foreground uppercase">Location &amp; Network</h4>
														<div className="space-y-1 text-sm">
															<div className="flex items-center gap-2">
																<Globe className="h-3 w-3 text-muted-foreground" />
																<span className="text-xs text-muted-foreground">IP:</span>
																<span className="font-mono">{log.ipAddress || "--"}</span>
															</div>
															{log.location && (
																<>
																	<div className="flex items-center gap-2">
																		<MapPin className="h-3 w-3 text-muted-foreground" />
																		<span className="text-xs text-muted-foreground">Location:</span>
																		<span>
																			{log.location.city || "--"}, {log.location.region || "--"}, {log.location.country || "--"}
																		</span>
																	</div>
																	{log.location.timezone && (
																		<div className="flex items-center gap-2">
																			<Clock className="h-3 w-3 text-muted-foreground" />
																			<span className="text-xs text-muted-foreground">Timezone:</span>
																			<span>{log.location.timezone}</span>
																		</div>
																	)}
																	{log.location.isp && (
																		<div className="flex items-center gap-2">
																			<Globe className="h-3 w-3 text-muted-foreground" />
																			<span className="text-xs text-muted-foreground">ISP:</span>
																			<span className="truncate">{log.location.isp}</span>
																		</div>
																	)}
																</>
															)}
														</div>
													</div>

													<div className="space-y-2">
														<h4 className="text-xs font-semibold text-muted-foreground uppercase">Device Information</h4>
														<div className="space-y-1 text-sm">
															{log.deviceInfo && (
																<>
																	<div className="flex items-center gap-2">
																		{getDeviceIcon(log.deviceInfo.deviceType)}
																		<span className="text-xs text-muted-foreground">Type:</span>
																		<span className="capitalize">{log.deviceInfo.deviceType || "Unknown"}</span>
																	</div>
																	<div className="flex items-center gap-2">
																		<Monitor className="h-3 w-3 text-muted-foreground" />
																		<span className="text-xs text-muted-foreground">OS:</span>
																		<span>
																			{log.deviceInfo.os || "Unknown"} {log.deviceInfo.osVersion || ""}
																		</span>
																	</div>
																	<div className="flex items-center gap-2">
																		<Globe className="h-3 w-3 text-muted-foreground" />
																		<span className="text-xs text-muted-foreground">Browser:</span>
																		<span>
																			{log.deviceInfo.browser || "Unknown"} {log.deviceInfo.browserVersion || ""}
																		</span>
																	</div>
																</>
															)}
															<div className="text-xs text-muted-foreground mt-2">
																<span>User Agent:</span>
																<p className="font-mono text-[10px] break-all mt-1 opacity-70">{log.userAgent || "--"}</p>
															</div>
														</div>
													</div>
												</div>

												<div className="space-y-2">
													<h4 className="text-xs font-semibold text-muted-foreground uppercase">Resource Details</h4>
													<div className="grid gap-2 text-sm">
														<div className="flex items-center gap-2">
															<span className="text-xs text-muted-foreground">Resource ID:</span>
															<span className="font-mono">{log.resourceId || "--"}</span>
														</div>
														<div className="flex items-center gap-2">
															<span className="text-xs text-muted-foreground">Timestamp:</span>
															<span>{formatDate(log.createdAt || log.timestamp)}</span>
														</div>
													</div>
												</div>

												{(log.details?.before || log.details?.after) && (
													<div className="space-y-2">
														<h4 className="text-xs font-semibold text-muted-foreground uppercase">State Changes</h4>
														<div className="grid gap-2 md:grid-cols-2">
															{log.details.before && (
																<div className="bg-muted/30 rounded-lg p-3">
																	<p className="text-xs font-semibold mb-1">Before</p>
																	<pre className="text-[10px] font-mono overflow-auto max-h-32">
																		{JSON.stringify(log.details.before, null, 2)}
																	</pre>
																</div>
															)}
															{log.details.after && (
																<div className="bg-accent/5 rounded-lg p-3">
																	<p className="text-xs font-semibold mb-1">After</p>
																	<pre className="text-[10px] font-mono overflow-auto max-h-32">
																		{JSON.stringify(log.details.after, null, 2)}
																	</pre>
																</div>
															)}
														</div>
													</div>
												)}

												{log.details?.metadata && Object.keys(log.details.metadata).length > 0 && (
													<div className="space-y-2">
														<h4 className="text-xs font-semibold text-muted-foreground uppercase">Additional Metadata</h4>
														<div className="bg-muted/20 rounded-lg p-3">
															<pre className="text-[10px] font-mono overflow-auto max-h-32">
																{JSON.stringify(log.details.metadata, null, 2)}
															</pre>
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</CardContent>

				{logs.length > 0 && (
					<div className="flex items-center justify-between p-4 border-t border-border">
						<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
							Previous
						</Button>
						<span className="text-sm text-muted-foreground">
							Page {page} of {totalPages}
						</span>
						<Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
							Next
						</Button>
					</div>
				)}
			</Card>
		</div>
	);
}
