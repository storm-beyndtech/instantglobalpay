"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductHeroOverkill } from "@/components/marketing/product-hero-overkill";
import { UseCaseSection } from "@/components/marketing/use-case-section";
import {
  CodeSamplesPanel,
  type CodeSample,
} from "@/components/dashboard/code-samples-panel";
import { APIKeysPanel, type APIKey } from "@/components/dashboard/api-keys-panel";
import { BackgroundGrid, CodeTerminalVisual } from "@/components/marketing/visuals";
import { getProductById } from "@/lib/products";
import {
  ArrowRight,
  Code,
  Terminal,
  Zap,
  Lock,
  Globe,
  Clock,
  BookOpen,
} from "lucide-react";

// Mock API Keys
const mockAPIKeys: APIKey[] = [
  {
    id: "1",
    name: "Production Key",
    key: "sk_live_••••••••••••••••••••••••••••••••••••••••",
    environment: "production",
    createdAt: "Jan 15, 2024",
    lastUsed: "2 hours ago",
    scopes: ["payments", "accounts", "cards"],
  },
  {
    id: "2",
    name: "Sandbox Key",
    key: "sk_test_••••••••••••••••••••••••••••••••••••••••",
    environment: "sandbox",
    createdAt: "Jan 10, 2024",
    lastUsed: "5 hours ago",
    scopes: ["payments", "accounts"],
  },
];

// Original API Code Samples
const paymentCreationSamples: CodeSample[] = [
  {
    language: "javascript",
    label: "JavaScript",
    extension: "js",
    code: `const instantglobal = require('instantglobal');

const client = instantglobal('sk_live_...');

// Create a payment
const payment = await client.payments.create({
  amount: 10000,
  currency: 'usd',
  destination: 'acct_1234567890',
  description: 'Payment for Invoice #INV-2451',
  metadata: {
    order_id: 'order_xyz123',
    customer_id: 'cust_abc456'
  }
});

console.log('Payment ID:', payment.id);
console.log('Status:', payment.status);`,
  },
  {
    language: "python",
    label: "Python",
    extension: "py",
    code: `import instantglobal

client = instantglobal.Client('sk_live_...')

# Create a payment
payment = client.payments.create(
    amount=10000,
    currency='usd',
    destination='acct_1234567890',
    description='Payment for Invoice #INV-2451',
    metadata={
        'order_id': 'order_xyz123',
        'customer_id': 'cust_abc456'
    }
)

print('Payment ID:', payment.id)
print('Status:', payment.status)`,
  },
  {
    language: "curl",
    label: "cURL",
    extension: "sh",
    code: `curl -X POST https://api.instantglobal.com/v1/payments \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 10000,
    "currency": "usd",
    "destination": "acct_1234567890",
    "description": "Payment for Invoice #INV-2451",
    "metadata": {
      "order_id": "order_xyz123",
      "customer_id": "cust_abc456"
    }
  }'`,
  },
];

const cardIssuanceSamples: CodeSample[] = [
  {
    language: "javascript",
    label: "JavaScript",
    extension: "js",
    code: `const instantglobal = require('instantglobal');

const client = instantglobal('sk_live_...');

// Issue a virtual card
const card = await client.cards.create({
  type: 'virtual',
  holder_name: 'Engineering Team',
  currency: 'usd',
  spending_limits: {
    amount: 5000,
    interval: 'monthly'
  },
  merchant_categories: ['5734', '5735'], // Software & SaaS
  metadata: {
    department: 'engineering',
    budget_id: 'budget_eng_q1_2024'
  }
});

console.log('Card ID:', card.id);
console.log('Card Number:', card.number); // Only available once`,
  },
  {
    language: "python",
    label: "Python",
    extension: "py",
    code: `import instantglobal

client = instantglobal.Client('sk_live_...')

# Issue a virtual card
card = client.cards.create(
    type='virtual',
    holder_name='Engineering Team',
    currency='usd',
    spending_limits={
        'amount': 5000,
        'interval': 'monthly'
    },
    merchant_categories=['5734', '5735'],  # Software & SaaS
    metadata={
        'department': 'engineering',
        'budget_id': 'budget_eng_q1_2024'
    }
)

print('Card ID:', card.id)
print('Card Number:', card.number)  # Only available once`,
  },
  {
    language: "curl",
    label: "cURL",
    extension: "sh",
    code: `curl -X POST https://api.instantglobal.com/v1/cards \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "virtual",
    "holder_name": "Engineering Team",
    "currency": "usd",
    "spending_limits": {
      "amount": 5000,
      "interval": "monthly"
    },
    "merchant_categories": ["5734", "5735"],
    "metadata": {
      "department": "engineering",
      "budget_id": "budget_eng_q1_2024"
    }
  }'`,
  },
];

const accountCreationSamples: CodeSample[] = [
  {
    language: "javascript",
    label: "JavaScript",
    extension: "js",
    code: `const instantglobal = require('instantglobal');

const client = instantglobal('sk_live_...');

// Create a multi-currency account
const account = await client.accounts.create({
  currency: 'eur',
  account_name: 'European Operations',
  country: 'DE',
  features: ['local_account_details', 'swift', 'sepa'],
  metadata: {
    region: 'eu',
    entity_id: 'entity_eu_001'
  }
});

console.log('Account ID:', account.id);
console.log('IBAN:', account.iban);
console.log('BIC:', account.bic);`,
  },
  {
    language: "python",
    label: "Python",
    extension: "py",
    code: `import instantglobal

client = instantglobal.Client('sk_live_...')

# Create a multi-currency account
account = client.accounts.create(
    currency='eur',
    account_name='European Operations',
    country='DE',
    features=['local_account_details', 'swift', 'sepa'],
    metadata={
        'region': 'eu',
        'entity_id': 'entity_eu_001'
    }
)

print('Account ID:', account.id)
print('IBAN:', account.iban)
print('BIC:', account.bic)`,
  },
  {
    language: "curl",
    label: "cURL",
    extension: "sh",
    code: `curl -X POST https://api.instantglobal.com/v1/accounts \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "currency": "eur",
    "account_name": "European Operations",
    "country": "DE",
    "features": ["local_account_details", "swift", "sepa"],
    "metadata": {
      "region": "eu",
      "entity_id": "entity_eu_001"
    }
  }'`,
  },
];

export default function APIPage() {
  const product = getProductById("api");

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="relative">
      {/* Background Visuals */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <BackgroundGrid variant="dots" cellSize={40} opacity={0.15} />
      </div>

      {/* Hero Section */}
      <ProductHeroOverkill
        badge="DEVELOPER APIs"
        badgeIcon={Code}
        headline="Build payment experiences with"
        headlineHighlight="modern APIs"
        subheadline="Comprehensive REST APIs with language-specific SDKs. Integrate global payments, card issuing, and account management directly into your platform with full documentation."
        primaryCTA={{
          label: "Get API keys",
          href: "/dashboard",
        }}
        secondaryCTA={{
          label: "View documentation",
          href: "/docs",
        }}
        trustIndicators={[
          { icon: BookOpen, text: "Full documentation" },
          { icon: Zap, text: "99.99% uptime" },
          { icon: Lock, text: "SOC 2 certified" },
        ]}
        customVisual={CodeTerminalVisual}
        visualBackground="minimal"
        colorTheme="purple"
      />

      {/* API Endpoints Section */}
      <section className="section-spacing-lg bg-muted/30">
        <div className="container-wide container-padding">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="accent" className="mb-4">
                Core Endpoints
              </Badge>
              <h2 className="text-display-md font-bold mb-4">
                Everything you need in one API
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple, predictable REST endpoints for all payment operations
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card variant="elevated" padding="lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-accent-600" />
                    </div>
                    <h3 className="font-semibold">Payments</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send and receive money globally with instant settlement
                  </p>
                  <div className="pt-2 space-y-1 text-xs font-mono text-muted-foreground">
                    <div>POST /v1/payments</div>
                    <div>GET /v1/payments/:id</div>
                    <div>GET /v1/payments</div>
                  </div>
                </div>
              </Card>

              <Card variant="elevated" padding="lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                      <Code className="h-5 w-5 text-accent-600" />
                    </div>
                    <h3 className="font-semibold">Cards</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Issue virtual and physical cards programmatically
                  </p>
                  <div className="pt-2 space-y-1 text-xs font-mono text-muted-foreground">
                    <div>POST /v1/cards</div>
                    <div>GET /v1/cards/:id</div>
                    <div>PATCH /v1/cards/:id</div>
                  </div>
                </div>
              </Card>

              <Card variant="elevated" padding="lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-accent-600" />
                    </div>
                    <h3 className="font-semibold">Accounts</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create multi-currency accounts with local details
                  </p>
                  <div className="pt-2 space-y-1 text-xs font-mono text-muted-foreground">
                    <div>POST /v1/accounts</div>
                    <div>GET /v1/accounts/:id</div>
                    <div>GET /v1/accounts</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="section-spacing-lg">
        <div className="container-wide container-padding">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center">
              <Badge variant="glass" className="mb-4">
                Code Examples
              </Badge>
              <h2 className="text-display-md font-bold mb-4">
                Start building in minutes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Copy-paste examples in your language of choice
              </p>
            </div>

            {/* Payment Creation Example */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Create a Payment</h3>
              <CodeSamplesPanel
                description="Send money to suppliers, contractors, or marketplaces"
                samples={paymentCreationSamples}
                variant="elevated"
              />
            </div>

            {/* Card Issuance Example */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Issue a Card</h3>
              <CodeSamplesPanel
                description="Generate virtual cards with spending controls"
                samples={cardIssuanceSamples}
                variant="elevated"
              />
            </div>

            {/* Account Creation Example */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Create an Account</h3>
              <CodeSamplesPanel
                description="Open multi-currency accounts with local banking details"
                samples={accountCreationSamples}
                variant="elevated"
              />
            </div>
          </div>
        </div>
      </section>

      {/* API Keys Management */}
      <section className="section-spacing-lg bg-muted/30">
        <div className="container-wide container-padding">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-display-md font-bold mb-4">
                Manage your API keys
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Separate keys for production and sandbox environments
              </p>
            </div>

            <APIKeysPanel
              keys={mockAPIKeys}
              onCreateKey={() => console.log("Create key")}
              onRegenerateKey={(id) => console.log("Regenerate", id)}
              onDeleteKey={(id) => console.log("Delete", id)}
              variant="elevated"
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-spacing-lg">
        <div className="container-wide container-padding">
          <UseCaseSection useCases={product.useCases} variant="elevated" />
        </div>
      </section>

      {/* Developer Experience Features */}
      <section className="section-spacing-lg bg-muted/30">
        <div className="container-wide container-padding">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-display-md font-bold mb-4">
                Built for developer experience
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to ship fast and scale reliably
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Clock,
                  title: "99.99% Uptime",
                  description:
                    "Enterprise SLA with guaranteed uptime and sub-100ms response times",
                },
                {
                  icon: Lock,
                  title: "Idempotent Requests",
                  description:
                    "Safely retry requests with idempotency keys to prevent duplicates",
                },
                {
                  icon: Terminal,
                  title: "Webhook Events",
                  description:
                    "Real-time notifications for all payment and account events",
                },
                {
                  icon: Code,
                  title: "Versioned API",
                  description:
                    "Backwards-compatible versioning ensures your integration never breaks",
                },
                {
                  icon: Zap,
                  title: "Rate Limiting",
                  description:
                    "Generous rate limits with automatic scaling for enterprise customers",
                },
                {
                  icon: Globe,
                  title: "Global Infrastructure",
                  description:
                    "Multi-region deployment for low latency from anywhere in the world",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} variant="glass" padding="lg" hover="lift">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-accent-600" />
                      </div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
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
                Ready to start building?
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get API keys instantly and start integrating global payments
                into your platform with comprehensive documentation and support.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button variant="primary-purple" size="xl" className="gap-2 group">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button variant="outline" size="xl">
                  View API Reference
                </Button>
              </div>

              <p className="text-xs text-muted-foreground pt-4">
                No credit card required • Sandbox access included • 14-day free trial
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
