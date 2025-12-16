import { LucideIcon, Globe, CreditCard, Zap, TrendingUp, Plane, Code } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "accent";
  href: string;
  features: string[];
  useCases: UseCase[];
  stats?: ProductStat[];
}

export interface UseCase {
  title: string;
  description: string;
  benefits: string[];
}

export interface ProductStat {
  label: string;
  value: string;
  description: string;
}

export const products: Record<string, Product> = {
  "global-accounts": {
    id: "global-accounts",
    name: "Global Accounts",
    tagline: "Manage money in 50+ currencies",
    description:
      "Multi-currency accounts designed for businesses operating across borders. Open accounts in minutes, hold balances in multiple currencies, and manage everything from a unified dashboard.",
    icon: Globe,
    color: "primary",
    href: "/products/global-accounts",
    features: [
      "Hold balances simultaneously",
      "Local account details in markets",
      "Real-time tracking & notifications",
      "Automated currency conversion",
      "Multi accounts batch operations ",
      "Advanced reconciliation & report",
    ],
    useCases: [
      {
        title: "International Expansion",
        description:
          "Companies expanding into new markets need local currency accounts to receive payments and manage operating expenses efficiently.",
        benefits: [
          "Reduce FX conversion costs by holding local currency",
          "Accept payments directly in customer's currency",
          "Streamline international supplier payments",
        ],
      },
      {
        title: "Cross-Border Commerce",
        description:
          "E-commerce businesses selling globally require multi-currency capabilities to optimize margins and reduce friction.",
        benefits: [
          "Display prices in local currency",
          "Minimize payment processing fees",
          "Hedge against currency fluctuations",
        ],
      },
      {
        title: "Treasury Management",
        description:
          "Finance teams need centralized visibility and control over global cash positions across multiple currencies and entities.",
        benefits: [
          "Unified view of all currency balances",
          "Automated cash positioning",
          "Real-time FX exposure monitoring",
        ],
      },
    ],
    stats: [
      {
        label: "Currencies Supported",
        value: "50+",
        description: "Major and emerging market currencies",
      },
      {
        label: "Account Opening",
        value: "<5 min",
        description: "Average time to activate new account",
      },
      {
        label: "Markets",
        value: "89",
        description: "Countries with local account details",
      },
    ],
  },

  cards: {
    id: "cards",
    name: "Card Issuing",
    tagline: "Issue cards instantly with control",
    description:
      "Physical and virtual card issuing platform with real-time authorization controls. Perfect for employee expenses, vendor payments, and subscription management.",
    icon: CreditCard,
    color: "accent",
    href: "/products/cards",
    features: [
      "Instant virtual card generation",
      "Physical cards shipped globally",
      "Real-time spend controls & limits",
      "Merchant category restrictions",
      "Solo & team card management",
      "3D Secure authentication built-in",
    ],
    useCases: [
      {
        title: "Employee Expense Management",
        description:
          "Provide employees with cards for business expenses while maintaining complete control over spending categories and limits.",
        benefits: [
          "Eliminate expense report paperwork",
          "Real-time spend visibility",
          "Automated receipt capture",
        ],
      },
      {
        title: "Vendor Payment Automation",
        description:
          "Generate virtual cards for recurring vendor payments with pre-set limits to reduce fraud risk and simplify reconciliation.",
        benefits: [
          "Unique card per vendor",
          "Automatic payment tracking",
          "Reduced fraud exposure",
        ],
      },
      {
        title: "Subscription & SaaS Management",
        description:
          "Create dedicated virtual cards for each software subscription to track spend and prevent unauthorized renewals.",
        benefits: [
          "Easy cancellation and budget control",
          "Clear spend attribution",
          "Prevent surprise charges",
        ],
      },
    ],
    stats: [
      {
        label: "Card Generation",
        value: "Instant",
        description: "Virtual cards ready in seconds",
      },
      {
        label: "Control Types",
        value: "20+",
        description: "Spending control options available",
      },
      {
        label: "Coverage",
        value: "180+",
        description: "Countries with card acceptance",
      },
    ],
  },

  payouts: {
    id: "payouts",
    name: "Global Payouts",
    tagline: "Execute cross-border payments",
    description:
      "Send money globally with same-day settlement options. Support for bank transfers, local payment methods, and wallet services across 89 countries.",
    icon: Zap,
    color: "primary",
    href: "/products/payouts",
    features: [
      "Same-day settlement in markets",
      "Local payment method support",
      "Instant Batch payout processing",
      "Automatic beneficiary validation",
      "Real-time status tracking",
      "Compliance checks built-in",
    ],
    useCases: [
      {
        title: "Supplier & Vendor Payments",
        description:
          "Pay international suppliers quickly and cost-effectively using local payment rails instead of expensive wire transfers.",
        benefits: [
          "Lower transaction fees",
          "Faster payment delivery",
          "Improved supplier relationships",
        ],
      },
      {
        title: "Contractor & Freelancer Payouts",
        description:
          "Streamline payments to global contractors and freelancers with flexible payout options and automated tax documentation.",
        benefits: [
          "Support for local payment preferences",
          "Automated compliance tracking",
          "Bulk payment processing",
        ],
      },
      {
        title: "Marketplace Settlements",
        description:
          "Enable marketplace and platform businesses to distribute funds to sellers and service providers globally.",
        benefits: [
          "Split payments and hold capabilities",
          "Multi-party settlement support",
          "Real-time payout status",
        ],
      },
    ],
    stats: [
      {
        label: "Settlement Speed",
        value: "Same-day",
        description: "Available in 40+ markets",
      },
      {
        label: "Payment Methods",
        value: "15+",
        description: "Including local rails and wallets",
      },
      {
        label: "Success Rate",
        value: "99.8%",
        description: "First-attempt success rate",
      },
    ],
  },

  fx: {
    id: "fx",
    name: "FX & Treasury",
    tagline: "Competitive rates with transparent pricing",
    description:
      "Access institutional FX rates with transparent pricing. Execute spot and forward contracts, hedge exposure, and optimize your global cash management.",
    icon: TrendingUp,
    color: "accent",
    href: "/products/fx-treasury",
    features: [
      "Real-time competitive FX rates",
      "Spot and forward contract execution",
      "Automated currency hedging",
      "Multi-currency sweep accounts",
      "Treasury optimization tools",
      "Risk exposure analytics",
    ],
    useCases: [
      {
        title: "FX Risk Management",
        description:
          "Protect your business from currency volatility with forward contracts and automated hedging strategies.",
        benefits: [
          "Lock in future exchange rates",
          "Reduce budget uncertainty",
          "Automate hedge rebalancing",
        ],
      },
      {
        title: "Working Capital Optimization",
        description:
          "Maximize returns on idle cash by automatically sweeping funds into interest-bearing accounts across currencies.",
        benefits: [
          "Automated cash positioning",
          "Yield optimization",
          "Liquidity management",
        ],
      },
      {
        title: "Cross-Border M&A",
        description:
          "Execute large currency conversions for mergers, acquisitions, or major international transactions with institutional pricing.",
        benefits: [
          "Dedicated relationship manager",
          "Institutional-grade rates",
          "Multi-leg transaction support",
        ],
      },
    ],
    stats: [
      {
        label: "Currency Pairs",
        value: "120+",
        description: "Direct conversion pairs available",
      },
      {
        label: "Rate Updates",
        value: "Real-time",
        description: "Live institutional pricing",
      },
      {
        label: "Contract Types",
        value: "Spot + Forward",
        description: "Flexible hedging options",
      },
    ],
  },

  travel: {
    id: "travel",
    name: "Travel Payments",
    tagline: "Optimize travel spend and card usage globally",
    description:
      "Purpose-built payment solutions for travel and expense management. Issue travel cards, track expenses in real-time, and manage multi-currency spending with zero foreign transaction fees.",
    icon: Plane,
    color: "primary",
    href: "/products/travel",
    features: [
      "Zero foreign transaction fees",
      "Multi-currency travel cards",
      "Real-time expense categorization",
      "Automatic receipt capture",
      "Travel-specific merchant controls",
      "Per-trip budget tracking",
    ],
    useCases: [
      {
        title: "Corporate Travel Programs",
        description:
          "Equip traveling employees with cards optimized for international use, with built-in policy enforcement and real-time spend tracking.",
        benefits: [
          "Eliminate FX fees on business travel",
          "Real-time policy compliance",
          "Automated expense reporting",
        ],
      },
      {
        title: "Event & Conference Management",
        description:
          "Manage spending for team events, conferences, and off-sites with dedicated cards and per-event budget controls.",
        benefits: [
          "Clear event cost attribution",
          "Team-wide spending visibility",
          "Simplified reconciliation",
        ],
      },
      {
        title: "Remote Team Operations",
        description:
          "Support globally distributed teams with cards that work seamlessly across borders and currencies.",
        benefits: [
          "No cross-border restrictions",
          "Local currency spending",
          "Unified expense tracking",
        ],
      },
    ],
    stats: [
      {
        label: "FX Fees",
        value: "0%",
        description: "No foreign transaction fees",
      },
      {
        label: "Acceptance",
        value: "40M+",
        description: "Merchants worldwide",
      },
      {
        label: "Categories",
        value: "Travel-focused",
        description: "Optimized merchant controls",
      },
    ],
  },

  api: {
    id: "api",
    name: "Developer APIs",
    tagline: "Build payment experiences with modern APIs",
    description:
      "Comprehensive REST APIs with language-specific SDKs. Integrate global payments, card issuing, and account management directly into your platform.",
    icon: Code,
    color: "accent",
    href: "/products/api",
    features: [
      "RESTful API architecture",
      "SDKs for major languages",
      "Webhook notifications",
      "Sandbox environment",
      "Comprehensive documentation",
      "Dedicated developer support",
    ],
    useCases: [
      {
        title: "Embedded Finance",
        description:
          "Integrate payment capabilities directly into your platform to offer banking services to your customers.",
        benefits: [
          "White-label account creation",
          "Programmatic card issuing",
          "Revenue share opportunities",
        ],
      },
      {
        title: "Marketplace Platforms",
        description:
          "Build seamless payment flows for multi-party marketplace transactions with split payments and payout automation.",
        benefits: [
          "Split payment logic",
          "Automated seller payouts",
          "Real-time settlement tracking",
        ],
      },
      {
        title: "Financial Operations Automation",
        description:
          "Automate treasury operations, reconciliation, and reporting by integrating directly with your ERP or accounting systems.",
        benefits: [
          "Automated reconciliation",
          "Real-time data sync",
          "Custom workflow integration",
        ],
      },
    ],
    stats: [
      {
        label: "Uptime",
        value: "99.99%",
        description: "API availability SLA",
      },
      {
        label: "Response Time",
        value: "<100ms",
        description: "Median API latency",
      },
      {
        label: "SDKs",
        value: "8+",
        description: "Language support",
      },
    ],
  },
};

export const productList = Object.values(products);

export function getProductById(id: string): Product | undefined {
  return products[id];
}

export function getProductsByCategory(category: "primary" | "accent"): Product[] {
  return productList.filter((product) => product.color === category);
}
