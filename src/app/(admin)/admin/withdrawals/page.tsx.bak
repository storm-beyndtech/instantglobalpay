"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Search, Filter, Copy, RefreshCw, Zap, AlertTriangle } from "lucide-react";

interface Withdrawal {
  _id: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  amount: number;
  currency: string;
  walletAddress: string;
  network: string;
  status: string;
  nowpaymentsStatus?: string;
  nowpaymentsPaymentId?: string;
  failureReason?: string;
  createdAt: string;
  processedAt?: string;
}

interface PayoutBalance {
  currency: string;
  available: number;
  pending: number;
}

export default function WithdrawalsApprovalPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [balances, setBalances] = useState<PayoutBalance[]>([]);

  useEffect(() => {
    fetchWithdrawals();
    fetchBalances();
  }, []);

  useEffect(() => {
    filterWithdrawals();
  }, [withdrawals, searchTerm, statusFilter]);

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch("/api/withdrawals?limit=100&sort=-createdAt", { headers });
      const data = await response.json();
      setWithdrawals(data || []);
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalances = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch balances for common currencies
      const currencies = ["USDC", "USDT", "BTC"];
      const balancePromises = currencies.map(async (currency) => {
        try {
          const response = await fetch(`/api/withdrawals/admin/balance?currency=${currency}`, { headers });
          const data = await response.json();
          return { currency, available: data.available || 0, pending: data.pending || 0 };
        } catch {
          return { currency, available: 0, pending: 0 };
        }
      });

      const balanceResults = await Promise.all(balancePromises);
      setBalances(balanceResults);
    } catch (error) {
      console.error("Failed to fetch balances:", error);
    }
  };

  const filterWithdrawals = () => {
    let filtered = withdrawals;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((w) => w.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (w) =>
          w.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredWithdrawals(filtered);
  };

  const handleProcessPending = async () => {
    setBatchProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch("/api/withdrawals/admin/process-pending", {
        method: "POST",
        headers,
      });

      if (response.ok) {
        const result = await response.json();
        await fetchWithdrawals();
        await fetchBalances();
        alert(`Batch processing complete: ${result.processed || 0} withdrawals processed`);
      } else {
        const error = await response.json();
        alert(`Failed to process: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Batch processing error:", error);
      alert("Failed to process pending withdrawals");
    } finally {
      setBatchProcessing(false);
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    setProcessingId(withdrawalId);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`/api/withdrawals/${withdrawalId}/approve`, {
        method: "POST",
        headers,
      });

      if (response.ok) {
        await fetchWithdrawals();
        await fetchBalances();
        alert("Withdrawal approved successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to approve: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("Failed to approve withdrawal");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (withdrawalId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    setProcessingId(withdrawalId);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`/api/withdrawals/${withdrawalId}/reject`, {
        method: "POST",
        headers,
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        await fetchWithdrawals();
        alert("Withdrawal rejected");
      } else {
        const error = await response.json();
        alert(`Failed to reject: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Failed to reject withdrawal");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRetry = async (withdrawalId: string) => {
    setProcessingId(withdrawalId);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`/api/withdrawals/${withdrawalId}/retry`, {
        method: "POST",
        headers,
      });

      if (response.ok) {
        await fetchWithdrawals();
        alert("Withdrawal retry initiated");
      } else {
        const error = await response.json();
        alert(`Failed to retry: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Retry error:", error);
      alert("Failed to retry withdrawal");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCheckStatus = async (withdrawalId: string) => {
    setProcessingId(withdrawalId);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`/api/withdrawals/${withdrawalId}/status`, { headers });
      const data = await response.json();

      if (response.ok) {
        await fetchWithdrawals();
        alert(`Status: ${data.status}\nNOWPayments: ${data.nowpaymentsStatus || "N/A"}`);
      } else {
        alert(`Failed to check status: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Status check error:", error);
      alert("Failed to check withdrawal status");
    } finally {
      setProcessingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusBadge = (status: string, nowpaymentsStatus?: string) => {
    if (nowpaymentsStatus) {
      switch (nowpaymentsStatus.toLowerCase()) {
        case "finished":
        case "confirmed":
          return <Badge variant="success">Completed</Badge>;
        case "sending":
        case "waiting":
          return <Badge variant="warning">Processing</Badge>;
        case "failed":
        case "expired":
          return <Badge variant="destructive">Failed</Badge>;
        default:
          return <Badge variant="outline">{nowpaymentsStatus}</Badge>;
      }
    }

    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "approved":
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "rejected":
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "processing":
        return <Badge variant="outline">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent-500 border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading withdrawals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Withdrawal Approvals</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and process pending withdrawals</p>
        </div>
        <Button
          onClick={handleProcessPending}
          disabled={batchProcessing || withdrawals.filter((w) => w.status === "pending").length === 0}
          className="gap-2"
        >
          <Zap className="h-4 w-4" />
          {batchProcessing ? "Processing..." : "Batch Process Pending"}
        </Button>
      </div>

      {/* Payout Balances */}
      {balances.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {balances.map((balance) => (
            <Card key={balance.currency} variant="glass" padding="lg">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Payout Balance - {balance.currency}</p>
                <p className="text-2xl font-semibold mt-1">
                  {balance.available.toLocaleString()} {balance.currency}
                </p>
                {balance.pending > 0 && (
                  <p className="text-xs text-orange-600 mt-1">Pending: {balance.pending.toLocaleString()}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card variant="glass" padding="lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email, name, or wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Withdrawals</p>
            <p className="text-2xl font-semibold mt-1">{withdrawals.length}</p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold mt-1 text-orange-600">
              {withdrawals.filter((w) => w.status === "pending").length}
            </p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Processing</p>
            <p className="text-2xl font-semibold mt-1 text-blue-600">
              {withdrawals.filter((w) => w.status === "processing").length}
            </p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Completed Today</p>
            <p className="text-2xl font-semibold mt-1 text-green-600">
              {
                withdrawals.filter(
                  (w) =>
                    (w.status === "completed" || w.status === "approved") &&
                    new Date(w.processedAt || w.createdAt).toDateString() === new Date().toDateString()
                ).length
              }
            </p>
          </div>
        </Card>
      </div>

      {/* Withdrawals Table */}
      <Card variant="glass" padding="lg" hover="lift">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg">Withdrawals</CardTitle>
          <CardDescription>
            {filteredWithdrawals.length} {filteredWithdrawals.length === 1 ? "withdrawal" : "withdrawals"} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          {filteredWithdrawals.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">No withdrawals found</div>
          ) : (
            <div className="space-y-3">
              {filteredWithdrawals.map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="flex flex-col gap-4 rounded-lg border border-border px-4 py-4 hover:bg-accent/5 transition-colors"
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{withdrawal.user.name}</p>
                        {getStatusBadge(withdrawal.status, withdrawal.nowpaymentsStatus)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{withdrawal.user.email}</p>
                      {withdrawal.nowpaymentsPaymentId && (
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                          NP ID: {withdrawal.nowpaymentsPaymentId}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {withdrawal.currency} {withdrawal.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(withdrawal.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Wallet Details */}
                  <div className="grid gap-3 md:grid-cols-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Network</p>
                      <p className="font-medium mt-0.5">{withdrawal.network}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Wallet Address</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="font-mono text-xs truncate max-w-[300px]">{withdrawal.walletAddress}</p>
                        <button
                          onClick={() => copyToClipboard(withdrawal.walletAddress)}
                          className="p-1 hover:bg-accent/10 rounded"
                        >
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Failure Reason */}
                  {withdrawal.failureReason && (
                    <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-red-600">Failure Reason</p>
                        <p className="text-xs text-red-600/80 mt-0.5">{withdrawal.failureReason}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {withdrawal.status === "pending" && (
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(withdrawal._id)}
                        disabled={processingId === withdrawal._id}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {processingId === withdrawal._id ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(withdrawal._id)}
                        disabled={processingId === withdrawal._id}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {(withdrawal.status === "processing" || withdrawal.status === "failed") && (
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckStatus(withdrawal._id)}
                        disabled={processingId === withdrawal._id}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Check Status
                      </Button>
                      {withdrawal.status === "failed" && (
                        <Button
                          size="sm"
                          onClick={() => handleRetry(withdrawal._id)}
                          disabled={processingId === withdrawal._id}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Retry
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
