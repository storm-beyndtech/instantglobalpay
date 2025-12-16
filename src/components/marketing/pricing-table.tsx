"use client";

import * as React from "react";
import { motion } from "framer-motion";
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

export interface PricingTableProps {
  plans: PricingPlan[];
  /**
   * Show custom pricing section
   * @default true
   */
  showCustom?: boolean;
}

export function PricingTable({ plans, showCustom = true }: PricingTableProps) {
  const [isAnnual, setIsAnnual] = React.useState(false);

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            !isAnnual ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Monthly
        </span>

        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={cn(
            "relative w-14 h-7 rounded-pill transition-colors duration-300",
            isAnnual ? "bg-primary-500" : "bg-muted"
          )}
          aria-label="Toggle pricing period"
        >
          <motion.div
            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
            animate={{ x: isAnnual ? 32 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>

        <span
          className={cn(
            "text-sm font-medium transition-colors",
            isAnnual ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Annual
        </span>

        {isAnnual && (
          <Badge variant="success" className="ml-2">
            Save 20%
          </Badge>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

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
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">
                      ${price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {isAnnual && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ${plan.annualPrice * 12} billed annually
                    </p>
                  )}
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
