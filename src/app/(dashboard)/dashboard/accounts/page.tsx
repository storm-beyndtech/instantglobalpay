"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bankingApi, type ApiUser } from "@/lib/banking/api";
import { Copy, Banknote, Shield } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export default function AccountsPage() {
  const { user } = useAuth();
  const [account, setAccount] = useState<{ accountNumber: string; routingNumber: string; wallets: ApiUser["wallets"] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    bankingApi
      .getAccount(user.id)
      .then(setAccount)
      .catch((err) => setError(err.message || "Failed to load account"));
  }, [user?.id]);

  const copy = (value: string) => navigator.clipboard?.writeText(value).catch(() => {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Accounts</h1>
        <p className="text-sm text-muted-foreground mt-1">Account and routing details for banking rails.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="glass" padding="lg" hover="lift" className="lg:col-span-2">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Primary account</CardTitle>
            <CardDescription>Share details to receive bank transfers.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-3">
            {error && <p className="text-sm text-destructive">{error}</p>}
            {account ? (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-border px-4 py-3">
                    <p className="text-xs text-muted-foreground">Account number</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{account.accountNumber}</p>
                      <Button size="icon" variant="ghost" onClick={() => copy(account.accountNumber)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border px-4 py-3">
                    <p className="text-xs text-muted-foreground">Routing number</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{account.routingNumber}</p>
                      <Button size="icon" variant="ghost" onClick={() => copy(account.routingNumber)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-dashed border-border px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-accent-500" />
                    Funds settle through treasury; external payouts apply heavy fees in Transfers.
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Loading account...</p>
            )}
          </CardContent>
        </Card>

        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">Balances</CardTitle>
            <CardDescription>Snapshot of your ledgers.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-4">
            <div className="rounded-lg border border-border px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Ledger balance</p>
                <p className="text-xl font-semibold">—</p>
              </div>
              <Badge variant="outline">USD</Badge>
            </div>
            <div className="rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Banknote className="h-4 w-4 text-accent-500" />
                Funding instructions
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Use the account and routing numbers above for domestic ACH. For wires, fees apply and will be reflected in Transfers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
