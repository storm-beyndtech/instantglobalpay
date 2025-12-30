import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PricingTable, type PricingPlan, type PricingFee } from "@/components/marketing/pricing-table";
import { FAQSection, type FAQ } from "@/components/marketing/faq-section";
import { FeatureCardMarquee, type FeatureCardItem } from "@/components/marketing/feature-card-marquee";
import {
  BackgroundGrid,
  SubtleBlurOrbs,
} from "@/components/marketing/visuals";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const pricingPlans: PricingPlan[] = [
  {
    id: "gold-card",
    name: "Gold Visa Card",
    description: "Core issuance with gateway access for lean teams",
    monthlyPrice: 0.15,
    annualPrice: 0.15,
    features: [
      "Card issuance fee: 0.15 BTC",
      "Debit card transactions: 0.10 BTC",
      "Net banking: 0.05 BTC, UPI: 0.02 BTC",
      "Virtual accounts & mobile wallets: 0.08 / 0.07 BTC",
      "Secure payment gateway with MFA + encryption",
      "24/7 support and no hidden fees",
    ],
    cta: "Issue gold card",
  },
  {
    id: "platinum-card",
    name: "Platinum Visa Card",
    description: "Higher limits and richer controls for scaling businesses",
    monthlyPrice: 0.3,
    annualPrice: 0.3,
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Card issuance fee: 0.30 BTC",
      "All gold payment rails included",
      "Merchant Visa capability with gateway controls",
      "Advanced spending controls and reporting",
      "Dedicated priority support",
      "Bank-grade security, MFA, continuous monitoring",
    ],
    cta: "Issue platinum card",
  },
  {
    id: "merchant-card",
    name: "Merchant Visa Card",
    description: "Enterprise issuance with bundled gateway pricing",
    monthlyPrice: 0.45,
    annualPrice: 0.45,
    features: [
      "Card issuance fee: 0.45 BTC",
      "Gateway rates: cards 0.10 BTC, net banking 0.05 BTC",
      "Supports debit, UPI, virtual accounts, mobile wallets",
      "Unlimited cards with custom designs",
      "Custom integrations and dedicated account manager",
      "No hidden fees, transparent BTC pricing",
    ],
    cta: "Talk to sales",
  },
];

const gatewayFees: PricingFee[] = [
  {
    label: "Debit card transactions",
    description: "Card acceptance with bank-grade auth flows.",
    fee: "0.10 BTC",
  },
  {
    label: "Net banking",
    description: "Direct account pulls with instant confirmations.",
    fee: "0.05 BTC",
  },
  {
    label: "UPI payments",
    description: "Real-time UPI collect requests and approvals.",
    fee: "0.02 BTC",
  },
  {
    label: "Virtual accounts",
    description: "Dedicated virtual account routing per customer.",
    fee: "0.08 BTC",
  },
  {
    label: "Mobile wallets",
    description: "Wallet top-ups and payouts across markets.",
    fee: "0.07 BTC",
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
      <section className="section-spacing-md w-full">
        <div className="container-wide container-padding">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <Badge variant="glass" className="shadow-depth">
              Pricing
            </Badge>

            <h1 className="text-display-xl font-bold tracking-tight">
              Transparent BTC-first pricing
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Card issuance and payment rails priced exactly as advertised. Built as a bank core, delivered with gateway
              simplicity-no hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="section-spacing-md w-full">
        <div className="container-wide container-padding">
          <PricingTable plans={pricingPlans} showCustom={true} fees={gatewayFees} />
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
              14-day free trial - No credit card required - Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
