"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  Trash2,
  X,
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  accountStatus: string;
  kycStatus: string;
  isEmailVerified: boolean;
  deposit?: number;
  withdrawal?: number;
  bonus?: number;
  interest?: number;
  createdAt: string;
  updatedAt: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const limit = 20;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchTerm ? { search: searchTerm } : {}),
      });

      const response = await fetch(`/api/users?${params}`, { headers });
      const data = await response.json();

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.totalUsers || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSuspend = async (userId: string) => {
    if (!confirm("Are you sure you want to suspend this user?")) return;

    setProcessingId(userId);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ accountStatus: "suspended" }),
      });

      if (response.ok) {
        await fetchUsers();
        alert("User suspended successfully");
      } else {
        const error = await response.json();
        alert(`Failed to suspend: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Suspend error:", error);
      alert("Failed to suspend user");
    } finally {
      setProcessingId(null);
    }
  };

  const handleActivate = async (userId: string) => {
    setProcessingId(userId);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ accountStatus: "active" }),
      });

      if (response.ok) {
        await fetchUsers();
        alert("User activated successfully");
      } else {
        const error = await response.json();
        alert(`Failed to activate: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Activate error:", error);
      alert("Failed to activate user");
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateKYC = async (userId: string, kycStatus: string) => {
    setProcessingId(userId);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ kycStatus }),
      });

      if (response.ok) {
        await fetchUsers();
        alert(`KYC status updated to ${kycStatus}`);
      } else {
        const error = await response.json();
        alert(`Failed to update KYC: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("KYC update error:", error);
      alert("Failed to update KYC status");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (userId: string, userEmail: string) => {
    const confirmation = prompt(
      `Type "${userEmail}" to confirm deletion. This action CANNOT be undone.`
    );

    if (confirmation !== userEmail) {
      alert("Deletion cancelled. Email did not match.");
      return;
    }

    setProcessingId(userId);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        await fetchUsers();
        alert("User deleted successfully");
      } else {
        const error = await response.json();
        alert(`Failed to delete: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user");
    } finally {
      setProcessingId(null);
    }
  };

  const getAccountStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getKYCStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge variant="success">Verified</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "unverified":
        return <Badge variant="outline">Unverified</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTotalBalance = (user: User) => {
    const deposit = user.deposit || 0;
    const bonus = user.bonus || 0;
    const interest = user.interest || 0;
    const withdrawal = user.withdrawal || 0;
    return deposit + bonus + interest - withdrawal;
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent-500 border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform users and permissions</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">{totalUsers}</p>
          <p className="text-xs text-muted-foreground">Total Users</p>
        </div>
      </div>

      {/* Search */}
      <Card variant="glass" padding="lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or username..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Active Users</p>
            <p className="text-2xl font-semibold mt-1 text-green-600">
              {users.filter((u) => u.accountStatus === "active").length}
            </p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Suspended</p>
            <p className="text-2xl font-semibold mt-1 text-red-600">
              {users.filter((u) => u.accountStatus === "suspended").length}
            </p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">KYC Verified</p>
            <p className="text-2xl font-semibold mt-1 text-green-600">
              {users.filter((u) => u.kycStatus === "approved").length}
            </p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Email Verified</p>
            <p className="text-2xl font-semibold mt-1 text-blue-600">
              {users.filter((u) => u.isEmailVerified).length}
            </p>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card variant="glass" padding="lg" hover="lift">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg">Users</CardTitle>
          <CardDescription>
            Showing {users.length} users (Page {currentPage} of {totalPages})
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          {users.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">No users found</div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col gap-4 rounded-lg border border-border px-4 py-4 hover:bg-accent/5 transition-colors"
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">
                          {user.firstName} {user.lastName}
                        </p>
                        {getAccountStatusBadge(user.accountStatus)}
                        {getKYCStatusBadge(user.kycStatus)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                      {user.username && (
                        <p className="text-xs text-muted-foreground mt-0.5">@{user.username}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${getTotalBalance(user).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total Balance</p>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="grid gap-3 md:grid-cols-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Deposit</p>
                      <p className="text-sm mt-0.5">${(user.deposit || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Withdrawal</p>
                      <p className="text-sm mt-0.5">${(user.withdrawal || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Joined</p>
                      <p className="text-sm mt-0.5">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUser(user)}
                      disabled={processingId === user._id}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>

                    {user.accountStatus === "active" ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleSuspend(user._id)}
                        disabled={processingId === user._id}
                        className="gap-2"
                      >
                        <Ban className="h-4 w-4" />
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleActivate(user._id)}
                        disabled={processingId === user._id}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Activate
                      </Button>
                    )}

                    {user.kycStatus !== "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateKYC(user._id, "approved")}
                        disabled={processingId === user._id}
                        className="gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Approve KYC
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(user._id, user.email)}
                      disabled={processingId === user._id}
                      className="gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/95 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Status Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Account Status</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Account Status</p>
                      <div className="mt-1">{getAccountStatusBadge(selectedUser.accountStatus)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">KYC Status</p>
                      <div className="mt-1">{getKYCStatusBadge(selectedUser.kycStatus)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Balance Breakdown</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="px-4 py-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground">Deposit</p>
                    <p className="text-lg font-semibold mt-1 text-green-600">
                      ${(selectedUser.deposit || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="px-4 py-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground">Withdrawal</p>
                    <p className="text-lg font-semibold mt-1 text-red-600">
                      ${(selectedUser.withdrawal || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="px-4 py-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground">Bonus</p>
                    <p className="text-lg font-semibold mt-1">
                      ${(selectedUser.bonus || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="px-4 py-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground">Interest</p>
                    <p className="text-lg font-semibold mt-1">
                      ${(selectedUser.interest || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 px-4 py-3 rounded-lg bg-accent-500/10 border border-accent-500/20">
                  <p className="text-xs text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-semibold mt-1">
                    ${getTotalBalance(selectedUser).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Account Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm mt-1">{selectedUser.email}</p>
                      {selectedUser.isEmailVerified && (
                        <Badge variant="success" className="text-xs mt-1">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="text-sm mt-1">
                        {new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
