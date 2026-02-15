"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { VirtualCard } from "@/components/dashboard/virtual-card";
import { useAuth } from "@/components/providers/auth-provider";
import { CreditCard, Plus, Loader2, DollarSign, RefreshCw } from "lucide-react";
import { cardsApi, bankingApi, type CardResponse, type CardDetails } from "@/lib/banking/api";
import { toast } from "sonner";

// Card issuance fee in USD
const CARD_ISSUANCE_FEE = Number(process.env.NEXT_PUBLIC_VIRTUAL_CARD_FEE) || 49;

interface CardType {
  id: "standard" | "premium" | "business";
  name: string;
  description: string;
  fundingMin: number;
  fundingMax: number;
  features: string[];
}

const cardTypes: CardType[] = [
  {
    id: "standard",
    name: "Standard Card",
    description: "Perfect for everyday online purchases",
    fundingMin: 50,
    fundingMax: 2500,
    features: ["$2,500 daily limit", "Online purchases", "Subscription payments"],
  },
  {
    id: "premium",
    name: "Premium Card",
    description: "Higher limits for power users",
    fundingMin: 100,
    fundingMax: 10000,
    features: ["$10,000 daily limit", "Priority support", "Extended coverage"],
  },
  {
    id: "business",
    name: "Business Card",
    description: "Enterprise-grade virtual cards",
    fundingMin: 500,
    fundingMax: 50000,
    features: ["$50,000 daily limit", "Team management", "Expense tracking"],
  },
];

export default function CardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<CardResponse[]>([]);
  const [selectedCardDetails, setSelectedCardDetails] = useState<CardDetails | null>(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [fundingAmount, setFundingAmount] = useState<string>("100");
  const [cardLabel, setCardLabel] = useState("");
  const [selectedType, setSelectedType] = useState<CardType>(cardTypes[0]);
  const [issuing, setIssuing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [viewingCardId, setViewingCardId] = useState<string | null>(null);

  // Load cards and balance
  const loadData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [cardsData, accountData] = await Promise.all([
        cardsApi.list(),
        bankingApi.getAccount(user.id),
      ]);

      setCards(cardsData.cards || []);
      setAccountBalance(accountData.balance || 0);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load cards. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleIssueCard = async () => {
    const amount = Number(fundingAmount);

    if (isNaN(amount) || amount < selectedType.fundingMin) {
      toast.error(`Minimum funding amount is $${selectedType.fundingMin}`);
      return;
    }

    if (amount > selectedType.fundingMax) {
      toast.error(`Maximum funding amount is $${selectedType.fundingMax.toLocaleString()}`);
      return;
    }

    const totalCost = amount + CARD_ISSUANCE_FEE;

    if (totalCost > accountBalance) {
      toast.error(`Insufficient balance. You need $${totalCost.toLocaleString()} but only have $${accountBalance.toLocaleString()}`);
      return;
    }

    if (!user?.id) {
      toast.error("Please log in to issue a card");
      return;
    }

    setIssuing(true);

    try {
      const response = await cardsApi.issue({
        fundingAmount: amount,
        purpose: selectedType.id,
        label: cardLabel || `${selectedType.name}`,
        color: selectedType.id === "business" ? "blue" : selectedType.id === "premium" ? "gold" : "purple",
        brand: "visa",
      });

      // Update cards list
      setCards((prev) => [response.card, ...prev]);
      setAccountBalance(response.newBalance);

      // Reset form
      setShowIssueForm(false);
      setFundingAmount("100");
      setCardLabel("");
      setSelectedType(cardTypes[0]);

      toast.success(`${selectedType.name} issued successfully! Card funded with $${amount.toLocaleString()}`);
    } catch (error: any) {
      console.error("Card issuance error:", error);
      const message = error.message || "Failed to issue card";
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

  const handleViewDetails = async (cardId: string) => {
    try {
      setViewingCardId(cardId);
      const details = await cardsApi.getDetails(cardId);
      setSelectedCardDetails(details);
    } catch (error) {
      toast.error("Failed to load card details");
    } finally {
      setViewingCardId(null);
    }
  };

  const handleToggleFreeze = async (cardId: string) => {
    try {
      const response = await cardsApi.toggleFreeze(cardId);
      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, status: response.status } : card
        )
      );
      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to update card status");
    }
  };

  const handleCancelCard = async (cardId: string) => {
    if (!confirm("Are you sure you want to cancel this card? Any remaining balance will be refunded.")) {
      return;
    }

    try {
      const response = await cardsApi.cancel(cardId);
      setCards((prev) => prev.filter((card) => card.id !== cardId));
      setAccountBalance(response.accountBalance);
      setSelectedCardDetails(null);
      toast.success(`Card cancelled. $${response.refundedAmount.toLocaleString()} refunded to your account.`);
    } catch (error) {
      toast.error("Failed to cancel card");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent-500" />
          <p className="text-sm text-muted-foreground">Loading your cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Virtual Cards</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Issue and manage your virtual payment cards
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
          <Button variant="outline" asChild>
            <Link href="/dashboard/cards/giftcards">Gift Cards</Link>
          </Button>
          <Button onClick={() => setShowIssueForm(!showIssueForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Issue New Card
          </Button>
        </div>
      </div>

      {/* Issue New Card Form */}
      {showIssueForm && (
        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Issue New Virtual Card</CardTitle>
            <CardDescription>
              Create a new virtual Visa card for online payments.
              Issuance fee: <span className="font-semibold text-accent-600">${CARD_ISSUANCE_FEE}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-6">
            {/* Card Type Selection */}
            <div className="space-y-3">
              <Label>Card Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cardTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type);
                      if (Number(fundingAmount) < type.fundingMin) {
                        setFundingAmount(String(type.fundingMin));
                      }
                    }}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      selectedType.id === type.id
                        ? "border-accent-500 bg-accent-500/10"
                        : "border-border hover:border-accent-500/50"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{type.name}</p>
                        {type.id === "premium" && (
                          <Badge variant="outline" className="text-xs">Popular</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                      <div className="pt-2 space-y-1">
                        {type.features.map((feature, i) => (
                          <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="text-accent-500">✓</span> {feature}
                          </p>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground pt-2">
                        Fund: ${type.fundingMin.toLocaleString()} - ${type.fundingMax.toLocaleString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Funding Amount */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Funding Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder={String(selectedType.fundingMin)}
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    min={selectedType.fundingMin}
                    max={selectedType.fundingMax}
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Min: ${selectedType.fundingMin.toLocaleString()} • Max: ${selectedType.fundingMax.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Card Label (Optional)</Label>
                <Input
                  placeholder="e.g., Shopping, Subscriptions"
                  value={cardLabel}
                  onChange={(e) => setCardLabel(e.target.value)}
                  maxLength={30}
                />
                <p className="text-xs text-muted-foreground">
                  Help identify this card
                </p>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="rounded-xl bg-accent-500/5 border border-accent-500/20 p-4 space-y-3">
              <p className="font-medium text-sm">Cost Summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Card Funding</span>
                  <span>${Number(fundingAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issuance Fee</span>
                  <span>${CARD_ISSUANCE_FEE}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-accent-600">
                    ${(Number(fundingAmount || 0) + CARD_ISSUANCE_FEE).toLocaleString()}
                  </span>
                </div>
              </div>
              {Number(fundingAmount || 0) + CARD_ISSUANCE_FEE > accountBalance && (
                <p className="text-xs text-red-500 mt-2">
                  ⚠️ Insufficient balance. You need ${(Number(fundingAmount || 0) + CARD_ISSUANCE_FEE - accountBalance).toLocaleString()} more.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={handleIssueCard}
                disabled={issuing || Number(fundingAmount || 0) + CARD_ISSUANCE_FEE > accountBalance}
              >
                {issuing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Issuing Card...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Issue Card - ${(Number(fundingAmount || 0) + CARD_ISSUANCE_FEE).toLocaleString()}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowIssueForm(false)} disabled={issuing}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card Details Modal */}
      {selectedCardDetails && (
        <Card variant="glass" padding="lg" className="border-2 border-accent-500/30">
          <CardHeader className="p-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Card Details</CardTitle>
              <CardDescription>Sensitive information - keep secure</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedCardDetails(null)}>
              Close
            </Button>
          </CardHeader>
          <CardContent className="p-0 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Card Number</p>
                  <p className="font-mono text-lg tracking-wider">{selectedCardDetails.cardNumber}</p>
                </div>
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-muted-foreground">Expiry</p>
                    <p className="font-mono">{selectedCardDetails.expiryMonth}/{selectedCardDetails.expiryYear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CVV</p>
                    <p className="font-mono">{selectedCardDetails.cvv}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cardholder</p>
                  <p className="font-semibold">{selectedCardDetails.cardholderName}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Card Balance</p>
                  <p className="text-2xl font-semibold">${selectedCardDetails.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Spending Limit</p>
                  <p>${selectedCardDetails.spendingLimit.toLocaleString()}</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFreeze(selectedCardDetails.id)}
                  >
                    {selectedCardDetails.status === "frozen" ? "Unfreeze" : "Freeze"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleCancelCard(selectedCardDetails.id)}
                  >
                    Cancel Card
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards List */}
      {cards.length === 0 ? (
        <Card variant="glass" padding="lg">
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent-500/10 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-accent-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No Cards Issued Yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Issue your first virtual card to start making online payments
              </p>
            </div>
            <Button onClick={() => setShowIssueForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Issue Your First Card
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} variant="glass" padding="lg" hover="lift" className="relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={card.status === "active" ? "success" : card.status === "frozen" ? "warning" : "outline"}
                  >
                    {card.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground uppercase">{card.brand}</span>
                </div>

                <div>
                  <p className="font-mono text-lg tracking-wider">{card.maskedNumber}</p>
                  <p className="text-sm text-muted-foreground mt-1">{card.cardholderName}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Expires</p>
                    <p className="font-mono">{card.expiryMonth}/{card.expiryYear}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className="font-semibold">${card.balance.toLocaleString()}</p>
                  </div>
                </div>

                {card.metadata?.label && (
                  <p className="text-xs text-muted-foreground">{card.metadata.label}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(card.id)}
                    disabled={viewingCardId === card.id}
                  >
                    {viewingCardId === card.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "View Details"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFreeze(card.id)}
                    disabled={card.status === "cancelled"}
                  >
                    {card.status === "frozen" ? "Unfreeze" : "Freeze"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
