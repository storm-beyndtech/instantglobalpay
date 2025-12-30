"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: string;
}

export interface PricingFee {
  label: string;
  description?: string;
  fee: string;
}

export interface PricingTableProps {
  plans: PricingPlan[];
  showCustom?: boolean;
  fees?: PricingFee[];
}

export function PricingTable({ plans, showCustom = true, fees }: PricingTableProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="glass" className="shadow-depth">
          Issuance fees
        </Badge>
        <p className="text-sm text-muted-foreground">
          BTC-denominated pricing for card issuing and gateway rails—matched to instantsglobal-p.com/pricing.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const price = plan.monthlyPrice;

          return (
            <Card
              key={plan.id}
              variant={plan.highlighted ? "elevated" : "glass"}
              hover={plan.highlighted ? "glow" : "lift"}
              className={cn(
                "relative",
                plan.highlighted && "border-primary-500/30 shadow-depth-lg"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="accent" className="shadow-depth">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground pt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">
                      {price} BTC
                    </span>
                    <span className="text-sm text-muted-foreground">per card issuance</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gateway access, auth, and support included. No hidden surcharges.
                  </p>
                </div>

                {/* CTA */}
                <Button
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="w-full gap-2 group"
                  size="lg"
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                {/* Features */}
                <div className="space-y-3 pt-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Itemized Fees */}
      {fees && fees.length > 0 && (
        <div className="w-full overflow-hidden rounded-3xl border border-border bg-card/70 shadow-depth-lg">
          <div className="px-4 py-6 md:px-8 md:py-10 border-b border-border/70">
            <div className="space-y-2">
              <h2 className="text-display-md font-bold">Payment options & fees</h2>
              <p className="text-muted-foreground max-w-3xl">
                Itemized rates for every rail we support—transparent BTC pricing with no hidden surcharges.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {fees.map((item) => (
              <div key={item.label} className="flex items-start gap-3 px-4 py-5 md:px-8 md:py-6">
                <div className="mt-1">
                  <CheckCircle2 className="h-5 w-5 text-accent-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">{item.fee}</span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Pricing */}
      {showCustom && (
        <Card variant="glass" padding="lg" className="text-center max-w-4xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Need a custom solution?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              For businesses processing over $10M annually or requiring
              dedicated support, custom infrastructure, or specialized
              integrations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button variant="primary" size="lg" className="gap-2">
                Contact sales
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule a demo
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
