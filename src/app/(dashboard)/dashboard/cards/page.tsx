"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { VirtualCard } from "@/components/dashboard/virtual-card";
import { useAuth } from "@/components/providers/auth-provider";
import { CreditCard, Plus, Loader2 } from "lucide-react";

interface IssuedCard {
  id: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  type: "standard" | "premium";
  status: "active" | "frozen" | "pending";
  createdAt: Date;
}

export default function CardsPage() {
  const { user } = useAuth();
  const [issuedCards, setIssuedCards] = useState<IssuedCard[]>([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [selectedType, setSelectedType] = useState<"standard" | "premium">("standard");
  const [issuing, setIssuing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fees = {
    standard: 49,
    premium: 99,
  };

  // Load issued cards from API
  useEffect(() => {
    loadIssuedCards();
  }, []);

  const loadIssuedCards = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // TODO: Replace with actual API endpoint
      // const response = await fetch("/api/cards", { headers });
      // const data = await response.json();
      // setIssuedCards(data.cards || []);

      // For now, load from localStorage or show empty
      const savedCards = localStorage.getItem(`cards_${user?.id}`);
      if (savedCards) {
        setIssuedCards(JSON.parse(savedCards));
      }
    } catch (error) {
      console.error("Failed to load cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCardNumber = () => {
    // Generate a valid-looking card number (for demo purposes)
    const prefix = "4532"; // Visa prefix
    const randomDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
    return prefix + randomDigits;
  };

  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  const generateExpiryDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 3);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${year}`;
  };

  const handleIssueCard = async () => {
    if (!cardholderName || cardholderName.trim().length < 3) {
      alert("Please enter a valid cardholder name (minimum 3 characters)");
      return;
    }

    if (!user?.id) {
      alert("Please log in to issue a card");
      return;
    }

    setIssuing(true);

    try {
      const newCard: IssuedCard = {
        id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        cardNumber: generateCardNumber(),
        cardholderName: cardholderName.toUpperCase(),
        expiryDate: generateExpiryDate(),
        cvv: generateCVV(),
        type: selectedType,
        status: "active",
        createdAt: new Date(),
      };

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Call backend API to create transaction for card fee
      const response = await fetch("/api/banking/virtualCard", {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: user.id,
          amount: fees[selectedType],
          currency: "USD",
          productId: newCard.id,
          fee: fees[selectedType],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process card issuance fee");
      }

      // Save card to state and localStorage (in production, this would be saved to backend)
      const updatedCards = [...issuedCards, newCard];
      setIssuedCards(updatedCards);
      localStorage.setItem(`cards_${user.id}`, JSON.stringify(updatedCards));

      // Reset form
      setShowIssueForm(false);
      setCardholderName("");
      setSelectedType("standard");

      alert(`${selectedType === "premium" ? "Premium" : "Standard"} virtual card issued successfully! Fee of $${fees[selectedType]} has been charged.`);
    } catch (error) {
      console.error("Card issuance error:", error);
      alert("Failed to issue card. Please ensure you have sufficient balance and try again.");
    } finally {
      setIssuing(false);
    }
  };

  const handleFreezeCard = (cardId: string) => {
    setIssuedCards((cards) =>
      cards.map((card) =>
        card.id === cardId ? { ...card, status: "frozen" as const } : card
      )
    );
    // Update localStorage
    const updatedCards = issuedCards.map((card) =>
      card.id === cardId ? { ...card, status: "frozen" as const } : card
    );
    localStorage.setItem(`cards_${user?.id}`, JSON.stringify(updatedCards));
  };

  const handleUnfreezeCard = (cardId: string) => {
    setIssuedCards((cards) =>
      cards.map((card) =>
        card.id === cardId ? { ...card, status: "active" as const } : card
      )
    );
    // Update localStorage
    const updatedCards = issuedCards.map((card) =>
      card.id === cardId ? { ...card, status: "active" as const } : card
    );
    localStorage.setItem(`cards_${user?.id}`, JSON.stringify(updatedCards));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Virtual Cards</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Issue and manage your virtual payment cards
          </p>
        </div>
        <Button onClick={() => setShowIssueForm(!showIssueForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Issue New Card
        </Button>
      </div>

      {/* Issue New Card Form */}
      {showIssueForm && (
        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Issue New Virtual Card</CardTitle>
            <CardDescription>Create a new virtual card for online payments</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Cardholder Name</Label>
              <Input
                placeholder="JOHN DOE"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                maxLength={26}
              />
              <p className="text-xs text-muted-foreground">
                Name as it will appear on the card
              </p>
            </div>

            <div className="space-y-2">
              <Label>Card Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedType("standard")}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    selectedType === "standard"
                      ? "border-accent-500 bg-accent-500/10"
                      : "border-border hover:border-accent-500/50"
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-semibold">Standard</p>
                    <p className="text-xs text-muted-foreground">FX markup 1.8%</p>
                    <p className="text-lg font-bold text-accent-600">${fees.standard}</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType("premium")}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    selectedType === "premium"
                      ? "border-accent-500 bg-accent-500/10"
                      : "border-border hover:border-accent-500/50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Premium</p>
                      <Badge variant="outline" className="text-xs">Recommended</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">FX markup 1.4%</p>
                    <p className="text-lg font-bold text-accent-600">${fees.premium}</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-sm space-y-1">
              <p className="font-medium text-blue-600">Card Issuance Fee</p>
              <p className="text-xs text-blue-600/80">
                A one-time fee of <span className="font-bold">${fees[selectedType]}</span> will be charged to your account balance.
                The card will be active immediately after issuance.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={handleIssueCard}
                disabled={issuing || !cardholderName}
              >
                {issuing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Issuing Card...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Issue Card (${fees[selectedType]})
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

      {/* Issued Cards Display */}
      {issuedCards.length === 0 ? (
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
        <div className="space-y-8">
          <div className="grid gap-8">
            {issuedCards.map((card) => (
              <div key={card.id}>
                <VirtualCard
                  cardNumber={card.cardNumber}
                  cardholderName={card.cardholderName}
                  expiryDate={card.expiryDate}
                  cvv={card.cvv}
                  type={card.type}
                  status={card.status}
                  onFreeze={() => handleFreezeCard(card.id)}
                  onUnfreeze={() => handleUnfreezeCard(card.id)}
                />
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Issued on {new Date(card.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
