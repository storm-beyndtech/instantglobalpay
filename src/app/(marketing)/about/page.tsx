"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BackgroundGrid,
  SubtleBlurOrbs,
} from "@/components/marketing/visuals";
import {
  MissionVisionSection,
  JourneyProgressSection,
  GlobalCoverageMap,
  ProductHeroOverkill,
} from "@/components/marketing";
import {
  ArrowRight,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Target,
  Globe2,
  Sparkles,
  LayoutPanelTop,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Customer First",
    description:
      "Every decision we make starts with how it impacts our customers. We build products that solve real problems for businesses operating globally.",
  },
  {
    icon: Shield,
    title: "Security & Trust",
    description:
      "We handle billions in transactions. Security and compliance are not afterthoughts—they're core to everything we build.",
  },
  {
    icon: Zap,
    title: "Speed Matters",
    description:
      "In global business, delays cost money. We obsess over making every transaction, integration, and support interaction as fast as possible.",
  },
  {
    icon: TrendingUp,
    title: "Build for Scale",
    description:
      "Our infrastructure is designed to grow with you—from first transaction to billions in annual volume without friction.",
  },
];

const pillars = [
  {
    icon: Globe2,
    title: "Borderless infrastructure",
    body: "Multi-rail money movement with compliance and FX baked in from day one.",
  },
  {
    icon: LayoutPanelTop,
    title: "Design-led execution",
    body: "Intentional, high-clarity interfaces that keep ops and finance aligned.",
  },
  {
    icon: Sparkles,
    title: "Human + automation",
    body: "Manual approvals when needed, automated rails when safe, with clear states.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <ProductHeroOverkill
        badge="ABOUT INSTANTGLOBAL"
        badgeIcon={Globe2}
        headline="Building the future of"
        headlineHighlight="global payments"
        subheadline="We're on a mission to make cross-border payments as simple as domestic transfers. No complexity, no hidden fees, no friction—just powerful infrastructure that works."
        primaryCTA={{
          label: "Explore our products",
          href: "/products",
        }}
        secondaryCTA={{
          label: "View open positions",
          href: "#careers",
        }}
        trustIndicators={[
          { icon: Shield, text: "SOC 2 Certified" },
          { icon: Globe2, text: "89 Countries" },
          { icon: Users, text: "10K+ Businesses" },
        ]}
        visualBackground="minimal"
        colorTheme="green"
      />

      {/* Pillars Section */}
      <section className="section-spacing-md">
        <div className="container-wide container-padding">
          <Card variant="glass" padding="lg" className="max-w-5xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-accent-500/5 to-transparent pointer-events-none" />
            <div className="relative space-y-8">
              <div className="text-center space-y-2">
                <Badge variant="glass" className="shadow-depth">The InstantGlobal way</Badge>
                <h2 className="text-display-md font-bold">How we build and ship</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  Opinionated on design, relentless on reliability, and honest about the controls that keep money safe.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {pillars.map((pillar, index) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className="rounded-2xl border border-border bg-card/60 p-5 shadow-depth hover:shadow-depth-lg transition-all"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground/90 mb-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span>{pillar.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{pillar.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-spacing-md">
        <div className="container-wide container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card variant="glass" padding="lg" className="text-center">
              <div className="space-y-2">
                <p className="text-4xl font-bold tracking-tight">10,000+</p>
                <p className="text-sm text-muted-foreground">
                  Active businesses
                </p>
              </div>
            </Card>

            <Card variant="glass" padding="lg" className="text-center">
              <div className="space-y-2">
                <p className="text-4xl font-bold tracking-tight">$2.4B</p>
                <p className="text-sm text-muted-foreground">
                  Annual volume
                </p>
              </div>
            </Card>

            <Card variant="glass" padding="lg" className="text-center">
              <div className="space-y-2">
                <p className="text-4xl font-bold tracking-tight">89</p>
                <p className="text-sm text-muted-foreground">
                  Countries supported
                </p>
              </div>
            </Card>

            <Card variant="glass" padding="lg" className="text-center">
              <div className="space-y-2">
                <p className="text-4xl font-bold tracking-tight">99.99%</p>
                <p className="text-sm text-muted-foreground">
                  Platform uptime
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <MissionVisionSection />

      {/* Journey Timeline Section */}
      <JourneyProgressSection />

      {/* Values Section */}
      <section className="section-spacing-lg bg-muted/30">
        <div className="container-wide container-padding">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-display-md font-bold mb-4">Our values</h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide everything we build
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} variant="elevated" padding="lg" hover="lift">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg">{value.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* GlobalCoverageMap */}
      <GlobalCoverageMap variant="default" />

      {/* Combined CTA Section */}
      <section className="section-spacing-lg">
        <div className="container-wide container-padding">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Business CTA */}
              <Card variant="glass" padding="lg" className="hover:shadow-depth-lg transition-all">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <Globe2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Ready to go global?</h3>
                    <p className="text-muted-foreground mb-6">
                      Join 10,000+ businesses using InstantGlobal to power their international operations with
                      enterprise-grade infrastructure.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button variant="primary" size="lg" className="w-full gap-2 group shadow-glow-green">
                      Launch your global account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                      Schedule a demo
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Careers CTA */}
              <Card variant="glass" padding="lg" className="hover:shadow-depth-lg transition-all" id="careers">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Join our team</h3>
                    <p className="text-muted-foreground mb-6">
                      We're building a global team of engineers, designers, and operators passionate about solving hard
                      problems in fintech infrastructure.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button variant="primary" size="lg" className="w-full gap-2 group">
                      View open positions
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button variant="ghost" size="lg" className="w-full">
                      Learn about our culture
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
