"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric";
import { UseCaseSection } from "@/components/marketing/use-case-section";
import { ProductHeroOverkill } from "@/components/marketing/product-hero-overkill";
import { FXTreasuryVisual } from "@/components/marketing/visuals";
import { getProductById } from "@/lib/products";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import heroAsset from "@/assets/fx.svg";

export default function FXTreasuryPage() {
  const product = getProductById("fx");

  if (!product) {
    return <div>Product not found</div>;
  }

  const Icon = product.icon;

  return (
    <div className="relative">
      {/* Hero Section */}
      <ProductHeroOverkill
        badge="FX & TREASURY"
        badgeIcon={TrendingUp}
        headline="Treasury management with"
        headlineHighlight="real-time FX"
        subheadline="Smart currency conversion and treasury tools. Get mid-market rates, automate FX hedging, and manage multi-currency balances with intelligent optimization."
        primaryCTA={{
          label: "Optimize your treasury",
          href: "/demo",
        }}
        secondaryCTA={{
          label: "View documentation",
          href: "/products/api",
        }}
        trustIndicators={[
          { icon: TrendingUp, text: "Mid-market rates" },
          { icon: Zap, text: "Instant conversion" },
          { icon: Shield, text: "Auto-hedging" },
        ]}
        customVisual={FXTreasuryVisual}
        visualBackground="minimal"
        colorTheme="purple"
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
                Institutional-grade FX and treasury tools
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive foreign exchange and treasury management features
                for businesses managing global cash positions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features.map((feature, index) => (
                <Card key={index} variant="elevated" padding="lg">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-500/10 flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-accent-600" />
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
                Why choose InstantGlobal for FX & treasury
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for finance teams that need institutional FX rates and
                advanced treasury management tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10">
                    <TrendingUp className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold">Competitive Rates</h3>
                  <p className="text-sm text-muted-foreground">
                    Access institutional FX rates with transparent pricing and
                    no hidden markups.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10">
                    <BarChart3 className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold">Risk Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor FX exposure in real-time with advanced analytics
                    and reporting.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10">
                    <Shield className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold">Hedging Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Protect against currency volatility with spot and forward
                    contracts.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10">
                    <Zap className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold">Automated Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Auto-sweep idle balances and optimize yield across
                    currencies.
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
                Ready to optimize your global treasury?
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access institutional FX rates and advanced treasury management
                tools to optimize your global cash positions.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button variant="primary-purple" size="xl" className="gap-2 group">
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
