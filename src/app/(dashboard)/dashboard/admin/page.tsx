"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bankingApi } from "@/lib/banking/api";
import { ShieldCheck, Mail, UserRound, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [pendingTxns, setPendingTxns] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [walletIndex, setWalletIndex] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    fetch("/api/users", headers ? { headers } : {})
      .then((res) => res.json())
      .then((res) => {
        const mapped = (res?.users || res || []).map((u: any) => ({
          id: u._id || u.id,
          name: u.personalInfo?.firstName ? { full: `${u.personalInfo.firstName} ${u.personalInfo.lastName}` } : u.name,
          wallets: u.wallets || [],
          email: u.email,
        }));
        setUsers(mapped);
        setSelectedUser(mapped[0]?.id || "");
        setWalletAddress(mapped[0]?.wallets?.[0]?.address || "");
      })
      .catch(() => setUsers([]));

    fetch("/api/transactions", headers ? { headers } : {})
      .then((res) => res.json())
      .then((data) => setPendingTxns((data || []).filter((t: any) => t.status === "pending")))
      .catch(() => setPendingTxns([]));
  }, [user?.id]);

  const approveTxn = async (id: string) => {
    await bankingApi.approveTxn(id);
    setPendingTxns((prev) => prev.filter((t) => t.id !== id));
  };

  const sendMail = async (id: string) => {
    alert(`Mail sent to ${id}.`);
  };

  const handleWalletSave = async () => {
    if (!selectedUser) return;
    await bankingApi.updateWallet(selectedUser, walletIndex, walletAddress);
    alert("Wallet address updated.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Approve KYC, edit users, and manage pending flows.</p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3 bg-card/60">
            <div>
              <p className="text-xs text-muted-foreground">Users</p>
              <p className="text-2xl font-semibold">{users.length}</p>
            </div>
            <div className="rounded-full p-3 bg-accent-500/10 text-accent-600">
              <UserRound className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3 bg-card/60">
            <div>
              <p className="text-xs text-muted-foreground">Pending KYC</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
            <div className="rounded-full p-3 bg-amber-500/10 text-amber-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3 bg-card/60">
            <div>
              <p className="text-xs text-muted-foreground">Pending Txns</p>
              <p className="text-2xl font-semibold">{pendingTxns.length}</p>
            </div>
            <div className="rounded-full p-3 bg-rose-500/10 text-rose-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </div>

        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Pending transactions</CardTitle>
            <CardDescription>Approve or reject transfers, crypto, and bookings.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-3">
            {pendingTxns.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                No pending transactions.
              </div>
            ) : (
              pendingTxns.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-2 rounded-lg border border-border px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {t.kind} • {t.currency} {t.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Pending</Badge>
                    <Button size="sm" onClick={() => approveTxn(t.id)}>
                      Approve
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Wallet editor</CardTitle>
            <CardDescription>Update deposit addresses per user.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>User</Label>
                <select
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  value={selectedUser}
                  onChange={(e) => {
                    const uid = e.target.value;
                    setSelectedUser(uid);
                    const wallets = users.find((u) => u.id === uid)?.wallets ?? [];
                    setWalletIndex(0);
                    setWalletAddress(wallets[0]?.address ?? "");
                  }}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name?.full || u.id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Wallet slot</Label>
                <select
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  value={walletIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setWalletIndex(idx);
                    const wallet = users.find((u) => u.id === selectedUser)?.wallets?.[idx];
                    setWalletAddress(wallet?.address ?? "");
                  }}
                >
                  {(users.find((u) => u.id === selectedUser)?.wallets ?? []).map((w: any, idx: number) => (
                    <option key={w.address} value={idx}>
                      {w.asset} on {w.chain}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Address</Label>
              <Input
                id="wallet-address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleWalletSave}>Save wallet address</Button>
              <Button variant="ghost" size="icon" onClick={() => sendMail(selectedUser)}>
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
