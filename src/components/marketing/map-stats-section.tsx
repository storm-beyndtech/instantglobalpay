"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, Building, Users } from "lucide-react";
import { HeroOrbit } from "./visuals/hero-orbit";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";

export interface MapStatsSectionProps {
	className?: string;
}

const stats = [
	{
		icon: Globe,
		label: "Countries",
		value: "89",
		description: "Global coverage",
	},
	{
		icon: MapPin,
		label: "Currencies",
		value: "50+",
		description: "Supported",
	},
	{
		icon: Building,
		label: "Payment Rails",
		value: "15+",
		description: "Local methods",
	},
	{
		icon: Users,
		label: "Active Users",
		value: "10K+",
		description: "Businesses",
	},
];

export function MapStatsSection({ className }: MapStatsSectionProps) {
	return (
		<section className={cn("section-spacing-sm w-full relative overflow-hidden", className)}>
			{/* Background */}
			<div className="absolute inset-0 bg-ambient-marketing-section" />

			<div className="container-wide container-padding relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
					{/* Left: Map with Orbital Circle */}
					<motion.div
						className="relative h-[400px] lg:h-[500px]"
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.8 }}
					>
						{/* Hero Orbit Circle Motif */}
						<HeroOrbit size="lg" opacity={0.4} />

						{/* Map SVG */}
						<motion.div
							className="absolute inset-0 flex items-center justify-center"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 1, delay: 0.2 }}
						>
							<div className="relative w-full h-full max-w-[500px] max-h-[400px]">
								<img
									src="/map.svg"
									alt="Global coverage map"
									className="w-full h-full object-contain opacity-70 dark:opacity-60"
								/>
							</div>
						</motion.div>

						{/* Decorative glow */}
						<motion.div
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.3, 0.5, 0.3],
							}}
							transition={{
								duration: 8,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>
					</motion.div>

					{/* Right: Stat Cards */}
					<motion.div
						className="grid grid-cols-2 gap-4 lg:gap-6"
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.8, delay: 0.3 }}
					>
						{stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
							>
								<StatCard
									icon={stat.icon}
									label={stat.label}
									value={stat.value}
									description={stat.description}
								/>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
