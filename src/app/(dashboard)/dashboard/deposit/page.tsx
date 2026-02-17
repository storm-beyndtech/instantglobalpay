"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/providers/auth-provider";
import { Wallet, Building, Globe, CheckCircle, Copy } from "lucide-react";
import { toast } from "sonner";

export default function DepositPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("crypto");
  const [utility, setUtility] = useState<any>(null);

  // Pending deposits state
  const [pendingDeposits, setPendingDeposits] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);

  // Crypto deposit state
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("ETH");
  const [selectedCoin, setSelectedCoin] = useState("USDC");
  const [submittingCrypto, setSubmittingCrypto] = useState(false);

  // Bank transfer state
  const [bankAmount, setBankAmount] = useState("");
  const [bankProof, setBankProof] = useState<File | null>(null);
  const [bankReference, setBankReference] = useState("");
  const [submittingBank, setSubmittingBank] = useState(false);

  // Wire transfer state
  const [wireAmount, setWireAmount] = useState("");
  const [wireProof, setWireProof] = useState<File | null>(null);
  const [wireReference, setWireReference] = useState("");
  const [submittingWire, setSubmittingWire] = useState(false);

  // Platform wallet addresses from utility settings
  const getWalletAddress = (network: string, coin: string) => {
    const matches = (utility?.coins || []).find(
      (c: any) =>
        String(c.network || "").toUpperCase() === String(network).toUpperCase() &&
        String(c.name || "").toUpperCase() === String(coin).toUpperCase()
    );
    return matches?.address || "";
  };

  // Fetch pending deposits on mount
  const fetchPendingDeposits = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/deposits", { headers });
      if (response.ok) {
        const data = await response.json();
        // Filter for pending deposits belonging to current user
        const userPending = data.filter(
          (d: any) =>
            d.status === "pending" &&
            (d.user?.id === user?.id || d.user?._id === user?.id)
        );
        setPendingDeposits(userPending);
      }
    } catch (error) {
      console.error("Failed to fetch pending deposits:", error);
    } finally {
      setLoadingPending(false);
    }
  };

  // Cancel/delete a pending deposit
  const handleCancelDeposit = async (depositId: string) => {
    if (!window.confirm("Are you sure you want to cancel this deposit request?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/deposits/${depositId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        toast.success("Deposit request cancelled successfully");
        // Refresh pending deposits
        fetchPendingDeposits();
      } else {
        const error = await response.json();
        toast.error(`Failed to cancel: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Cancel deposit error:", error);
      toast.error("Failed to cancel deposit");
    }
  };

  // Fetch pending deposits when user is available
  useEffect(() => {
    if (user?.id) {
      fetchPendingDeposits();
    }
  }, [user?.id]);

  useEffect(() => {
    const loadUtility = async () => {
      try {
        const res = await fetch("/api/utils");
        const data = await res.json();
        setUtility(data || null);
      } catch (error) {
        console.error("Failed to load utility settings:", error);
      }
    };
    loadUtility();
  }, []);

  const handleCryptoDeposit = async () => {
    if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setSubmittingCrypto(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/deposits", {
        method: "POST",
        headers,
        body: JSON.stringify({
          id: user?.id,
          amount: parseFloat(cryptoAmount),
          coinName: selectedCoin,
          network: selectedNetwork,
          address: getWalletAddress(selectedNetwork, selectedCoin),
          convertedAmount: parseFloat(cryptoAmount),
        }),
      });

      if (response.ok) {
        toast.success("Crypto deposit submitted! Admin will approve after blockchain confirmation.");
        setCryptoAmount("");
        fetchPendingDeposits(); // Refresh pending deposits list
      } else {
        const error = await response.json();
        toast.error(`Failed to submit deposit: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Crypto deposit error:", error);
      toast.error("Failed to submit deposit. Please try again.");
    } finally {
      setSubmittingCrypto(false);
    }
  };

  const handleBankDeposit = async () => {
    if (!bankAmount || !bankProof || !bankReference) {
      toast.error("Please fill in all fields and upload proof of payment");
      return;
    }

    setSubmittingBank(true);
    try {
      const formData = new FormData();
      formData.append("amount", bankAmount);
      formData.append("currency", "USD");
      formData.append("method", "bank_transfer");
      formData.append("reference", bankReference);
      formData.append("proof", bankProof);
      formData.append("userId", user?.id || "");
      formData.append("userEmail", user?.email || "");
      formData.append("userName", user?.name?.full || "");

      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/deposits", {
        method: "POST",
        headers,
        body: formData,
      });

      if (response.ok) {
        toast.success("Bank deposit submitted! Admin will verify and approve.");
        setBankAmount("");
        setBankProof(null);
        setBankReference("");
        fetchPendingDeposits(); // Refresh pending deposits list
      } else {
        const error = await response.json();
        toast.error(`Failed to submit: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Bank deposit error:", error);
      toast.error("Failed to submit deposit.");
    } finally {
      setSubmittingBank(false);
    }
  };

  const handleWireDeposit = async () => {
    if (!wireAmount || !wireProof || !wireReference) {
      toast.error("Please fill in all fields and upload proof of payment");
      return;
    }

    setSubmittingWire(true);
    try {
      const formData = new FormData();
      formData.append("amount", wireAmount);
      formData.append("currency", "USD");
      formData.append("method", "wire_transfer");
      formData.append("reference", wireReference);
      formData.append("proof", wireProof);
      formData.append("userId", user?.id || "");
      formData.append("userEmail", user?.email || "");
      formData.append("userName", user?.name?.full || "");

      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/deposits", {
        method: "POST",
        headers,
        body: formData,
      });

      if (response.ok) {
        toast.success("Wire transfer submitted! Admin will verify and approve.");
        setWireAmount("");
        setWireProof(null);
        setWireReference("");
        fetchPendingDeposits(); // Refresh pending deposits list
      } else {
        const error = await response.json();
        toast.error(`Failed to submit: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Wire deposit error:", error);
      toast.error("Failed to submit deposit.");
    } finally {
      setSubmittingWire(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Deposit Funds</h1>
        <p className="text-sm text-muted-foreground mt-1">Add funds to your account via crypto, bank, or wire transfer</p>
      </div>

      {/* Pending Deposits Section */}
      {!loadingPending && pendingDeposits.length > 0 && (
        <Card variant="glass" padding="lg" className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="warning">Pending</Badge>
              You have {pendingDeposits.length} pending deposit{pendingDeposits.length > 1 ? "s" : ""}
            </CardTitle>
            <CardDescription>
              You can cancel pending deposits to create new ones
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4 space-y-3">
            {pendingDeposits.map((deposit) => (
              <div
                key={deposit._id || deposit.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {deposit.walletData?.coinName || "USD"} {deposit.amount?.toLocaleString()}
                    </span>
                    {deposit.walletData?.network && (
                      <Badge variant="outline" className="text-xs">
                        {deposit.walletData.network}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Submitted on {new Date(deposit.date || deposit.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelDeposit(deposit._id || deposit.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crypto" className="gap-2">
            <Wallet className="h-4 w-4" />
            Crypto
          </TabsTrigger>
          <TabsTrigger value="bank" className="gap-2">
            <Building className="h-4 w-4" />
            Bank Transfer
          </TabsTrigger>
          <TabsTrigger value="wire" className="gap-2">
            <Globe className="h-4 w-4" />
            Wire Transfer
          </TabsTrigger>
        </TabsList>

        {/* Crypto Deposit */}
        <TabsContent value="crypto" className="mt-6">
          <Card variant="glass" padding="lg" hover="lift">
            <CardHeader className="p-0 space-y-2">
              <CardTitle className="text-lg">Crypto Deposit</CardTitle>
              <CardDescription>Send crypto to our wallet address and we'll credit your account</CardDescription>
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
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(e.target.value)}
                  min="10"
                />
              </div>

              {/* Platform Wallet Address */}
              <div className="rounded-lg border border-border p-4 space-y-2 bg-accent/5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Send {selectedCoin} to this address:</Label>
                  <Badge variant="outline">{selectedNetwork}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono bg-muted px-3 py-2 rounded truncate">
                    {getWalletAddress(selectedNetwork, selectedCoin) || "Address not available"}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(getWalletAddress(selectedNetwork, selectedCoin) || "")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠ Make sure to send only {selectedCoin} on {selectedNetwork} network. Sending other coins or wrong network may result in loss of funds.
                </p>
              </div>

              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                <p className="text-xs text-blue-600">
                  <strong>Next steps:</strong> After sending crypto, submit this form. We'll detect the transaction on the blockchain and credit your account once confirmed.
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleCryptoDeposit}
                disabled={submittingCrypto || !cryptoAmount}
              >
                {submittingCrypto ? "Submitting..." : "I've Sent the Crypto - Submit Deposit"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Transfer */}
        <TabsContent value="bank" className="mt-6">
          <Card variant="glass" padding="lg" hover="lift">
            <CardHeader className="p-0 space-y-2">
              <CardTitle className="text-lg">Bank Transfer (ACH)</CardTitle>
              <CardDescription>Transfer from your bank account to ours</CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-6 space-y-4">
              {/* Platform Bank Details */}
              <div className="rounded-lg border border-border p-4 space-y-3 bg-accent/5">
                <p className="text-sm font-medium">Our Bank Details:</p>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-medium">{utility?.bankDetails?.bankName || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-mono">{utility?.bankDetails?.accountNumber || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Routing Number:</span>
                    <span className="font-mono">{utility?.bankDetails?.routingNumber || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-medium">{utility?.bankDetails?.accountName || "Not set"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <Input
                  type="number"
                  placeholder="500.00"
                  value={bankAmount}
                  onChange={(e) => setBankAmount(e.target.value)}
                  min="50"
                />
              </div>

              <div className="space-y-2">
                <Label>Transfer Reference (from your bank)</Label>
                <Input
                  placeholder="e.g., REF123456 or Transaction ID"
                  value={bankReference}
                  onChange={(e) => setBankReference(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Proof of Payment</Label>
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setBankProof(e.target.files?.[0] || null)}
                />
                {bankProof && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {bankProof.name}
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                onClick={handleBankDeposit}
                disabled={submittingBank}
              >
                {submittingBank ? "Submitting..." : "Submit Bank Deposit"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wire Transfer */}
        <TabsContent value="wire" className="mt-6">
          <Card variant="glass" padding="lg" hover="lift">
            <CardHeader className="p-0 space-y-2">
              <CardTitle className="text-lg">Wire Transfer (International)</CardTitle>
              <CardDescription>International wire transfer to our account</CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-6 space-y-4">
              {/* Platform Wire Details */}
              <div className="rounded-lg border border-border p-4 space-y-3 bg-accent/5">
                <p className="text-sm font-medium">Wire Transfer Details:</p>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-medium">{utility?.bankDetails?.bankName || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SWIFT/BIC:</span>
                    <span className="font-mono">{utility?.bankDetails?.swift || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IBAN:</span>
                    <span className="font-mono">{utility?.bankDetails?.iban || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-medium">{utility?.bankDetails?.accountName || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Address:</span>
                    <span className="font-medium">{utility?.bankDetails?.bankAddress || "Not set"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <Input
                  type="number"
                  placeholder="1000.00"
                  value={wireAmount}
                  onChange={(e) => setWireAmount(e.target.value)}
                  min="100"
                />
              </div>

              <div className="space-y-2">
                <Label>Wire Reference Number</Label>
                <Input
                  placeholder="e.g., WIRE202512345"
                  value={wireReference}
                  onChange={(e) => setWireReference(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Wire Confirmation</Label>
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setWireProof(e.target.files?.[0] || null)}
                />
                {wireProof && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {wireProof.name}
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <p className="text-xs text-amber-600">
                  <strong>Note:</strong> International wire transfers may take 3-5 business days to process. Additional fees may apply from your bank.
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleWireDeposit}
                disabled={submittingWire}
              >
                {submittingWire ? "Submitting..." : "Submit Wire Transfer"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
