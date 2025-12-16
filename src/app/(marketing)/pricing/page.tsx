import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PricingTable, type PricingPlan } from "@/components/marketing/pricing-table";
import { FAQSection, type FAQ } from "@/components/marketing/faq-section";
import { FeatureCardMarquee, type FeatureCardItem } from "@/components/marketing/feature-card-marquee";
import {
  BackgroundGrid,
  SubtleBlurOrbs,
} from "@/components/marketing/visuals";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses getting started with global payments",
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      "Up to $100K monthly transaction volume",
      "Multi-currency accounts (10 currencies)",
      "5 virtual cards included",
      "Basic API access",
      "Email support",
      "Standard settlement times",
    ],
    cta: "Get started",
  },
  {
    id: "growth",
    name: "Growth",
    description: "For growing businesses scaling their international operations",
    monthlyPrice: 199,
    annualPrice: 159,
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Up to $1M monthly transaction volume",
      "Multi-currency accounts (50+ currencies)",
      "25 virtual + physical cards",
      "Full API access with webhooks",
      "Priority email + chat support",
      "Same-day settlement options",
      "Advanced spending controls",
      "Custom reporting",
    ],
    cta: "Start free trial",
  },
  {
    id: "scale",
    name: "Scale",
    description: "Enterprise-grade infrastructure for high-volume operations",
    monthlyPrice: 499,
    annualPrice: 399,
    features: [
      "Unlimited transaction volume",
      "Multi-currency accounts (all supported)",
      "Unlimited cards with custom designs",
      "Dedicated API infrastructure",
      "24/7 phone + dedicated support",
      "Instant settlement",
      "Advanced fraud protection",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact sales",
  },
];

const coreFeatures: FeatureCardItem[] = [
  { text: "Multi-currency account management" },
  { text: "Virtual and physical card issuing" },
  { text: "Global payout capabilities" },
  { text: "Real-time FX rates and conversion" },
  { text: "API access and webhooks" },
  { text: "Dashboard and mobile app" },
  { text: "SOC 2 and PCI DSS compliance" },
  { text: "99.99% uptime SLA" },
];

const faqs: FAQ[] = [
  {
    question: "How does the pricing work?",
    answer:
      "Our pricing is based on monthly transaction volume and features. You can choose between monthly or annual billing, with a 20% discount for annual plans. All plans include core features like multi-currency accounts and cards, with higher tiers offering increased limits and premium features.",
  },
  {
    question: "What's included in the transaction volume?",
    answer:
      "Transaction volume includes all card transactions, payouts, and currency conversions processed through your account. Internal transfers between your own accounts don't count toward this limit. If you exceed your plan's limit, we'll automatically upgrade you to the next tier or contact you about custom pricing.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the start of your next billing cycle. We'll prorate any charges or credits accordingly.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, the Growth and Scale plans include a 14-day free trial with full access to all features. No credit card required to start. The Starter plan doesn't include a trial but has no long-term commitment.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and bank transfers for plan payments. For enterprise customers, we also offer invoice billing with net-30 terms.",
  },
  {
    question: "Are there any setup fees?",
    answer:
      "No, there are no setup fees, onboarding fees, or hidden charges. You only pay the monthly subscription fee based on your chosen plan. Transaction fees may apply for certain payment methods or currencies.",
  },
];

export default function PricingPage() {
  return (
    <div className="relative">
      {/* Background Visuals */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <BackgroundGrid variant="lines" cellSize={48} opacity={0.12} />
        <SubtleBlurOrbs context="marketing" />
      </div>

      {/* Hero Section */}
      <section className="section-spacing-lg w-full">
        <div className="container-wide container-padding">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="glass" className="shadow-depth">
              Pricing
            </Badge>

            <h1 className="text-display-xl font-bold tracking-tight">
              Simple, transparent pricing
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business needs. Scale up or down
              anytime with no hidden fees or long-term commitments.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="section-spacing-md w-full">
        <div className="container-wide container-padding">
          <PricingTable plans={pricingPlans} showCustom={true} />
        </div>
      </section>

      {/* Features Comparison */}
      <section className="section-spacing-lg bg-muted/30 w-full">
        <div className="w-full">
          <div className="text-center mb-12 container-wide container-padding">
            <h2 className="text-display-md font-bold mb-4">
              All plans include
            </h2>
            <p className="text-lg text-muted-foreground">
              Core features available across all pricing tiers
            </p>
          </div>

          <FeatureCardMarquee
            features={coreFeatures}
            duration={40}
            variant="glass"
            size="default"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-spacing-lg w-full">
        <div className="container-wide container-padding">
          <FAQSection
            faqs={faqs}
            badge="FAQ"
            description="Everything you need to know about our pricing and plans"
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-spacing-lg bg-muted/30 w-full">
        <div className="container-wide container-padding">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-display-md font-bold">
              Ready to get started?
            </h2>

            <p className="text-lg text-muted-foreground">
              Start accepting global payments and issuing cards today. No credit
              card required for trial.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button variant="primary" size="xl" className="gap-2 group">
                Start free trial
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button variant="outline" size="xl">
                Contact sales
              </Button>
            </div>

            <p className="text-sm text-muted-foreground pt-4">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
