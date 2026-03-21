"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import { BackgroundGrid, SubtleBlurOrbs } from "@/components/marketing/visuals";
import { BrandLogo } from "@/components/layout/brand-logo";
import {
	ArrowRight,
	Mail,
	Lock,
	Shield,
	KeyRound,
	CheckCircle2,
	Sparkles,
	Eye,
	EyeOff,
} from "lucide-react";

type Step = "request" | "verify" | "success";

async function request<T>(path: string, body: Record<string, unknown>): Promise<T> {
	const res = await fetch(path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const msg = await res.text();
		throw new Error(msg || res.statusText);
	}

	return res.json();
}

const securityNotes = [
	{
		icon: Shield,
		title: "Secure by design",
		description: "OTP codes expire after 5 minutes",
	},
	{
		icon: KeyRound,
		title: "One-time access",
		description: "Each code can be used only once",
	},
	{
		icon: CheckCircle2,
		title: "Verified delivery",
		description: "Reset code sent to your email",
	},
];

export default function ForgotPasswordPage() {
	const [step, setStep] = useState<Step>("request");
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleRequest = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setMessage(null);
		setLoading(true);

		try {
			const result = await request<{ message?: string }>("/api/users/password-reset/request", { email });
			setMessage(result.message || "Reset code sent. Check your email.");
			setStep("verify");
		} catch (err) {
			setError((err as Error).message || "Unable to send reset code.");
		} finally {
			setLoading(false);
		}
	};

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setMessage(null);

		if (newPassword.length < 8) {
			setError("Password must be at least 8 characters long.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);
		try {
			const result = await request<{ message?: string }>("/api/users/password-reset/verify", {
				email,
				code,
				newPassword,
			});
			setMessage(result.message || "Password reset successful.");
			setStep("success");
		} catch (err) {
			setError((err as Error).message || "Unable to reset password.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			<div className="absolute inset-0 -z-10">
				<BackgroundGrid variant="dots" cellSize={40} opacity={0.1} />
				<SubtleBlurOrbs context="marketing" />
			</div>

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
							<span className="text-sm text-muted-foreground max-sm:hidden">Remembered your password?</span>
							<Link href="/login">
								<Button variant="outline" size="default">
									Back to Sign In
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="flex min-h-screen items-center justify-center px-6 py-24">
				<div className="w-full max-w-6xl">
					<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							className="w-full max-w-md mx-auto lg:mx-0"
						>
							<div className="mb-8">
								<div className="inline-flex items-center gap-2 mb-4">
									<div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
										<Sparkles className="h-5 w-5 text-primary-600" />
									</div>
								</div>
								<h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Reset your password</h1>
								<p className="text-lg text-muted-foreground">
									{step === "request"
										? "We will send a 6-digit OTP code to your email."
										: "Enter the code and choose a new password."}
								</p>
							</div>

							<Card variant="glass" padding="lg" className="shadow-depth-lg">
								{step === "request" && (
									<form onSubmit={handleRequest} className="space-y-5">
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

										{error && (
											<Alert variant="destructive">
												<AlertDescription>{error}</AlertDescription>
											</Alert>
										)}

										{message && (
											<Alert>
												<AlertDescription>{message}</AlertDescription>
											</Alert>
										)}

										<Button
											type="submit"
											variant="primary"
											size="lg"
											className="w-full gap-2 group shadow-glow-green"
											disabled={loading}
										>
											{loading ? (
												"Sending code..."
											) : (
												<>
													<span>Send reset code</span>
													<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
												</>
											)}
										</Button>
									</form>
								)}

								{step === "verify" && (
									<form onSubmit={handleVerify} className="space-y-5">
										<div className="space-y-2">
											<Label htmlFor="code" className="text-sm font-medium">
												OTP Code
											</Label>
											<Input
												id="code"
												type="text"
												inputMode="numeric"
												autoComplete="one-time-code"
												placeholder="Enter 6-digit code"
												value={code}
												onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="newPassword" className="text-sm font-medium">
												New Password
											</Label>
											<div className="relative">
												<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													id="newPassword"
													type={showNewPassword ? "text" : "password"}
													required
													value={newPassword}
													onChange={(e) => setNewPassword(e.target.value)}
													placeholder="••••••••••"
													className="pl-10 pr-10"
												/>
												<button
													type="button"
													onClick={() => setShowNewPassword((prev) => !prev)}
													aria-label={showNewPassword ? "Hide password" : "Show password"}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
												>
													{showNewPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="confirmPassword" className="text-sm font-medium">
												Confirm Password
											</Label>
											<div className="relative">
												<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													id="confirmPassword"
													type={showConfirmPassword ? "text" : "password"}
													required
													value={confirmPassword}
													onChange={(e) => setConfirmPassword(e.target.value)}
													placeholder="••••••••••"
													className="pl-10 pr-10"
												/>
												<button
													type="button"
													onClick={() => setShowConfirmPassword((prev) => !prev)}
													aria-label={showConfirmPassword ? "Hide confirmation" : "Show confirmation"}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
												>
													{showConfirmPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</div>

										<div className="flex items-center justify-between text-xs text-muted-foreground">
											<span>Password must be at least 8 characters</span>
											<button
												type="button"
												onClick={() => {
													setStep("request");
													setCode("");
													setNewPassword("");
													setConfirmPassword("");
												}}
												className="text-primary-600 hover:text-primary-700 font-medium"
											>
												Change email
											</button>
										</div>

										{error && (
											<Alert variant="destructive">
												<AlertDescription>{error}</AlertDescription>
											</Alert>
										)}

										{message && (
											<Alert>
												<AlertDescription>{message}</AlertDescription>
											</Alert>
										)}

										<Button
											type="submit"
											variant="primary"
											size="lg"
											className="w-full gap-2 group shadow-glow-green"
											disabled={loading}
										>
											{loading ? (
												"Resetting password..."
											) : (
												<>
													<span>Reset password</span>
													<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
												</>
											)}
										</Button>
									</form>
								)}

								{step === "success" && (
									<div className="space-y-5 text-center">
										<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10">
											<CheckCircle2 className="h-6 w-6 text-primary-600" />
										</div>
										<div>
											<h2 className="text-xl font-semibold mb-2">Password updated</h2>
											<p className="text-sm text-muted-foreground">
												Your password has been reset successfully. You can now sign in.
											</p>
										</div>
										<Button asChild variant="primary" size="lg" className="w-full shadow-glow-green">
											<Link href="/login">Continue to Sign In</Link>
										</Button>
									</div>
								)}
							</Card>

							{step !== "success" && (
								<p className="text-center text-sm text-muted-foreground mt-6">
									Need help?{" "}
									<Link href="/contact" className="text-primary-600 hover:text-primary-700">
										Contact support
									</Link>
								</p>
							)}
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="hidden lg:block"
						>
							<div className="space-y-8">
								<div>
									<h2 className="text-3xl font-bold mb-4">
										Protecting your{" "}
										<span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
											InstantGlobal account
										</span>
									</h2>
									<p className="text-lg text-muted-foreground leading-relaxed">
										Our OTP-based reset keeps your account secure while getting you back in quickly.
									</p>
								</div>

								<div className="space-y-4">
									{securityNotes.map((note, index) => {
										const Icon = note.icon;
										return (
											<motion.div
												key={note.title}
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
															<h3 className="font-semibold mb-1">{note.title}</h3>
															<p className="text-sm text-muted-foreground">{note.description}</p>
														</div>
													</div>
												</Card>
											</motion.div>
										);
									})}
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
