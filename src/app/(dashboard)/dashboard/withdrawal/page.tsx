"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { AlertCircle, TrendingDown, Clock } from "lucide-react";

export default function WithdrawalPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("ETH");
  const [selectedCoin, setSelectedCoin] = useState("USDC");
  const [submitting, setSubmitting] = useState(false);

  // Balance and withdrawal info
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchBalanceAndWithdrawals();
    }
  }, [user?.id]);

  const fetchBalanceAndWithdrawals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Fetch user balance
      const balanceRes = await fetch(`/api/banking/account/${user?.id}`, { headers });
      const balanceData = await balanceRes.json();

      // Calculate available balance (deposit - withdrawal)
      const balance = (balanceData.deposit || 0) - (balanceData.withdrawal || 0);
      setAvailableBalance(balance);

      // Fetch pending withdrawals
      const withdrawalsRes = await fetch("/api/withdrawals", { headers });
      const withdrawalsData = await withdrawalsRes.json();
      setPendingWithdrawals(
        (withdrawalsData || []).filter((w: any) => w.status === "pending" || w.status === "processing")
      );
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = () => {
    const amt = parseFloat(amount) || 0;
    // Network fee estimation
    const fees: Record<string, number> = {
      ETH: 5, // $5 gas fee
      TRX: 1, // $1 TRX fee
      BSC: 0.5, // $0.50 BNB fee
    };
    return fees[selectedNetwork] || 0;
  };

  const handleWithdrawal = async () => {
    const withdrawalAmount = parseFloat(amount);
    const fee = calculateFee();
    const total = withdrawalAmount + fee;

    if (!amount || withdrawalAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!walletAddress || walletAddress.length < 20) {
      alert("Please enter a valid wallet address");
      return;
    }

    if (total > availableBalance) {
      alert(`Insufficient balance. You need $${total.toFixed(2)} (including $${fee} fee)`);
      return;
    }

    if (withdrawalAmount < 10) {
      alert("Minimum withdrawal amount is $10");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: withdrawalAmount,
          currency: "USD",
          walletAddress,
          network: selectedNetwork,
          coin: selectedCoin,
          userId: user?.id,
          user: {
            id: user?.id,
            email: user?.email,
            name: user?.name?.full || "",
          },
        }),
      });

      if (response.ok) {
        alert("Withdrawal request submitted! We'll process it within 24 hours.");
        setAmount("");
        setWalletAddress("");
        await fetchBalanceAndWithdrawals();
      } else {
        const error = await response.json();
        alert(`Failed to submit withdrawal: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert("Failed to submit withdrawal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "processing":
        return <Badge variant="outline">Processing</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent-500 border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading withdrawal information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Withdraw Funds</h1>
        <p className="text-sm text-muted-foreground mt-1">Withdraw crypto to your external wallet</p>
      </div>

      {/* Balance Display */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-semibold mt-1 text-green-600">${availableBalance.toLocaleString()}</p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Pending Withdrawals</p>
            <p className="text-2xl font-semibold mt-1 text-orange-600">{pendingWithdrawals.length}</p>
          </div>
        </Card>
        <Card variant="glass" padding="lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Network Fee</p>
            <p className="text-2xl font-semibold mt-1">${calculateFee().toFixed(2)}</p>
          </div>
        </Card>
      </div>

      {/* Withdrawal Form */}
      <Card variant="glass" padding="lg" hover="lift">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg">Request Withdrawal</CardTitle>
          <CardDescription>Send funds from your account to your crypto wallet</CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Network</Label>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
              >
                <option value="ETH">Ethereum (ERC-20)</option>
                <option value="TRX">Tron (TRC-20)</option>
                <option value="BSC">BNB Chain (BEP-20)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Coin</Label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
              >
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Amount (USD)</Label>
            <Input
              type="number"
              placeholder="100.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              max={availableBalance}
            />
            <p className="text-xs text-muted-foreground">
              Minimum: $10 | Available: ${availableBalance.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Your {selectedCoin} Wallet Address ({selectedNetwork})</Label>
            <Input
              placeholder={selectedNetwork === "ETH" ? "0x742d35Cc6634C0532..." : "TYDzYx4W9n8Z7M5K..."}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-red-600">
              ⚠ Double-check the address! Sending to wrong address = permanent loss of funds.
            </p>
          </div>

          {/* Fee Breakdown */}
          {amount && parseFloat(amount) > 0 && (
            <div className="rounded-lg border border-dashed border-border px-4 py-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Withdrawal Amount</span>
                <span className="font-semibold">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Network Fee ({selectedNetwork})</span>
                <span className="font-semibold">${calculateFee().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="font-medium">Total Deducted</span>
                <span className="font-bold text-lg">
                  ${(parseFloat(amount) + calculateFee()).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Remaining Balance</span>
                <span className={availableBalance - parseFloat(amount) - calculateFee() < 0 ? "text-red-600" : "text-green-600"}>
                  ${(availableBalance - parseFloat(amount) - calculateFee()).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Warning Box */}
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-amber-600">Important Notice</p>
                <ul className="text-xs text-amber-600/80 space-y-1 list-disc list-inside">
                  <li>Withdrawals are processed within 24 hours</li>
                  <li>Verify network matches your wallet (ETH for ETH address, etc.)</li>
                  <li>Minimum withdrawal: $10</li>
                  <li>Network fees are non-refundable</li>
                  <li>Contact support if not received within 48 hours</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleWithdrawal}
            disabled={submitting || availableBalance <= 0}
          >
            {submitting ? "Submitting..." : "Request Withdrawal"}
          </Button>
        </CardContent>
      </Card>

      {/* Pending Withdrawals */}
      {pendingWithdrawals.length > 0 && (
        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Pending Withdrawals</CardTitle>
            <CardDescription>Withdrawals currently being processed</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6">
            <div className="space-y-3">
              {pendingWithdrawals.map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <TrendingDown className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {withdrawal.currency} {withdrawal.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {withdrawal.network} • {new Date(withdrawal.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(withdrawal.status)}
                    {withdrawal.status === "processing" && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Processing
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
