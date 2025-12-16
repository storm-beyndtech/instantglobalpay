import { DashboardShell } from "@/components/dashboard";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, TrendingUp, CreditCard, Globe, Zap } from "lucide-react";

export default function DashboardPage() {
	return (
		<DashboardShell pageTitle="Overview" pageDescription="Monitor your global payment operations">
			<div className="space-y-8">
				{/* Key Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<MetricCard
						variant="elevated"
						label="Total Balance"
						value="$2.4M"
						description="Across all currencies"
						trend="up"
						change={12.5}
					/>

					<MetricCard
						variant="elevated"
						label="This Month"
						value="$847K"
						description="Transaction volume"
						trend="up"
						change={8.2}
					/>

					<MetricCard variant="elevated" label="Active Cards" value="124" description="Virtual + Physical" />

					<MetricCard
						variant="elevated"
						label="Success Rate"
						value="99.8%"
						description="Last 30 days"
            trend="up"
            change={0.3}
					/>
				</div>

				{/* Quick Actions */}
				<Card variant="elevated" padding="lg">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold">Quick Actions</h3>
								<p className="text-sm text-muted-foreground">Common tasks and operations</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<button className="flex flex-col items-start gap-3 p-4 rounded-lg border border-border hover:border-accent-500/50 hover:bg-accent-500/5 transition-all text-left group">
								<div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
									<Zap className="h-5 w-5 text-accent-600" />
								</div>
								<div>
									<p className="font-medium text-sm">New Payout</p>
									<p className="text-xs text-muted-foreground">Send money globally</p>
								</div>
							</button>

							<button className="flex flex-col items-start gap-3 p-4 rounded-lg border border-border hover:border-accent-500/50 hover:bg-accent-500/5 transition-all text-left group">
								<div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
									<CreditCard className="h-5 w-5 text-accent-600" />
								</div>
								<div>
									<p className="font-medium text-sm">Issue Card</p>
									<p className="text-xs text-muted-foreground">Virtual or physical</p>
								</div>
							</button>

							<button className="flex flex-col items-start gap-3 p-4 rounded-lg border border-border hover:border-accent-500/50 hover:bg-accent-500/5 transition-all text-left group">
								<div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
									<Globe className="h-5 w-5 text-accent-600" />
								</div>
								<div>
									<p className="font-medium text-sm">Add Account</p>
									<p className="text-xs text-muted-foreground">New currency account</p>
								</div>
							</button>

							<button className="flex flex-col items-start gap-3 p-4 rounded-lg border border-border hover:border-accent-500/50 hover:bg-accent-500/5 transition-all text-left group">
								<div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
									<TrendingUp className="h-5 w-5 text-accent-600" />
								</div>
								<div>
									<p className="font-medium text-sm">Convert FX</p>
									<p className="text-xs text-muted-foreground">Exchange currency</p>
								</div>
							</button>
						</div>
					</div>
				</Card>

				{/* Recent Activity */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Recent Transactions */}
					<Card variant="elevated" padding="lg">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold">Recent Transactions</h3>
								<Button variant="ghost" size="sm">
									View all
								</Button>
							</div>

							<div className="space-y-3">
								{[
									{
										type: "payout",
										direction: "out",
										amount: "$2,450.00",
										description: "Supplier payment",
										currency: "USD",
										time: "2 hours ago",
									},
									{
										type: "card",
										direction: "out",
										amount: "$124.50",
										description: "Card transaction",
										currency: "EUR",
										time: "5 hours ago",
									},
									{
										type: "receive",
										direction: "in",
										amount: "$5,000.00",
										description: "Customer payment",
										currency: "GBP",
										time: "Yesterday",
									},
								].map((transaction, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 transition-colors"
									>
										<div className="flex items-center gap-3">
											<div
												className={`w-8 h-8 rounded-lg flex items-center justify-center ${
													transaction.direction === "in" ? "bg-green-500/10" : "bg-accent-500/10"
												}`}
											>
												{transaction.direction === "in" ? (
													<ArrowDownRight className="h-4 w-4 text-green-600" />
												) : (
													<ArrowUpRight className="h-4 w-4 text-accent-600" />
												)}
											</div>
											<div>
												<p className="text-sm font-medium">{transaction.description}</p>
												<p className="text-xs text-muted-foreground">{transaction.time}</p>
											</div>
										</div>
										<div className="text-right">
											<p
												className={`text-sm font-semibold ${
													transaction.direction === "in" ? "text-green-600" : "text-foreground"
												}`}
											>
												{transaction.direction === "in" ? "+" : "-"}
												{transaction.amount}
											</p>
											<p className="text-xs text-muted-foreground">{transaction.currency}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</Card>

					{/* Account Balances */}
					<Card variant="elevated" padding="lg">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold">Account Balances</h3>
								<Button variant="ghost" size="sm">
									View all
								</Button>
							</div>

							<div className="space-y-3">
								{[
									{ currency: "USD", amount: "1,245,678.90", flag: "🇺🇸" },
									{ currency: "EUR", amount: "567,890.12", flag: "🇪🇺" },
									{ currency: "GBP", amount: "234,567.89", flag: "🇬🇧" },
									{ currency: "JPY", amount: "12,345,678", flag: "🇯🇵" },
								].map((balance, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 transition-colors"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center text-lg">
												{balance.flag}
											</div>
											<div>
												<p className="text-sm font-medium">{balance.currency}</p>
												<Badge variant="outline" className="text-xs">
													Active
												</Badge>
											</div>
										</div>
										<p className="text-sm font-semibold">{balance.amount}</p>
									</div>
								))}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</DashboardShell>
	);
}
