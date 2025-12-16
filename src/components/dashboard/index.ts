/**
 * Dashboard Components Index
 * Centralized exports for InstantGlobal dashboard components
 */

export {
  DashboardShell,
  DashboardShellCompact,
  type DashboardShellProps,
} from "./dashboard-shell";

export {
  SidebarNav,
  MobileSidebar,
} from "./sidebar-nav";

export {
  TopNav,
  TopNavCompact,
  type TopNavProps,
} from "./top-nav";

export {
  EnvironmentSwitcher,
  EnvironmentBadge,
  type Environment,
  type EnvironmentSwitcherProps,
} from "./environment-switcher";

export {
  AnalyticsKPIRow,
  AnalyticsKPIRowCompact,
  type KPIData,
  type AnalyticsKPIRowProps,
} from "./analytics-kpi-row";

export {
  AnalyticsChart,
  AnalyticsChartCompact,
  type ChartData,
  type AnalyticsChartProps,
} from "./analytics-chart";

export {
  ResourceList,
  ResourceListCompact,
  type ResourceItem,
  type ResourceListProps,
} from "./resource-list";

export {
  ActivityFeed,
  ActivityFeedCompact,
  type ActivityItem,
  type ActivityFeedProps,
} from "./activity-feed";

export {
  EmptyState,
  EmptyStateInline,
  EmptyStateList,
  type EmptyStateProps,
} from "./empty-state";

export {
  CodeSamplesPanel,
  CodeSampleInline,
  createAPISamples,
  type CodeSample,
  type CodeSamplesPanelProps,
} from "./code-samples-panel";

export {
  APIKeysPanel,
  APIKeyCompact,
  type APIKey,
  type APIKeysPanelProps,
} from "./api-keys-panel";

export {
  TotalVisitorsCard,
  LastQuarterVisitorsCard,
  type VisitorCardProps,
  type SparklinePoint,
} from "./cards/visitor-cards";

export {
  BankingCard,
  type BankingCardProps,
} from "./cards/banking-card";

export {
  StatGrid,
  type StatGridProps,
  type StatGridItem,
} from "./cards/stat-grid";

export {
  KPIDataTable,
  type KPIDataTableProps,
  type KPIDataRow,
} from "./tables/kpi-table";
