"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface IntegrationPartnersProps {
	className?: string;
	variant?: "default" | "minimal";
}

const integrationCategories = [
	{
		category: "ACCOUNTING",
		partners: [
			{ name: "QuickBooks", width: 140 },
			{ name: "Xero", width: 100 },
			{ name: "NetSuite", width: 130 },
			{ name: "Sage", width: 90 },
		],
	},
	{
		category: "BANKING",
		partners: [
			{ name: "Plaid", width: 100 },
			{ name: "Stripe", width: 110 },
			{ name: "Wise", width: 90 },
			{ name: "Circle", width: 100 },
		],
	},
	{
		category: "ERP & COMMERCE",
		partners: [
			{ name: "SAP", width: 80 },
			{ name: "Shopify", width: 120 },
			{ name: "WooCommerce", width: 150 },
			{ name: "Oracle", width: 110 },
		],
	},
	{
		category: "DEVELOPER",
		partners: [
			{ name: "GitHub", width: 110 },
			{ name: "Zapier", width: 110 },
			{ name: "Postman", width: 120 },
			{ name: "Slack", width: 100 },
		],
	},
];

export function IntegrationPartners({ className, variant = "default" }: IntegrationPartnersProps) {
	return (
		<section
			className={cn(
				"section-spacing-lg w-full relative overflow-hidden",
				variant === "minimal" && "py-16",
				className,
			)}
		>
			{/* Background Pattern */}
			{variant === "default" && (
				<div className="absolute inset-0 opacity-[0.02]">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
							backgroundSize: "48px 48px",
						}}
					/>
				</div>
			)}

			<div className="container-wide container-padding relative z-10">
				{/* Section Header */}
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.6 }}
				>
					<Badge variant="default" className="mb-4">
						INTEGRATIONS
					</Badge>
					<h2 className="text-display-lg mb-4">Sync your existing tools</h2>
					<p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto font-medium">
						Pre-built integrations with leading accounting, ERP, and payment platforms
					</p>
				</motion.div>

				{/* Integration Categories */}
				<div className="space-y-12">
					{integrationCategories.map((category, categoryIndex) => (
						<motion.div
							key={category.category}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
						>
							{/* Category Label */}
							<div className="flex items-center gap-3 mb-6">
								<div className="h-px flex-grow bg-gradient-to-r from-transparent via-border to-transparent" />
								<Badge variant="outline" className="text-[10px] font-semibold tracking-wider px-3 py-1">
									{category.category}
								</Badge>
								<div className="h-px flex-grow bg-gradient-to-r from-transparent via-border to-transparent" />
							</div>

							{/* Partner Logos */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
								{category.partners.map((partner, partnerIndex) => (
									<motion.div
										key={partner.name}
										className="group relative"
										initial={{ opacity: 0, scale: 0.9 }}
										whileInView={{ opacity: 1, scale: 1 }}
										viewport={{ once: true }}
										transition={{
											duration: 0.4,
											delay: categoryIndex * 0.1 + partnerIndex * 0.05,
										}}
										whileHover={{ scale: 1.05 }}
									>
										<div className="relative flex items-center justify-center h-24 rounded-xl bg-glass-card border-glass shadow-glass hover:shadow-depth transition-all duration-300">
											{/* Logo Placeholder with Name */}
											<div className="flex flex-col items-center justify-center gap-2">
												<div
													className="h-8 rounded bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10"
													style={{ width: partner.width }}
												/>
												<p className="text-sm font-semibold text-muted-foreground/80 group-hover:text-foreground transition-colors">
													{partner.name}
												</p>
											</div>

											{/* Hover Glow Effect */}
											<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 transition-all duration-300" />
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					))}
				</div>

				{/* Bottom Note */}
				<motion.div
					className="mt-16 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.5 }}
				>
					<p className="text-sm text-muted-foreground mb-3">
						Don't see your tool? We also offer custom integrations.
					</p>
					<a
						href="/contact"
						className="text-primary-600 hover:text-primary-700 font-semibold text-sm underline underline-offset-4"
					>
						Contact us to discuss your integration needs
					</a>
				</motion.div>
			</div>
		</section>
	);
}

/**
 * Simplified version showing just partner logos
 */
export function IntegrationPartnersSimple({ className }: { className?: string }) {
	const allPartners = integrationCategories.flatMap((cat) => cat.partners);

	return (
		<section className={cn("py-12 w-full", className)}>
			<div className="container-wide container-padding">
				<div className="text-center mb-8">
					<p className="text-sm font-semibold text-muted-foreground/80 uppercase tracking-wider">
						Integrates with
					</p>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-8">
					{allPartners.slice(0, 8).map((partner) => (
						<div
							key={partner.name}
							className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
						>
							<div
								className="h-6 rounded bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/20"
								style={{ width: partner.width * 0.8 }}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
