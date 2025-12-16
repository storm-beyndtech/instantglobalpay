"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Target, Eye, Rocket, Globe2, Zap, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionVisionItem {
	icon: React.ElementType;
	title: string;
	description: string;
	stats?: {
		value: string;
		label: string;
	};
}

const missionItems: MissionVisionItem[] = [
	{
		icon: Target,
		title: "Simplify Global Finance",
		description:
			"Make cross-border payments as seamless as domestic transfers. Eliminate complexity, hidden fees, and friction from international money movement.",
		stats: {
			value: "89",
			label: "Countries",
		},
	},
	{
		icon: Zap,
		title: "Speed Without Compromise",
		description:
			"Instant account creation, real-time settlements, and immediate card issuance. Build infrastructure that moves at the speed of modern business.",
		stats: {
			value: "<5s",
			label: "Avg. Processing",
		},
	},
	{
		icon: Users2,
		title: "Empower Businesses",
		description:
			"Give companies of all sizes access to enterprise-grade financial infrastructure. From startups to global enterprises, everyone deserves world-class tools.",
		stats: {
			value: "10K+",
			label: "Businesses",
		},
	},
];

const visionItems: MissionVisionItem[] = [
	{
		icon: Globe2,
		title: "Borderless Economy",
		description:
			"A world where geography doesn't dictate financial access. Where businesses can operate globally from day one without friction or barriers.",
	},
	{
		icon: Rocket,
		title: "Infrastructure for Innovation",
		description:
			"The foundation for the next generation of global businesses. Developer-friendly APIs that power everything from neobanks to marketplaces.",
	},
	{
		icon: Eye,
		title: "Transparent & Trust-First",
		description:
			"Financial infrastructure built on clarity. No hidden fees, no surprise charges—just transparent pricing and reliable service at scale.",
	},
];

export function MissionVisionSection() {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

	return (
		<section ref={containerRef} className="section-spacing-lg relative overflow-hidden">
			{/* Decorative Background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
			</div>

			<div className="container-wide container-padding">
				{/* Mission Section */}
				<div className="mb-32">
					<motion.div className="text-center mb-16" style={{ opacity }}>
						<div className="inline-flex items-center gap-3 mb-4">
							<div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
								<Target className="h-6 w-6 text-primary-600" />
							</div>
						</div>
						<h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
							Our{" "}
							<span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
								Mission
							</span>
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
							Building the financial infrastructure that powers global business
						</p>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
						{missionItems.map((item, index) => {
							const Icon = item.icon;
							return (
								<motion.div
									key={item.title}
									initial={{ opacity: 0, y: 40 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: "-100px" }}
									transition={{ duration: 0.6, delay: index * 0.15 }}
								>
									<Card
										variant="glass"
										padding="lg"
										className="h-full hover:shadow-depth-lg transition-all duration-300 group"
									>
										<div className="flex flex-col h-full">
											<div className="flex items-start justify-between mb-4">
												<div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
													<Icon className="h-7 w-7 text-primary-600" />
												</div>
												{item.stats && (
													<div className="text-right">
														<div className="text-2xl font-bold text-primary-600">
															{item.stats.value}
														</div>
														<div className="text-xs text-muted-foreground uppercase tracking-wider">
															{item.stats.label}
														</div>
													</div>
												)}
											</div>
											<h3 className="text-xl font-bold mb-3">{item.title}</h3>
											<p className="text-sm text-muted-foreground leading-relaxed">
												{item.description}
											</p>
										</div>
									</Card>
								</motion.div>
							);
						})}
					</div>
				</div>

				{/* Vision Section with Sticky Typography */}
				<div className="grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
					{/* Sticky Left Column */}
					<motion.div className="lg:sticky lg:top-32" style={{ y }}>
						<div className="inline-flex items-center gap-3 mb-6">
							<div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center">
								<Eye className="h-6 w-6 text-accent-600" />
							</div>
						</div>
						<h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
							Our{" "}
							<span className="bg-gradient-to-r from-accent-500 to-purple-600 bg-clip-text text-transparent">
								Vision
							</span>
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed mb-8">
							We envision a world where financial infrastructure is invisible, instant, and
							universally accessible—enabling businesses to focus on growth, not payments.
						</p>
						<div className="flex flex-wrap gap-2">
							{["Borderless", "Instant", "Transparent", "Scalable"].map((tag) => (
								<div
									key={tag}
									className="px-4 py-2 rounded-full bg-accent-500/10 text-accent-600 text-sm font-medium"
								>
									{tag}
								</div>
							))}
						</div>
					</motion.div>

					{/* Right Column - Scrolling Cards */}
					<div className="space-y-6">
						{visionItems.map((item, index) => {
							const Icon = item.icon;
							return (
								<motion.div
									key={item.title}
									initial={{ opacity: 0, x: 40 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true, margin: "-100px" }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
								>
									<Card
										variant="elevated"
										padding="lg"
										className="hover:shadow-depth-xl transition-all duration-300"
									>
										<div className="flex gap-4">
											<div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0">
												<Icon className="h-6 w-6 text-accent-600" />
											</div>
											<div className="flex-1">
												<h3 className="text-lg font-bold mb-2">{item.title}</h3>
												<p className="text-sm text-muted-foreground leading-relaxed">
													{item.description}
												</p>
											</div>
										</div>
									</Card>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
