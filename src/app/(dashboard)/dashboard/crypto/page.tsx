"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bankingApi } from "@/lib/banking/api";
import { Copy, Clock } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export default function CryptoPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("250");
  const [address, setAddress] = useState("");
  const [wallets, setWallets] = useState<{ chain: string; asset: string; address: string; label?: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    bankingApi
      .getAccount(user.id)
      .then((res) => {
        setWallets(res.wallets || []);
        setAddress(res.wallets?.[0]?.address || "");
      })
      .catch((err) => setError(err.message || "Failed to load wallets"));
  }, [user?.id]);

  const handleCopy = (addr: string) => navigator.clipboard?.writeText(addr).catch(() => {});

  const handleDeposit = async () => {
    if (!user?.id) return;
    await bankingApi.crypto("deposit", { userId: user.id, amount: Number(amount), address, chain: "ETH", currency: "USDC" });
    alert("Deposit submitted and marked pending until admin approval.");
  };

  const handleWithdraw = async () => {
    if (!user?.id) return;
    await bankingApi.crypto("withdraw", { userId: user.id, amount: Number(amount), address, chain: "ETH", currency: "USDC" });
    alert("Withdrawal submitted and marked pending until admin approval.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Crypto On/Off Ramp</h1>
        <p className="text-sm text-muted-foreground mt-1">Deposit and withdraw crypto with manual approvals.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Deposit crypto</CardTitle>
            <CardDescription>Funds stay pending until approved by admin.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="grid gap-3">
              {wallets.map((wallet) => (
                <div
                  key={wallet.address}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-sm">{wallet.asset} on {wallet.chain}</p>
                    <p className="text-xs text-muted-foreground">{wallet.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{wallet.label ?? "Deposit"}</Badge>
                    <Button size="icon" variant="ghost" onClick={() => handleCopy(wallet.address)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USDC)</Label>
              <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleDeposit}>
              Mark deposit pending
            </Button>
          </CardContent>
        </Card>

        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Withdraw crypto</CardTitle>
            <CardDescription>Pending status until admin clears the chain payout.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-address">Destination address</Label>
              <Input
                id="withdraw-address"
                placeholder="0xDestination..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (USDC)</Label>
              <Input id="withdraw-amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              Withdrawals remain pending until an admin approves and settles with vendors manually.
            </div>
            <Button className="w-full" variant="subtle" onClick={handleWithdraw}>
              Request withdrawal (pending)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
