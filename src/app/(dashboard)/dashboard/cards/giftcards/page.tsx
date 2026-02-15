"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Gift, Loader2, RefreshCw, Copy, DollarSign } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { giftcardsApi, bankingApi, type GiftCardResponse } from "@/lib/banking/api";

// Gift card issuance fee
const GIFT_CARD_FEE = Number(process.env.NEXT_PUBLIC_GIFT_CARD_FEE) || 4.5;

export default function GiftCardsPage() {
  const { user } = useAuth();
  const [giftcards, setGiftcards] = useState<GiftCardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [amount, setAmount] = useState("50");
  const [recipient, setRecipient] = useState("");
  const [redeemCode, setRedeemCode] = useState("");

  const loadData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [giftcardsData, accountData] = await Promise.all([
        giftcardsApi.list(),
        bankingApi.getAccount(user.id),
      ]);

      setGiftcards(giftcardsData.giftcards || []);
      setAccountBalance(accountData.balance || 0);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load gift cards. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleIssue = async () => {
    const amt = Number(amount);

    if (isNaN(amt) || amt < 10) {
      toast.error("Minimum gift card amount is $10");
      return;
    }

    if (amt > 1000) {
      toast.error("Maximum gift card amount is $1,000");
      return;
    }

    const totalCost = amt + GIFT_CARD_FEE;

    if (totalCost > accountBalance) {
      toast.error(
        `Insufficient balance. You need $${totalCost.toFixed(2)} but only have $${accountBalance.toFixed(2)}`
      );
      return;
    }

    setIssuing(true);

    try {
      const response = await giftcardsApi.issue({
        amount: amt,
        recipient: recipient || undefined,
      });

      setGiftcards((prev) => [response.giftcard, ...prev]);
      setAccountBalance(response.newBalance);
      setAmount("50");
      setRecipient("");

      toast.success(
        `Gift card issued for $${amt.toFixed(2)}! Code: ${response.giftcard.code}`
      );
    } catch (error: any) {
      console.error("Gift card issuance error:", error);
      const message = error.message || "Failed to issue gift card";
      try {
        const parsed = JSON.parse(message);
        toast.error(parsed.message || message);
      } catch {
        toast.error(message);
      }
    } finally {
      setIssuing(false);
    }
  };

  const handleRedeem = async () => {
    if (!redeemCode.trim()) {
      toast.error("Enter a gift card code");
      return;
    }

    setRedeeming(true);

    try {
      const response = await giftcardsApi.redeem(redeemCode.trim());

      setAccountBalance(response.newBalance);
      setRedeemCode("");

      // Refresh list to update status
      loadData();

      toast.success(`Gift card redeemed! $${response.amount.toFixed(2)} added to your account.`);
    } catch (error: any) {
      console.error("Gift card redemption error:", error);
      const message = error.message || "Failed to redeem gift card";
      try {
        const parsed = JSON.parse(message);
        toast.error(parsed.message || message);
      } catch {
        toast.error(message);
      }
    } finally {
      setRedeeming(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const totalCost = Number(amount || 0) + GIFT_CARD_FEE;
  const insufficientBalance = totalCost > accountBalance;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent-500" />
          <p className="text-sm text-muted-foreground">Loading gift cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Gift Cards</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Issue branded gift cards without collecting cardholder details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className="text-lg font-semibold">${accountBalance.toLocaleString()}</p>
          </div>
          <Button variant="outline" size="icon" onClick={loadData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Issue Gift Card */}
      <Card variant="glass" padding="lg" hover="lift">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg">Issue Gift Card</CardTitle>
          <CardDescription>Create a gift card code for a recipient</CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="10"
                  max="1000"
                  placeholder="50"
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Min: $10 • Max: $1,000
              </p>
            </div>
            <div className="space-y-2">
              <Label>Recipient email (optional)</Label>
              <Input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="recipient@example.com"
              />
              <p className="text-xs text-muted-foreground">
                Keep blank to issue without binding to email.
              </p>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="rounded-xl bg-accent-500/5 border border-accent-500/20 p-4 space-y-3">
            <p className="font-medium text-sm">Cost Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gift Card Value</span>
                <span>${Number(amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issuance Fee</span>
                <span>${GIFT_CARD_FEE.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-accent-600">${totalCost.toFixed(2)}</span>
              </div>
            </div>
            {insufficientBalance && (
              <p className="text-xs text-red-500 mt-2">
                Insufficient balance. You need ${(totalCost - accountBalance).toFixed(2)} more.
              </p>
            )}
          </div>

          <Button
            onClick={handleIssue}
            className="w-full gap-2"
            disabled={issuing || insufficientBalance || Number(amount) < 10}
          >
            {issuing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Issuing...
              </>
            ) : (
              <>
                <Gift className="h-4 w-4" />
                Issue Gift Card - ${totalCost.toFixed(2)}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Redeem Gift Card */}
      <Card variant="glass" padding="lg" hover="lift">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg">Redeem Gift Card</CardTitle>
          <CardDescription>Enter a gift card code to add funds to your account</CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6 space-y-4">
          <div className="flex gap-3">
            <Input
              type="text"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
              placeholder="Enter gift card code"
              className="font-mono uppercase"
              maxLength={8}
            />
            <Button onClick={handleRedeem} disabled={redeeming || !redeemCode.trim()}>
              {redeeming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Redeem"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issued Gift Cards */}
      {giftcards.length > 0 && (
        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Your Gift Cards</CardTitle>
            <CardDescription>Track active and redeemed cards</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-3">
            {giftcards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono font-semibold">{card.code}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyCode(card.code)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${card.amount.toFixed(2)}
                    {card.recipient ? ` • ${card.recipient}` : ""}
                  </p>
                  {card.expiresAt && (
                    <p className="text-xs text-muted-foreground">
                      Expires: {new Date(card.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge
                  variant={
                    card.status === "active"
                      ? "success"
                      : card.status === "redeemed"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {card.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {giftcards.length === 0 && (
        <Card variant="glass" padding="lg">
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent-500/10 flex items-center justify-center">
              <Gift className="h-8 w-8 text-accent-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No Gift Cards Yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Issue your first gift card to share with friends and family
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
