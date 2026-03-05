import type {
  CaseStatus,
  DataSourceStatus,
  EWSSeverity,
  Recommendation,
  RiskBand,
} from "@/data/mockData";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "status"
  | "recommendation"
  | "riskBand"
  | "severity"
  | "dataSource";

interface StatusBadgeProps {
  value: string;
  variant: BadgeVariant;
  className?: string;
}

const statusStyles: Record<CaseStatus, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  DataIngestion: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Analysis: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/30",
};

const statusLabels: Record<CaseStatus, string> = {
  Draft: "Draft",
  DataIngestion: "Data Ingestion",
  Analysis: "Analysis",
  Completed: "Completed",
  Rejected: "Rejected",
};

const recommendationStyles: Record<Recommendation, string> = {
  Approve: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  ConditionalApprove: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Reject: "bg-red-500/10 text-red-400 border-red-500/30",
};

const recommendationLabels: Record<Recommendation, string> = {
  Approve: "Approve",
  ConditionalApprove: "Conditional",
  Reject: "Reject",
};

const riskBandStyles: Record<RiskBand, string> = {
  AAA: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  AA: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  A: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  BBB: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  BB: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  B: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  CCC: "bg-red-500/10 text-red-400 border-red-500/30",
  D: "bg-red-500/10 text-red-400 border-red-500/30",
};

const severityStyles: Record<EWSSeverity, string> = {
  Critical: "bg-red-500/10 text-red-400 border-red-500/30",
  High: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Low: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

const dataSourceStyles: Record<DataSourceStatus, string> = {
  Pending: "bg-muted text-muted-foreground border-border",
  Uploaded: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Processing: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Error: "bg-red-500/10 text-red-400 border-red-500/30",
};

export function StatusBadge({ value, variant, className }: StatusBadgeProps) {
  let style = "bg-muted text-muted-foreground border-border";
  let label = value;

  if (variant === "status") {
    style = statusStyles[value as CaseStatus] ?? style;
    label = statusLabels[value as CaseStatus] ?? value;
  } else if (variant === "recommendation") {
    style = recommendationStyles[value as Recommendation] ?? style;
    label = recommendationLabels[value as Recommendation] ?? value;
  } else if (variant === "riskBand") {
    style = riskBandStyles[value as RiskBand] ?? style;
  } else if (variant === "severity") {
    style = severityStyles[value as EWSSeverity] ?? style;
  } else if (variant === "dataSource") {
    style = dataSourceStyles[value as DataSourceStatus] ?? style;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border font-body",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
