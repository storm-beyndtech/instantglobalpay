"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Search, Filter, Copy } from "lucide-react";

interface Deposit {
  _id: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  amount: number;
  currency: string;
  walletData: {
    address: string;
    network: string;
    coinName: string;
    convertedAmount?: number;
  };
  status: string;
  date: string;
  createdAt: string;
}

export default function DepositsApprovalPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [filteredDeposits, setFilteredDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDeposits();
  }, []);

  useEffect(() => {
    filterDeposits();
  }, [deposits, searchTerm, statusFilter]);

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch("/api/deposits", { headers });
      const data = await response.json();
      setDeposits(data || []);
    } catch (error) {
      console.error("Failed to fetch deposits:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDeposits = () => {
    let filtered = deposits;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.walletData.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDeposits(filtered);
  };

  const handleApprove = async (depositId: string) => {
    setProcessingId(depositId);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`/api/deposits/${depositId}/approve`, {
        method: "POST",
        headers,
      });

      if (response.ok) {
        // Refresh deposits
        await fetchDeposits();
        alert("Deposit approved successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to approve: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("Failed to approve deposit");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (depositId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    setProcessingId(depositId);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`/api/deposits/${depositId}/reject`, {
        method: "POST",
        headers,
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        await fetchDeposits();
        alert("Deposit rejected");
      } else {
        const error = await response.json();
        alert(`Failed to reject: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Failed to reject deposit");
    } finally {
      setProcessingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent-500 border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading deposits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Deposit Approvals</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and approve pending deposits</p>
      </div>

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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Deposits</p>
            <p className="text-2xl font-semibold mt-1">{deposits.length}</p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold mt-1 text-orange-600">
              {deposits.filter((d) => d.status === "pending").length}
            </p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Approved Today</p>
            <p className="text-2xl font-semibold mt-1 text-green-600">
              {
                deposits.filter(
                  (d) =>
                    d.status === "approved" &&
                    new Date(d.createdAt).toDateString() === new Date().toDateString()
                ).length
              }
            </p>
          </div>
        </Card>
      </div>

      {/* Deposits Table */}
      <Card variant="glass" padding="lg" hover="lift">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg">Deposits</CardTitle>
          <CardDescription>
            {filteredDeposits.length} {filteredDeposits.length === 1 ? "deposit" : "deposits"} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          {filteredDeposits.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              No deposits found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDeposits.map((deposit) => (
                <div
                  key={deposit._id}
                  className="flex flex-col gap-4 rounded-lg border border-border px-4 py-4 hover:bg-accent/5 transition-colors"
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{deposit.user.name}</p>
                        {getStatusBadge(deposit.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{deposit.user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {deposit.currency} {deposit.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(deposit.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Wallet Details */}
                  <div className="grid gap-3 md:grid-cols-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Network</p>
                      <p className="font-medium mt-0.5">{deposit.walletData.network}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Coin</p>
                      <p className="font-medium mt-0.5">{deposit.walletData.coinName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Wallet Address</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="font-mono text-xs truncate max-w-[200px]">
                          {deposit.walletData.address}
                        </p>
                        <button
                          onClick={() => copyToClipboard(deposit.walletData.address)}
                          className="p-1 hover:bg-accent/10 rounded"
                        >
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {deposit.status === "pending" && (
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(deposit._id)}
                        disabled={processingId === deposit._id}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {processingId === deposit._id ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(deposit._id)}
                        disabled={processingId === deposit._id}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
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
