"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { bankingApi } from "@/lib/banking/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

export default function TransfersPage() {
  const { user } = useAuth();
  const [feePercent, setFeePercent] = useState(2.5);
  const [internalAmount, setInternalAmount] = useState("150");
  const [externalAmount, setExternalAmount] = useState("1000");
  const [externalMemo, setExternalMemo] = useState("Invoice settlement");

  // Email lookup state
  const [recipientEmail, setRecipientEmail] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [recipientVerified, setRecipientVerified] = useState(false);
  const [recipientData, setRecipientData] = useState<{
    id: string;
    name: string;
    email: string;
    accountNumber: string;
  } | null>(null);
  const [lookupError, setLookupError] = useState("");

  useEffect(() => {
    setFeePercent(Number(process.env.NEXT_PUBLIC_EXTERNAL_TRANSFER_FEE_PERCENT || 2.5));
  }, []);

  const externalFee = useMemo(() => {
    const amt = Number(externalAmount) || 0;
    return Math.max(amt * (feePercent / 100), 0);
  }, [externalAmount, feePercent]);

  const handleVerifyRecipient = async () => {
    if (!recipientEmail || !recipientEmail.includes("@")) {
      setLookupError("Please enter a valid email address");
      return;
    }

    // Don't allow self-transfers
    if (recipientEmail.toLowerCase() === user?.email?.toLowerCase()) {
      setLookupError("You cannot transfer to yourself");
      return;
    }

    setLookingUp(true);
    setLookupError("");
    setRecipientVerified(false);
    setRecipientData(null);

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/users/lookup?email=${encodeURIComponent(recipientEmail)}`, {
        headers,
      });

      const data = await response.json();

      if (data.exists && data.user) {
        setRecipientVerified(true);
        setRecipientData(data.user);
        setLookupError("");
      } else {
        setLookupError(data.message || "Recipient not found");
        setRecipientVerified(false);
        setRecipientData(null);
      }
    } catch (error) {
      console.error("Recipient lookup error:", error);
      setLookupError("Failed to verify recipient. Please try again.");
      setRecipientVerified(false);
      setRecipientData(null);
    } finally {
      setLookingUp(false);
    }
  };

  const handleClearRecipient = () => {
    setRecipientEmail("");
    setRecipientVerified(false);
    setRecipientData(null);
    setLookupError("");
  };

  const handleInternal = () => {
    if (!user?.id) return;
    if (!recipientVerified || !recipientData) {
      alert("Please verify the recipient first");
      return;
    }

    bankingApi.internalTransfer({
      fromUserId: user.id,
      toUserId: recipientData.id,
      amount: Number(internalAmount) || 0,
      currency: "USD",
      memo: `Internal transfer to ${recipientData.name}`,
    });
    alert("Internal transfer submitted. Fee: $0.00");

    // Reset form
    handleClearRecipient();
    setInternalAmount("150");
  };

  const handleExternal = () => {
    if (!user?.id) return;
    bankingApi.externalTransfer({
      userId: user.id,
      amount: Number(externalAmount) || 0,
      currency: "USD",
      memo: externalMemo,
      beneficiary: "External Beneficiary",
      bankDetails: {},
    });
    alert(`External transfer submitted. Fee: $${externalFee.toFixed(2)}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Transfers</h1>
        <p className="text-sm text-muted-foreground mt-1">Internal and external rails with fee transparency.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Internal Transfer (platform users)</CardTitle>
            <CardDescription>Instant, zero-fee transfers between users on InstantGlobal.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <div className="flex gap-2">
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="recipient@example.com"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    if (recipientVerified) {
                      setRecipientVerified(false);
                      setRecipientData(null);
                    }
                  }}
                  disabled={lookingUp || recipientVerified}
                  className={cn(
                    recipientVerified && "border-green-500 bg-green-500/5",
                    lookupError && "border-red-500"
                  )}
                />
                {!recipientVerified ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyRecipient}
                    disabled={lookingUp || !recipientEmail}
                  >
                    {lookingUp ? "Verifying..." : "Verify"}
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={handleClearRecipient}>
                    Change
                  </Button>
                )}
              </div>
              {lookupError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <span>⚠</span> {lookupError}
                </p>
              )}
              {recipientVerified && recipientData && (
                <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        {recipientData.name}
                      </p>
                      <p className="text-xs text-green-600/80 dark:text-green-400/80">
                        Account: {recipientData.accountNumber}
                      </p>
                    </div>
                    <Badge variant="success">Verified</Badge>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                value={internalAmount}
                onChange={(e) => setInternalAmount(e.target.value)}
                placeholder="150.00"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-3 text-sm">
              <span className="text-muted-foreground">Fee</span>
              <Badge variant="success">0.00 USD</Badge>
            </div>
            <Button
              className="w-full"
              onClick={handleInternal}
              disabled={!recipientVerified || !recipientData}
            >
              {!recipientVerified ? "Verify recipient first" : "Submit internal transfer"}
            </Button>
          </CardContent>
        </Card>

        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">External Transfer (wire)</CardTitle>
            <CardDescription>Premium routing with heavy fee applied for compliance.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="beneficiary-name">Beneficiary name</Label>
                <Input id="beneficiary-name" placeholder="Recipient Business Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiary-account">Account / IBAN</Label>
                <Input id="beneficiary-account" placeholder="GB29 NWBK 6016 1331 9268 19" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiary-routing">Routing / SWIFT</Label>
                <Input id="beneficiary-routing" placeholder="BOFAUS3N" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="external-amount">Amount (USD)</Label>
                <Input
                  id="external-amount"
                  value={externalAmount}
                  onChange={(e) => setExternalAmount(e.target.value)}
                  placeholder="1000.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="memo">Transfer memo</Label>
              <Input
                id="memo"
                value={externalMemo}
                onChange={(e) => setExternalMemo(e.target.value)}
                placeholder="Invoice settlement"
              />
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Heavy fee applied</span>
                <span className="font-semibold">{feePercent}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Estimated fee</span>
                <span className="font-semibold text-foreground">${externalFee.toFixed(2)}</span>
              </div>
            </div>
            <div className={cn("rounded-lg px-4 py-3 text-xs", "bg-amber-500/10 border border-amber-500/30")}>
              External transfers settle manually; a success modal confirms submission while treasury handles vendor
              settlement.
            </div>
            <Button className="w-full" variant="destructive" onClick={handleExternal}>
              Submit external transfer with fee
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
