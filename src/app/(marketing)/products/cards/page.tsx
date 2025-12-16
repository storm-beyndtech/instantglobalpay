"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric";
import { UseCaseSection } from "@/components/marketing/use-case-section";
import { ProductHeroOverkill } from "@/components/marketing/product-hero-overkill";
import { CardStackVisual } from "@/components/marketing/visuals";
import { getProductById } from "@/lib/products";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Lock,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";
import heroAsset from "@/assets/card.svg";

export default function CardIssuingPage() {
  const product = getProductById("cards");

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <ProductHeroOverkill
        badge="CARD ISSUING"
        badgeIcon={CreditCard}
        headline="Issue cards instantly with"
        headlineHighlight="granular control"
        subheadline="Physical and virtual card issuing platform with real-time authorization controls. Perfect for employee expenses, vendor payments, and subscription management."
        primaryCTA={{
          label: "Start issuing cards",
          href: "/demo",
        }}
        secondaryCTA={{
          label: "View documentation",
          href: "/products/api",
        }}
        trustIndicators={[
          { icon: Shield, text: "PCI DSS Level 1" },
          { icon: Zap, text: "Instant virtual cards" },
          { icon: Lock, text: "3D Secure enabled" },
        ]}
        customVisual={CardStackVisual}
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
                Complete card management platform
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to issue, manage, and control cards for your
                team with granular permissions and real-time visibility.
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

      {/* Card Types Section */}
      <section className="section-spacing-lg bg-muted/30">
        <div className="container-wide container-padding">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-display-md font-bold mb-4">
                Physical and virtual cards
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Issue the right card type for every use case with flexible
                controls and instant provisioning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="glass" padding="lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-accent-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Virtual Cards</h3>
                        <p className="text-xs text-muted-foreground">
                          Instant generation
                        </p>
                      </div>
                    </div>
                    <Badge variant="accent" className="text-xs">
                      Instant
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Generate virtual cards in seconds for online payments,
                    subscriptions, and vendor management. Perfect for
                    one-time or recurring expenses.
                  </p>

                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-accent-500" />
                      <span>Ready to use immediately</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-accent-500" />
                      <span>Unique card per vendor</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-accent-500" />
                      <span>Easy cancellation and replacement</span>
                    </li>
                  </ul>
                </div>
              </Card>

              <Card variant="glass" padding="lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Physical Cards</h3>
                        <p className="text-xs text-muted-foreground">
                          Global shipping
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" className="text-xs">
                      2-5 days
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Premium physical cards shipped globally for in-person
                    purchases, travel, and day-to-day expenses. Contactless
                    enabled with chip and PIN.
                  </p>

                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-primary-500" />
                      <span>Contactless and chip enabled</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-primary-500" />
                      <span>Worldwide acceptance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-primary-500" />
                      <span>Same controls as virtual cards</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="section-spacing-lg">
        <div className="container-wide container-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-display-md font-bold mb-4">
                Enterprise-grade security
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Advanced security features built-in to protect your business
                from fraud and unauthorized transactions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10">
                    <Lock className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold">3D Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    Built-in authentication for online transactions with fraud
                    protection.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold">Real-time Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant alerts for suspicious activity with automatic fraud
                    detection.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10">
                    <Zap className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold">Instant Controls</h3>
                  <p className="text-sm text-muted-foreground">
                    Freeze, unfreeze, or cancel cards instantly from your
                    dashboard or API.
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
                Ready to issue your first card?
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start issuing virtual cards in minutes with complete control
                over spending, limits, and permissions.
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
                No credit card required • Virtual cards ready in seconds
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
