"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const kindLabel: Record<string, string> = {
  internal_transfer: "Internal Transfer",
  external_transfer: "External Transfer",
  crypto_deposit: "Crypto Deposit",
  crypto_withdrawal: "Crypto Withdrawal",
  gift_card_purchase: "Gift Card",
  virtual_card_purchase: "Virtual Card",
  flight_booking: "Flight Booking",
  fee: "Fee",
};

export default function TransactionsPage() {
  const [allTxns, setAllTxns] = useState<any[]>([]);
  const [filteredTxns, setFilteredTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [allTxns, searchTerm, typeFilter, statusFilter, dateFrom, dateTo]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/transactions", { headers });
      const data = await response.json();
      setAllTxns(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = allTxns;

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.kind === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((t) => new Date(t.createdAt) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter((t) => new Date(t.createdAt) <= toDate);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.kind?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.currency?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTxns(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  // Pagination
  const totalPages = Math.ceil(filteredTxns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTxns = filteredTxns.slice(startIndex, endIndex);

  const uniqueTypes = Array.from(new Set(allTxns.map((t) => t.kind).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent-500 border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Recent activity across all rails.</p>
        </div>
        <Card variant="glass" padding="lg">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Recent activity across all rails.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">{allTxns.length}</p>
          <p className="text-xs text-muted-foreground">Total Transactions</p>
        </div>
      </div>

      {/* Filters */}
      <Card variant="glass" padding="lg">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by description, type, or currency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {kindLabel[type] || type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">From Date</label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">To Date</label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || typeFilter !== "all" || statusFilter !== "all" || dateFrom || dateTo) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-semibold mt-1">{allTxns.length}</p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Filtered Results</p>
            <p className="text-2xl font-semibold mt-1">{filteredTxns.length}</p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-2xl font-semibold mt-1 text-green-600">
              {allTxns.filter((t) => t.status === "completed").length}
            </p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold mt-1 text-orange-600">
              {allTxns.filter((t) => t.status === "pending").length}
            </p>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card variant="glass" padding="lg" hover="lift">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg">Activity</CardTitle>
          <CardDescription>
            Showing {paginatedTxns.length} of {filteredTxns.length} transactions (Page {currentPage} of{" "}
            {totalPages || 1})
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6 overflow-x-auto">
          {paginatedTxns.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">No transactions found</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedTxns.map((t) => (
                  <tr key={t.id || t._id} className="align-middle hover:bg-accent/5 transition-colors">
                    <td className="py-3 font-semibold">{kindLabel[t.kind] ?? t.kind}</td>
                    <td className="py-3 text-muted-foreground">
                      {t.description || "No description"}
                    </td>
                    <td className="py-3 font-semibold">
                      {t.currency} {t.amount.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          t.status === "completed"
                            ? "success"
                            : t.status === "pending"
                            ? "warning"
                            : t.status === "failed" || t.status === "rejected"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
