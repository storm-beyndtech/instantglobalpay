"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric";
import { UseCaseSection } from "@/components/marketing/use-case-section";
import { ProductHeroOverkill } from "@/components/marketing/product-hero-overkill";
import { GlobalCoverageMap } from "@/components/marketing/global-coverage-map";
import { GlobalNetworkVisual } from "@/components/marketing/visuals";
import { getProductById } from "@/lib/products";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Shield,
  Clock,
  TrendingUp,
  Wallet,
} from "lucide-react";
import heroAsset from "@/assets/global.svg";

export default function GlobalAccountsPage() {
  const product = getProductById("global-accounts");

  if (!product) {
    return <div>Product not found</div>;
  }

  const Icon = product.icon;

  return (
    <div className="relative">
      {/* Hero Section */}
      <ProductHeroOverkill
        badge="GLOBAL ACCOUNTS"
        badgeIcon={Wallet}
        headline="Multi-currency accounts with"
        headlineHighlight="zero complexity"
        subheadline="Hold, manage, and move money in 50+ currencies with local account details. Perfect for businesses operating across borders without the banking hassle."
        primaryCTA={{
          label: "Open your account",
          href: "/demo",
        }}
        secondaryCTA={{
          label: "View documentation",
          href: "/products/api",
        }}
        trustIndicators={[
          { icon: Globe, text: "89 countries" },
          { icon: Shield, text: "Bank-grade security" },
          { icon: TrendingUp, text: "Real-time FX" },
        ]}
        customVisual={GlobalNetworkVisual}
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
                Everything you need to operate globally
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive multi-currency account features designed for
                businesses expanding across borders.
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
                Why choose InstantGlobal for global accounts
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built specifically for businesses that need to hold and move
                money across borders without friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10">
                    <Globe className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold">50+ Currencies</h3>
                  <p className="text-sm text-muted-foreground">
                    Hold and convert between major and emerging market
                    currencies.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10">
                    <Clock className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold">Instant Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Open new currency accounts in under 5 minutes with no
                    paperwork.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold">Bank-Level Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your funds are segregated and protected with institutional
                    security.
                  </p>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10">
                    <TrendingUp className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold">Competitive Rates</h3>
                  <p className="text-sm text-muted-foreground">
                    Access institutional FX rates with transparent pricing and
                    no markups.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* GlobalCoverageMap */}
      <GlobalCoverageMap variant="default" />
    </div>
  );
}
