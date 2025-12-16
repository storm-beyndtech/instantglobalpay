import {
	HeroOverkill,
	ProductGrid,
	TrustedByMarquee,
	CustomerReviewsMarquee,
	FAQSection,
	SupportCTA,
	UseCaseSection,
	ContentImageSection,
	GlobalCoverageMap,
	PlatformCapabilities,
	IntegrationPartners,
	MapStatsSection,
	HomeVideoSection,
	type FAQ,
} from "@/components/marketing";
import { Shield, Clock, Lock, DollarSign } from "lucide-react";
import codeAsset from "@/assets/code.svg";
import multiCurrencyAsset from "@/assets/fx.svg";

// Use cases for the homepage - using UseCase type from products.ts
const useCases = [
	{
		title: "International Expansion",
		description:
			"Launch in new markets with local currency accounts, card issuing, and global payouts from one platform.",
		benefits: [
			"Open accounts in 50+ currencies instantly",
			"Issue cards to global teams and employees",
			"Execute same-day payouts to 89 countries",
		],
	},
	{
		title: "Expense & Card Management",
		description:
			"Eliminate expense reports with instant virtual cards, granular controls, and automated reconciliation.",
		benefits: [
			"Generate virtual cards in under 5 seconds",
			"Real-time spend visibility with live controls",
			"Automatic receipt capture and sync to ERP",
		],
	},
	{
		title: "Cross-Border Payments",
		description:
			"Pay suppliers and vendors globally with competitive FX rates and transparent pricing—no hidden fees.",
		benefits: [
			"Same-day settlement in 50+ major markets",
			"Support for 15+ local payment methods",
			"99.8% first-attempt payment success rate",
		],
	},
];

// FAQs for the homepage
const faqs: FAQ[] = [
	{
		question: "How quickly can I get started?",
		answer:
			"Create your account and start issuing cards or opening currency accounts within minutes. Streamlined onboarding with automated compliance checks and instant activation.",
	},
	{
		question: "What countries and currencies do you support?",
		answer:
			"We support 50+ currencies and operate in 89 countries. Hold multi-currency balances, issue cards globally, and execute payouts using local rails in USD, EUR, GBP, JPY, AUD, CAD, and more.",
	},
	{
		question: "How do you ensure security and compliance?",
		answer:
			"PCI DSS Level 1 certified and SOC 2 compliant. Bank-level security with MFA, encryption at rest and in transit, real-time fraud detection, and automated sanctions screening.",
	},
	{
		question: "What are your pricing and fees?",
		answer:
			"Transparent, volume-based pricing. Card issuing from $2, FX conversions from 0.5%, payouts from $1. Volume discounts for enterprise. No monthly minimums or platform fees.",
	},
	{
		question: "Can I integrate with my existing systems?",
		answer:
			"Yes. Comprehensive REST APIs with SDKs in 8+ languages, webhooks, and detailed docs. API-first architecture integrates with ERPs, accounting systems, and custom platforms. Full sandbox available.",
	},
	{
		question: "What kind of support do you offer?",
		answer:
			"24/7 email and chat support with <2 hour response times. Enterprise customers get dedicated account managers, priority phone support, and private Slack channels. Developer support for API integrations included.",
	},
];

export default function HomePage() {
	return (
		<>
			{/* Hero Section */}
			<HeroOverkill />

			{/* Trusted By Marquee */}
			<div className="sm:py-20">
				<TrustedByMarquee />
			</div>

			{/* Map Stats Section - New ideal stat card design */}
			<MapStatsSection />

			{/* Products Grid */}
			<section className="section-spacing-sm bg-ambient-marketing-section w-full relative">
				<div className="container-wide container-padding relative z-10">
					<ProductGrid variant="glass" showCTA />
				</div>
			</section>

			{/* Global Coverage Map */}
			<GlobalCoverageMap variant="default" />

			{/* Use Cases Section */}
			<section className="section-spacing-sm bg-ambient-marketing-section w-full relative">
				<div className="container-wide container-padding relative z-10">
					<div className="mb-12">
						<h2 className="text-2xl mb-4 font-mono">USE CASES</h2>
					</div>

					<UseCaseSection useCases={useCases} variant="glass" />
				</div>
			</section>

			{/* Multi-Currency Accounts */}
			<ContentImageSection
				title="Hold and manage 50+ global currencies"
				description="Open local currency accounts instantly with no paperwork. Convert at competitive rates and pay suppliers in their preferred currency."
				features={[
					"Instant account opening in 50+ currencies",
					"Real-time FX rates with clear pricing",
					"Forward contracts to lock in rates",
					"Zero minimum balance requirements",
				]}
				imagePosition="left"
				imagePlaceholder={{
					width: 800,
					height: 600,
					alt: "Multi-currency dashboard",
					src: multiCurrencyAsset,
				}}
				cta={{
					label: "View supported currencies",
					href: "/products/global-accounts",
				}}
				variant="elevated"
			/>

			{/* Home Video Section - Revolut-style */}
			<HomeVideoSection />

			{/* API-First Infrastructure */}
			<ContentImageSection
				title="Built for devs, loved by finance"
				description="API-first architecture with complete control over payments, card issuance, and global payouts. Integrate effortlessly using robust documentation, SDKs in 8+ languages, and real-time sandbox tools engineered for rapid development. Build, automate, and scale your financial flows with confidence — without compromise."
				description2="Designed for innovators, SaaS platforms, neobanks, marketplaces, payment-first startups. Power everything from instant transfers to recurring billing, treasury management, partner disbursement, and advanced card programs — all from a single unified API layer. Your infrastructure, your rules."
				features={[
					"RESTful API with complete documentation",
					"Real-time webhooks for instant notifications",
					"Full sandbox environment for safe testing",
					"99.99% uptime, 24/7 system monitoring",
				]}
				imagePosition="right"
				imagePlaceholder={{
					width: 800,
					height: 600,
					alt: "Developer API dashboard",
					src: codeAsset,
				}}
				cta={{
					label: "View API docs",
					href: "/products/api",
				}}
				variant="default"
			/>

			{/* Platform Capabilities */}
			<PlatformCapabilities />

			{/* Integration Partners */}
			<IntegrationPartners variant="default" />

			{/* Security & Compliance Strip */}
			<section className="section-spacing-md bg-muted/30 border-y border-border w-full relative">
				<div className="container-wide container-padding relative z-10">
					<div className="text-center mb-12">
						<h2 className="text-display-md mb-4">Enterprise-grade security</h2>
						<p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto font-medium">
							Bank-level infrastructure with compliance built in
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{
								icon: Shield,
								title: "PCI DSS Level 1",
								description: "Highest security certification",
							},
							{
								icon: Lock,
								title: "SOC 2 Type II",
								description: "Independently audited",
							},
							{
								icon: DollarSign,
								title: "Funds Protection",
								description: "Segregated client accounts",
							},
							{
								icon: Clock,
								title: "24/7 Monitoring",
								description: "Real-time fraud detection",
							},
						].map((item, index) => (
							<div
								key={index}
								className="flex flex-col items-center text-center p-6 rounded-xl bg-glass-card border-glass shadow-glass"
							>
								<div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
									<item.icon className="h-7 w-7 text-primary-600" />
								</div>
								<h3 className="text-lg font-semibold mb-2">{item.title}</h3>
								<p className="text-sm text-muted-foreground">{item.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Customer Reviews Marquee */}
			<CustomerReviewsMarquee />

			{/* FAQ Section */}
			<FAQSection title="Frequently asked questions" faqs={faqs} columns={1} />

			{/* Final CTA */}
			<section className="section-spacing-lg w-full">
				<div className="container-wide container-padding">
					<SupportCTA variant="glass" showAllOptions={false} />
				</div>
			</section>
		</>
	);
}
