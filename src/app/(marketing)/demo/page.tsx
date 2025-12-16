import { HeroOverkill } from "@/components/marketing/hero-overkill";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  CreditCard,
  Zap,
  Shield,
  Code,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function DemoPage() {
  return (
    <div className="relative">
      {/* Hero Overkill Section */}
      <HeroOverkill />

      {/* Features Section */}
      <section className="section-spacing-lg bg-muted/30">
        <div className="container-wide container-padding">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">
              Platform Capabilities
            </Badge>
            <h2 className="text-display-lg font-bold mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Purpose-built infrastructure for companies operating across
              borders with modern APIs and enterprise-grade reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="elevated" hover="lift">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 text-primary-600 mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <CardTitle>Multi-Currency Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hold and manage balances in 50+ currencies. Convert between
                  currencies at competitive rates with transparent pricing.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" hover="lift">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10 text-accent-600 mb-4">
                  <CreditCard className="h-6 w-6" />
                </div>
                <CardTitle>Card Issuing Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Issue physical and virtual cards with granular controls.
                  Real-time authorization and spending management.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" hover="lift">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 text-primary-600 mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle>Instant Global Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Execute cross-border payments in seconds. Support for local
                  payment methods and same-day settlement options.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" hover="lift">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10 text-accent-600 mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  PCI DSS Level 1 certified with advanced fraud detection.
                  End-to-end encryption for all transactions.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" hover="lift">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 text-primary-600 mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <CardTitle>Developer-First APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Modern RESTful APIs with comprehensive documentation. SDKs
                  available for all major programming languages.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" hover="lift">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10 text-accent-600 mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle>Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprehensive dashboard with live transaction monitoring and
                  custom reporting capabilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing-lg">
        <div className="container-wide container-padding">
          <Card variant="glass" padding="lg" className="max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow-green mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-display-md font-bold">
                Ready to scale globally?
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of companies using InstantGlobal to power their
                cross-border operations. Get started in minutes with our
                self-service platform.
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
                No credit card required • Setup in under 5 minutes • Cancel
                anytime
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
