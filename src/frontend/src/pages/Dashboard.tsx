import { ScoreBadge } from "@/components/creditiq/CreditScoreGauge";
import { StatusBadge } from "@/components/creditiq/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  dashboardKPIs,
  mockCases,
  pipelineStages,
  riskDistribution,
  sectorExposure,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const kpiCards = [
  {
    label: "Total Cases",
    value: dashboardKPIs.totalCases,
    unit: "",
    icon: Briefcase,
    change: "+4 this month",
    trend: "up",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    label: "Active Cases",
    value: dashboardKPIs.activeCases,
    unit: "",
    icon: TrendingUp,
    change: "In progress",
    trend: "neutral",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    label: "Avg Credit Score",
    value: dashboardKPIs.avgCreditScore,
    unit: "",
    icon: CheckCircle2,
    change: "+2.1 vs last qtr",
    trend: "up",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    label: "Approval Rate",
    value: `${dashboardKPIs.approvalRate}%`,
    unit: "",
    icon: AlertTriangle,
    change: "FY2026 YTD",
    trend: "neutral",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
];

const riskColors: Record<string, string> = {
  AAA: "#10b981",
  AA: "#10b981",
  A: "#3b82f6",
  BBB: "#3b82f6",
  BB: "#f59e0b",
  B: "#f59e0b",
  CCC: "#ef4444",
  D: "#ef4444",
};

const recentCases = mockCases.slice(0, 5);

const earlyWarnings = [
  {
    id: "ew1",
    severity: "Critical" as const,
    company: "Annapurna FMCG Ltd",
    description: "DSCR of 0.95x — debt service stress detected",
    time: "2h ago",
  },
  {
    id: "ew2",
    severity: "High" as const,
    company: "Tata Advanced Materials Ltd",
    description: "Steel sector anti-dumping duties — revenue headwind risk",
    time: "1d ago",
  },
  {
    id: "ew3",
    severity: "Medium" as const,
    company: "Annapurna FMCG Ltd",
    description: "C-suite attrition: CFO and COO exits in 12 months",
    time: "2d ago",
  },
];

const severityConfig = {
  Critical: {
    label: "Critical",
    class: "text-red-400 bg-red-500/10 border-red-500/30",
  },
  High: {
    label: "High",
    class: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  },
  Medium: {
    label: "Medium",
    class: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  Low: {
    label: "Low",
    class: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  },
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Credit Appraisal Pipeline — FY 2025–26
          </p>
        </div>
        <Button
          data-ocid="dashboard.new_case.button"
          onClick={() => navigate({ to: "/new-appraisal" })}
          className="gap-2 bg-primary/90 hover:bg-primary"
        >
          <Plus className="w-4 h-4" />
          New Appraisal
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                  {kpi.label}
                </span>
                <div
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center",
                    kpi.bg,
                    `border ${kpi.border}`,
                  )}
                >
                  <Icon className={cn("w-4 h-4", kpi.color)} />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-bold text-foreground data-dense">
                  {kpi.value}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </div>
          );
        })}
      </div>

      {/* Middle row: Pipeline + Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pipeline Overview */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-display font-semibold text-foreground mb-4 uppercase tracking-wider">
            Pipeline Overview
          </h2>
          <div className="flex items-stretch gap-0">
            {pipelineStages.map((stage, idx) => {
              const isLast = idx === pipelineStages.length - 1;
              const colors = [
                "bg-slate-500/15 border-slate-500/30 text-slate-400",
                "bg-blue-500/15 border-blue-500/30 text-blue-400",
                "bg-amber-500/15 border-amber-500/30 text-amber-400",
                "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
              ];
              const numColors = [
                "text-slate-300",
                "text-blue-300",
                "text-amber-300",
                "text-emerald-300",
              ];
              return (
                <div key={stage.label} className="flex items-center flex-1">
                  <div
                    className={cn(
                      "flex-1 rounded-md border p-3 text-center",
                      colors[idx],
                    )}
                  >
                    <div
                      className={cn(
                        "text-2xl font-mono font-bold",
                        numColors[idx],
                      )}
                    >
                      {stage.count}
                    </div>
                    <div className="text-xs font-body mt-1">{stage.label}</div>
                  </div>
                  {!isLast && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground mx-1 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-display font-semibold text-foreground mb-4 uppercase tracking-wider">
            Risk Distribution
          </h2>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={riskDistribution}
                layout="vertical"
                margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="band"
                  width={32}
                  tick={{
                    fontSize: 11,
                    fontFamily: "Geist Mono",
                    fill: "oklch(0.58 0.025 255)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.024 255)",
                    border: "1px solid oklch(0.28 0.028 255)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "oklch(0.93 0.01 255)",
                  }}
                  cursor={{ fill: "oklch(0.22 0.025 255)" }}
                />
                <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={14}>
                  {riskDistribution.map((entry) => (
                    <Cell
                      key={entry.band}
                      fill={riskColors[entry.band]}
                      opacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Cases Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider">
            Recent Cases
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground gap-1 hover:text-foreground"
            onClick={() => navigate({ to: "/cases" })}
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="cases.table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Sector
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Loan (₹ Cr)
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Score
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recommendation
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c, idx) => (
                <tr
                  key={c.id}
                  className="border-b border-border/50 hover:bg-accent/30 transition-colors cursor-pointer"
                  data-ocid={`cases.row.${idx + 1}`}
                  onClick={() =>
                    navigate({ to: "/cases/$caseId", params: { caseId: c.id } })
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate({ to: "/cases/$caseId", params: { caseId: c.id } })
                  }
                >
                  <td className="px-5 py-3">
                    <div className="font-medium text-foreground text-sm">
                      {c.companyName}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      {c.cin}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      {c.sector}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono font-medium text-foreground">
                      {c.loanAmount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreBadge score={c.score} riskBand={c.riskBand} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge value={c.status} variant="status" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {c.recommendation ? (
                      <StatusBadge
                        value={c.recommendation}
                        variant="recommendation"
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary hover:text-primary/80 h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({
                          to: "/cases/$caseId",
                          params: { caseId: c.id },
                        });
                      }}
                      data-ocid={`cases.view.button.${idx + 1}`}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom row: Sector Exposure + Early Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sector Exposure */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-display font-semibold text-foreground mb-4 uppercase tracking-wider">
            Sector Exposure
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {sectorExposure.map((s) => (
              <div
                key={s.sector}
                className="rounded-md border border-border bg-muted/30 p-3"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {s.sector}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-mono font-bold text-foreground">
                    {s.count}
                  </span>
                  <span className="text-xs text-primary font-mono">
                    Avg: {s.avgScore}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  cases
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Early Warning Signals */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-display font-semibold text-foreground mb-4 uppercase tracking-wider">
            Early Warning Signals
          </h2>
          <div className="space-y-3">
            {earlyWarnings.map((ew) => {
              const config = severityConfig[ew.severity];
              return (
                <div
                  key={ew.id}
                  className="flex items-start gap-3 rounded-md border border-border/60 p-3 bg-muted/20"
                >
                  <span
                    className={cn(
                      "flex-shrink-0 text-xs font-medium px-1.5 py-0.5 rounded border",
                      config.class,
                    )}
                  >
                    {config.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">
                      {ew.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground truncate">
                        {ew.company}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {ew.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
