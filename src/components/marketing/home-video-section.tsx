"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HomeVideoSectionProps {
	className?: string;
}

export function HomeVideoSection({ className }: HomeVideoSectionProps) {
	const videoRef = React.useRef<HTMLVideoElement>(null);

	return (
		<section className={cn("w-full relative overflow-hidden", className)}>
			{/* Light mode: dark surround. Dark mode: seamless blend */}
			<div className="absolute inset-0 bg-muted/10 dark:bg-transparent" />

			{/* Video Container */}
			<motion.div
				className="w-full"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				{/* Dark frame for light mode */}
				<div className="relative">
					{/* Outer dark container - more visible in light mode */}
					<div className="absolute -inset-8 bg-black" />

					{/* Video element */}
					<div className="relative aspect-video">
						<video
							ref={videoRef}
							className="w-full h-full object-contain"
							autoPlay
							loop
							muted
							playsInline
							poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%23000' width='1920' height='1080'/%3E%3C/svg%3E"
						>
							<source
								src="https://assets.revolut.com/published-assets-v3/a07a910c-0df4-45f5-b0ca-7864377877a3/0da52da5-f59c-4863-a918-d8861c032000.mp4"
								type="video/mp4"
							/>
							Your browser does not support the video tag.
						</video>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
