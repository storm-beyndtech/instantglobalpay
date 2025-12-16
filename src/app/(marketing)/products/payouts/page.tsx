"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric";
import { UseCaseSection } from "@/components/marketing/use-case-section";
import { ProductHeroOverkill } from "@/components/marketing/product-hero-overkill";
import { PayoutsFlowVisual } from "@/components/marketing/visuals";
import { getProductById } from "@/lib/products";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Clock,
  Shield,
  Send,
} from "lucide-react";
import heroAsset from "@/assets/transfers.svg";

export default function PayoutsPage() {
  const product = getProductById("payouts");

  if (!product) {
    return <div>Product not found</div>;
  }

  const Icon = product.icon;

  return (
    <div className="relative">
      {/* Hero Section */}
      <ProductHeroOverkill
        badge="GLOBAL PAYOUTS"
        badgeIcon={Send}
        headline="Send money globally with"
        headlineHighlight="instant settlement"
        subheadline="Fast, reliable payouts to suppliers, contractors, and partners worldwide. Same-day settlement in 40+ major markets with full transparency."
        primaryCTA={{
          label: "Start sending payouts",
          href: "/demo",
        }}
        secondaryCTA={{
          label: "View documentation",
          href: "/products/api",
        }}
        trustIndicators={[
          { icon: Clock, text: "Same-day settlement" },
          { icon: Globe, text: "150+ countries" },
          { icon: Shield, text: "99.8% success rate" },
        ]}
        customVisual={PayoutsFlowVisual}
        visualBackground="minimal"
      />

      {/* Stats Section */}
      {product.stats && (
        <section className="section-spacing-md">
          <div className="container-wide container-padding">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {product.stats.map((stat, index) => (
                <MetricCard
                  key={index}
                  variant="glass"
                  label={stat.label}
                  value={stat.value}
                  description={stat.description}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="section-spacing-lg bg-muted/30">
        <div className="container-wide container-padding">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="accent" className="mb-4">
                Features
              </Badge>
              <h2 className="text-display-md font-bold mb-4">
                Fast, reliable global payouts
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Send money to suppliers, contractors, and partners worldwide
                with same-day settlement options.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features.map((feature, index) => (
                <Card key={index} variant="elevated" padding="lg">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500/10 flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary-600" />
                    </div>
                    <p className="text-sm font-medium pt-2">{feature}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-spacing-lg">
        <div className="container-wide container-padding">
          <UseCaseSection useCases={product.useCases} variant="elevated" />
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section-spacing-lg bg-muted/30">
        <div className="container-wide container-padding">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-display-md font-bold mb-4">
                Why choose InstantGlobal for payouts
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for businesses that need to send money globally with
                speed, reliability, and transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold">Same-Day Settlement</h3>
                  <p className="text-sm text-muted-foreground">
                    Send payments that arrive the same day in 40+ major
                    markets.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10">
                    <Globe className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold">Local Payment Rails</h3>
                  <p className="text-sm text-muted-foreground">
                    Use local payment methods preferred by your recipients
                    globally.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold">Compliance Built-In</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic beneficiary validation and compliance checks on
                    every payout.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10">
                    <Zap className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold">99.8% Success Rate</h3>
                  <p className="text-sm text-muted-foreground">
                    Industry-leading first-attempt success rate with real-time
                    tracking.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing-lg">
        <div className="container-wide container-padding">
          <Card variant="glass" padding="lg" className="max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <h2 className="text-display-md font-bold">
                Ready to streamline your global payments?
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start sending payouts to suppliers and contractors worldwide
                with same-day settlement and competitive rates.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button variant="primary" size="xl" className="gap-2 group">
                  Launch your global account
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button variant="outline" size="xl">
                  Schedule a demo
                </Button>
              </div>

              <p className="text-xs text-muted-foreground pt-4">
                No credit card required • Setup in under 5 minutes
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
