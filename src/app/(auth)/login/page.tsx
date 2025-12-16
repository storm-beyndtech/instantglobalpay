"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { BackgroundGrid, SubtleBlurOrbs } from "@/components/marketing/visuals";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import {
	ArrowRight,
	Mail,
	Lock,
	Shield,
	CheckCircle2,
	Sparkles,
	Globe,
	Zap,
} from "lucide-react";

const benefits = [
	{
		icon: Globe,
		title: "Global Accounts",
		description: "Multi-currency accounts in 50+ currencies",
	},
	{
		icon: Zap,
		title: "Instant Cards",
		description: "Virtual & physical card issuing worldwide",
	},
	{
		icon: Shield,
		title: "Enterprise Security",
		description: "PCI DSS Level 1 & SOC 2 certified",
	},
];

export default function LoginPage() {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login(email, password);
		} catch (err) {
			setError((err as Error).message || "Unable to sign in. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			{/* Background Elements */}
			<div className="absolute inset-0 -z-10">
				<BackgroundGrid variant="dots" cellSize={40} opacity={0.1} />
				<SubtleBlurOrbs context="marketing" />
			</div>

			{/* Top Navigation */}
			<div className="absolute top-0 left-0 right-0 z-50 bg-glass-nav border-b border-glass backdrop-blur-xl">
				<div className="container-wide container-padding">
					<div className="flex h-16 items-center justify-between">
						<Link href="/" className="flex items-center group">
							<motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
								<BrandLogo size="sm" />
							</motion.div>
						</Link>
						<div className="flex items-center gap-4">
							<ThemeToggle />
							<span className="text-sm text-muted-foreground max-sm:hidden">New to InstantGlobal?</span>
							<Link href="/signup">
								<Button variant="outline" size="default">
									Create Account
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex min-h-screen items-center justify-center px-6 py-24">
				<div className="w-full max-w-6xl">
					<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
						{/* Left Column - Form */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							className="w-full max-w-md mx-auto lg:mx-0"
						>
							{/* Header */}
							<div className="mb-8">
								<div className="inline-flex items-center gap-2 mb-4">
									<div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
										<Sparkles className="h-5 w-5 text-primary-600" />
									</div>
								</div>
								<h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
									Welcome back
								</h1>
								<p className="text-lg text-muted-foreground">
									Sign in to access your global financial platform
								</p>
							</div>

							{/* Form Card */}
							<Card variant="glass" padding="lg" className="shadow-depth-lg">
								<form onSubmit={handleSubmit} className="space-y-5">
									{/* Email Field */}
									<div className="space-y-2">
										<Label htmlFor="email" className="text-sm font-medium">
											Email Address
										</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
											<Input
												id="email"
												type="email"
												required
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="you@company.com"
												className="pl-10"
											/>
										</div>
									</div>

									{/* Password Field */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<Label htmlFor="password" className="text-sm font-medium">
												Password
											</Label>
											<Link
												href="/forgot-password"
												className="text-xs text-primary-600 hover:text-primary-700 font-medium"
											>
												Forgot password?
											</Link>
										</div>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
											<Input
												id="password"
												type="password"
												required
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												placeholder="••••••••••"
												className="pl-10"
											/>
										</div>
									</div>

									{/* Error Alert */}
									{error && (
										<Alert variant="destructive">
											<AlertDescription>{error}</AlertDescription>
										</Alert>
									)}

									{/* Submit Button */}
									<Button
										type="submit"
										variant="primary"
										size="lg"
										className="w-full gap-2 group shadow-glow-green"
										disabled={loading}
									>
										{loading ? (
											"Signing in..."
										) : (
											<>
												<span>Sign In</span>
												<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
											</>
										)}
									</Button>
								</form>

								{/* Divider */}
								<div className="relative my-6">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-border" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="bg-card px-2 text-muted-foreground">Or</span>
									</div>
								</div>

								{/* Social Auth */}
								<div className="space-y-3">
									<Button variant="outline" size="lg" className="w-full" type="button">
										<svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
											<path
												fill="currentColor"
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											/>
											<path
												fill="currentColor"
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											/>
											<path
												fill="currentColor"
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											/>
											<path
												fill="currentColor"
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											/>
										</svg>
										Continue with Google
									</Button>

									<Button variant="outline" size="lg" className="w-full" type="button">
										<svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
										</svg>
										Continue with GitHub
									</Button>
								</div>
							</Card>

							{/* Footer */}
							<p className="text-center text-sm text-muted-foreground mt-6">
								By signing in, you agree to our{" "}
								<Link href="/legal/terms" className="text-primary-600 hover:text-primary-700">
									Terms
								</Link>{" "}
								and{" "}
								<Link href="/legal/privacy" className="text-primary-600 hover:text-primary-700">
									Privacy Policy
								</Link>
							</p>
						</motion.div>

						{/* Right Column - Benefits */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="hidden lg:block"
						>
							<div className="space-y-8">
								<div>
									<h2 className="text-3xl font-bold mb-4">
										Financial infrastructure for{" "}
										<span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
											global business
										</span>
									</h2>
									<p className="text-lg text-muted-foreground leading-relaxed">
										Access enterprise-grade payment infrastructure trusted by 10,000+ businesses
										worldwide.
									</p>
								</div>

								<div className="space-y-4">
									{benefits.map((benefit, index) => {
										const Icon = benefit.icon;
										return (
											<motion.div
												key={benefit.title}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
											>
												<Card variant="glass" padding="lg" className="hover:shadow-depth-md transition-all">
													<div className="flex items-start gap-4">
														<div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
															<Icon className="h-6 w-6 text-primary-600" />
														</div>
														<div>
															<h3 className="font-semibold mb-1">{benefit.title}</h3>
															<p className="text-sm text-muted-foreground">
																{benefit.description}
															</p>
														</div>
													</div>
												</Card>
											</motion.div>
										);
									})}
								</div>

								{/* Trust Indicators */}
								<Card variant="elevated" padding="lg" className="bg-muted/30">
									<div className="flex items-center gap-4 flex-wrap">
										<div className="flex items-center gap-2">
											<CheckCircle2 className="h-4 w-4 text-primary-600" />
											<span className="text-sm font-medium">PCI DSS Level 1</span>
										</div>
										<div className="flex items-center gap-2">
											<CheckCircle2 className="h-4 w-4 text-primary-600" />
											<span className="text-sm font-medium">SOC 2 Certified</span>
										</div>
										<div className="flex items-center gap-2">
											<CheckCircle2 className="h-4 w-4 text-primary-600" />
											<span className="text-sm font-medium">99.99% Uptime</span>
										</div>
									</div>
								</Card>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
