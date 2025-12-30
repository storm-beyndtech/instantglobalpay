"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Gift } from "lucide-react";

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  status: "active" | "redeemed";
  recipient?: string;
}

export default function GiftCardsPage() {
  const [giftcards, setGiftcards] = useState<GiftCard[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("giftcards");
    return saved ? JSON.parse(saved) : [];
  });
  const [amount, setAmount] = useState("50");
  const [recipient, setRecipient] = useState("");

  const price = Number(process.env.NEXT_PUBLIC_GIFT_CARD_FEE || 4.5);

  const handleIssue = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid gift card amount");
      return;
    }
    const code = Math.random().toString(36).slice(2, 10).toUpperCase();
    const card: GiftCard = {
      id: `gift_${Date.now()}`,
      code,
      amount: amt,
      status: "active",
      recipient: recipient || undefined,
    };
    const next = [...giftcards, card];
    setGiftcards(next);
    localStorage.setItem("giftcards", JSON.stringify(next));
    toast.success(`Gift card issued for $${amt.toFixed(2)} (fee $${price.toFixed(2)})`);
    setAmount("50");
    setRecipient("");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Gift Cards</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Issue branded gift cards without collecting cardholder details.
          </p>
        </div>
        <Badge variant="secondary">Fee ${price.toFixed(2)}</Badge>
      </div>

      <Card variant="glass" padding="lg" hover="lift">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg">Issue Gift Card</CardTitle>
          <CardDescription>Create a gift card code for a recipient</CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                placeholder="50"
              />
              <p className="text-xs text-muted-foreground">Gift amount the recipient can redeem.</p>
            </div>
            <div className="space-y-2">
              <Label>Recipient email (optional)</Label>
              <Input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="recipient@example.com"
              />
              <p className="text-xs text-muted-foreground">Keep blank to issue without binding to email.</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-3 text-sm">
            <span className="text-muted-foreground">Issuance fee</span>
            <span className="font-semibold">${price.toFixed(2)}</span>
          </div>
          <Button onClick={handleIssue} className="w-full gap-2">
            <Gift className="h-4 w-4" />
            Issue gift card
          </Button>
        </CardContent>
      </Card>

      {giftcards.length > 0 && (
        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Issued Gift Cards</CardTitle>
            <CardDescription>Track active and redeemed cards</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-3">
            {giftcards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Code: {card.code}</p>
                  <p className="text-xs text-muted-foreground">
                    ${card.amount.toFixed(2)} {card.recipient ? `• ${card.recipient}` : ""}
                  </p>
                </div>
                <Badge variant={card.status === "active" ? "success" : "outline"}>{card.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
