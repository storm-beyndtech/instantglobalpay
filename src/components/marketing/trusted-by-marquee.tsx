"use client";

import React from "react";
import { LogoMarquee, ReviewMarquee, MarqueeReview } from "./visuals";

// ---------------- DATA ----------------
const trustedByLogos = [
	"TechCorp",
	"GlobalScale",
	"PayFlow",
	"FinanceHub",
	"CloudPay",
	"DataFlow",
	"Velocity",
	"Nexus",
	"Summit",
	"Frontier",
	"Quantum",
	"Zenith",
];

const customerReviews = [
	{
		author: "Sarah Chen",
		role: "CFO",
		company: "TechCorp",
		content:
			"InstantGlobal transformed how we handle global payments. API integration was seamless — live in 2 weeks.",
		rating: 5,
	},
	{
		author: "Michael Roberts",
		role: "Head of Finance",
		company: "GlobalScale",
		content: "We cut payment processing costs by 40%. Multi-currency support is elite.",
		rating: 5,
	},
	{
		author: "Emily Zhang",
		role: "VP Operations",
		company: "PayFlow",
		content: "Virtual card issuing is unbelievably fast — we love it.",
		rating: 5,
	},
	{
		author: "David Kumar",
		role: "CTO",
		company: "FinanceHub",
		content: "Best developer experience we've used. Documentation is top-notch.",
		rating: 5,
	},
	{
		author: "Lisa Martinez",
		role: "Finance Director",
		company: "CloudPay",
		content: "FX rates consistently beat our old provider — saving monthly.",
		rating: 5,
	},
	{
		author: "James Wilson",
		role: "CEO",
		company: "DataFlow",
		content: "Scaled effortlessly — over $10M processed Q1.",
		rating: 5,
	},
];

// Duplicate to remove loop glitch
function duplicate<T>(arr: T[]): T[] {
	return [...arr, ...arr];
}

// ---------------- UI ----------------
function TextLogo({ name }: { name: string }) {
	return (
		<div className="px-6 py-3 text-xl font-bold tracking-tight text-gray-500/70 transition-all duration-300 hover:text-emerald-400 whitespace-nowrap">
			{name}
		</div>
	);
}

// ---------------- COMPONENT EXPORTS ----------------
export function TrustedByMarquee() {
	const logos = duplicate(trustedByLogos.map((name, i) => <TextLogo key={i} name={name} />));

	return <LogoMarquee logos={logos} duration={30} />;
}

export function TrustedByMarqueeCompact() {
	const logos = duplicate(trustedByLogos.slice(0, 6).map((name, i) => <TextLogo key={i} name={name} />));

	return <LogoMarquee logos={logos} duration={24} />;
}

export function CustomerReviewsMarquee() {
	const reviews = duplicate(customerReviews.map((review, i) => <MarqueeReview key={i} {...review} />));

	return (
		<ReviewMarquee
			reviews={reviews}
			title="What our customers say"
			description="feedback from global businesses"
      duration={40}
		/>
	);
}
