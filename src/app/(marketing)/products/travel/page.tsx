"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric";
import { UseCaseSection } from "@/components/marketing/use-case-section";
import { ProductHeroOverkill } from "@/components/marketing/product-hero-overkill";
import { TravelRouteVisual } from "@/components/marketing/visuals";
import { getProductById } from "@/lib/products";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  CreditCard,
  Shield,
  Zap,
  Plane,
} from "lucide-react";
import heroAsset from "@/assets/card-2.svg";

export default function TravelPaymentsPage() {
  const product = getProductById("travel");

  if (!product) {
    return <div>Product not found</div>;
  }

  const Icon = product.icon;

  return (
    <div className="relative">
      {/* Hero Section */}
      <ProductHeroOverkill
        badge="TRAVEL PAYMENTS"
        badgeIcon={Plane}
        headline="Travel payments and"
        headlineHighlight="expense management"
        subheadline="Purpose-built cards for business travel. Track expenses automatically, enforce policy controls, and give your team spending power anywhere in the world."
        primaryCTA={{
          label: "Get travel cards",
          href: "/demo",
        }}
        secondaryCTA={{
          label: "View documentation",
          href: "/products/api",
        }}
        trustIndicators={[
          { icon: Globe, text: "Global acceptance" },
          { icon: Shield, text: "Real-time controls" },
          { icon: Zap, text: "Instant approval" },
        ]}
        customVisual={TravelRouteVisual}
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
                Everything you need for global travel
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Purpose-built features designed for businesses with traveling
                teams and international operations.
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
                Why choose InstantGlobal for travel
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built specifically for the unique challenges of international
                business travel and expense management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10">
                    <Globe className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold">Global Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Accepted at 40M+ merchants in 180+ countries worldwide.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10">
                    <CreditCard className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold">Zero FX Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    No foreign transaction fees on any international purchase.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold">Built-in Controls</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time spending limits and merchant category restrictions.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10">
                    <Zap className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold">Instant Reporting</h3>
                  <p className="text-sm text-muted-foreground">
                    Automated expense categorization and receipt capture.
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
                Ready to optimize your travel spend?
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join companies saving thousands on international travel expenses
                with zero-fee cards and automated expense management.
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
