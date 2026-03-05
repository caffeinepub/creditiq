import { CreditScoreGauge } from "@/components/creditiq/CreditScoreGauge";
import { RatioGrid } from "@/components/creditiq/RatioBenchmark";
import { StatusBadge } from "@/components/creditiq/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type CAMReport,
  type CaseStatus,
  type DataSource,
  type EarlyWarningSignal,
  mockCases,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  CircleDot,
  Clock,
  Download,
  Printer,
} from "lucide-react";

const STATUS_STEPS: CaseStatus[] = [
  "Draft",
  "DataIngestion",
  "Analysis",
  "Completed",
];

function StatusTimeline({ current }: { current: CaseStatus }) {
  const idx = STATUS_STEPS.indexOf(current);
  const isRejected = current === "Rejected";

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((s, i) => {
        const isDone = isRejected ? false : i < idx;
        const isCurrent = isRejected ? false : i === idx;
        const isLast = i === STATUS_STEPS.length - 1;
        const label = s === "DataIngestion" ? "Data Ingestion" : s;

        return (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center border",
                  isDone
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : isCurrent
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <CircleDot className="w-4 h-4" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs whitespace-nowrap",
                  isDone
                    ? "text-emerald-400"
                    : isCurrent
                      ? "text-primary"
                      : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-px mb-4 mx-1",
                  isDone ? "bg-emerald-500/40" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// CAM Report Tab
function CAMReportTab({ caseData }: { caseData: CAMReport }) {
  if (!caseData) return null;

  const _isApprove = caseData.recommendedLimit > 0;
  const isReject = caseData.recommendedLimit === 0;

  const bannerClass = isReject
    ? "border-red-500/30 bg-red-500/8"
    : caseData.interestRateLow < 10
      ? "border-emerald-500/30 bg-emerald-500/8"
      : "border-amber-500/30 bg-amber-500/8";

  const bannerTextClass = isReject
    ? "text-red-400"
    : caseData.interestRateLow < 10
      ? "text-emerald-400"
      : "text-amber-400";

  const recLabel = isReject
    ? "REJECT"
    : caseData.interestRateLow < 10
      ? "APPROVE"
      : "CONDITIONAL APPROVE";

  return (
    <div className="space-y-5">
      {/* Recommendation banner */}
      <div className={cn("rounded-lg border p-4", bannerClass)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isReject ? (
              <AlertCircle className={cn("w-5 h-5", bannerTextClass)} />
            ) : (
              <CheckCircle2 className={cn("w-5 h-5", bannerTextClass)} />
            )}
            <span
              className={cn(
                "font-display font-bold text-lg tracking-tight",
                bannerTextClass,
              )}
            >
              RECOMMENDATION: {recLabel}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-xs text-muted-foreground hover:text-foreground"
            data-ocid="cam.print.button"
          >
            <Printer className="w-4 h-4" />
            Print / Export
          </Button>
        </div>
      </div>

      {/* Key metrics row */}
      {!isReject && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-md border border-border bg-muted/30 p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1.5">
              Recommended Limit
            </div>
            <div className="text-2xl font-mono font-bold text-foreground">
              ₹{caseData.recommendedLimit} Cr
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1.5">
              Interest Rate Band
            </div>
            <div className="text-xl font-mono font-bold text-foreground">
              {caseData.interestRateLow}%–{caseData.interestRateHigh}%
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1.5">
              Risk Premium
            </div>
            <div className="text-2xl font-mono font-bold text-foreground">
              {caseData.riskPremiumBps} bps
            </div>
          </div>
        </div>
      )}

      {/* Executive Summary */}
      <div className="rounded-md border border-border bg-muted/20 p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Executive Summary
        </h3>
        <p className="text-sm text-foreground leading-relaxed">
          {caseData.executiveSummary}
        </p>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Key Strengths */}
        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-4">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
            Key Strengths
          </h3>
          <ul className="space-y-2">
            {caseData.keyStrengths.map((s) => (
              <li
                key={s.slice(0, 40)}
                className="flex items-start gap-2 text-xs text-foreground"
              >
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">▸</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Key Risks */}
        <div className="rounded-md border border-red-500/20 bg-red-500/5 p-4">
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
            Key Risks
          </h3>
          <ul className="space-y-2">
            {caseData.keyRisks.map((r) => (
              <li
                key={r.slice(0, 40)}
                className="flex items-start gap-2 text-xs text-foreground"
              >
                <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Conditions */}
        <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-4">
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
            Conditions / Next Steps
          </h3>
          <ol className="space-y-2">
            {caseData.conditions.map((c, i) => (
              <li
                key={c.slice(0, 40)}
                className="flex items-start gap-2 text-xs text-foreground"
              >
                <span className="text-amber-400 flex-shrink-0 font-mono">
                  {i + 1}.
                </span>
                {c}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// Data Sources Tab
function DataSourcesTab({ dataSources }: { dataSources: DataSource[] }) {
  const categories = [
    "Structured",
    "Unstructured",
    "External",
    "Primary",
  ] as const;

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const sources = dataSources.filter((s) => s.category === cat);
        if (sources.length === 0) return null;
        return (
          <div
            key={cat}
            className="rounded-lg border border-border overflow-hidden"
          >
            <div className="bg-muted/30 px-4 py-2.5 border-b border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {cat} Data
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">
                    Source
                  </th>
                  <th className="text-center px-4 py-2 text-xs text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-right px-4 py-2 text-xs text-muted-foreground font-medium">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {sources.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-foreground text-sm">
                      {s.name}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <StatusBadge value={s.status} variant="dataSource" />
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs text-muted-foreground font-mono">
                      {s.lastUpdated ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

// Early Warnings Tab
function EarlyWarningsTab({ signals }: { signals: EarlyWarningSignal[] }) {
  if (signals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-400/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          No Early Warning Signals
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          No risk flags detected for this case.
        </p>
      </div>
    );
  }

  const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const sorted = [...signals].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );

  return (
    <div className="space-y-3">
      {sorted.map((signal) => (
        <div
          key={signal.id}
          className="rounded-lg border border-border bg-card p-4 flex items-start gap-4"
        >
          <StatusBadge
            value={signal.severity}
            variant="severity"
            className="flex-shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                {signal.category}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {signal.description}
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              Detected: {signal.detectedDate}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main CaseDetail page
export default function CaseDetail() {
  const params = useParams({ from: "/cases/$caseId" });
  const navigate = useNavigate();
  const caseData = mockCases.find((c) => c.id === params.caseId);

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="w-12 h-12 text-destructive/50 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          Case not found
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 gap-2"
          onClick={() => navigate({ to: "/cases" })}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Cases
        </Button>
      </div>
    );
  }

  const hasScore =
    caseData.score !== null &&
    caseData.riskBand !== null &&
    caseData.subScores !== null;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2"
          onClick={() => navigate({ to: "/cases" })}
        >
          <ChevronLeft className="w-4 h-4" />
          Cases
        </Button>
        <span className="text-muted-foreground text-xs">/</span>
        <span className="text-xs text-muted-foreground font-mono">
          {caseData.caseId}
        </span>
      </div>

      {/* Company header */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-display font-bold text-foreground">
                {caseData.companyName}
              </h1>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md border border-blue-500/30 bg-blue-500/10 text-blue-400">
                {caseData.sector}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="font-mono">{caseData.cin}</span>
              <span>·</span>
              <span>₹{caseData.loanAmount} Cr requested</span>
              <span>·</span>
              <span>{caseData.tenureMonths} months tenure</span>
              <span>·</span>
              <span>Analyst: {caseData.assignedAnalyst}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge value={caseData.status} variant="status" />
            {caseData.recommendation && (
              <StatusBadge
                value={caseData.recommendation}
                variant="recommendation"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Status timeline */}
        <div className="mt-5 pt-4 border-t border-border">
          <StatusTimeline current={caseData.status} />
        </div>

        {/* In-progress bar */}
        {(caseData.status === "DataIngestion" ||
          caseData.status === "Analysis") && (
          <div className="mt-4 pt-4 border-t border-border space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Data Ingestion Progress
              </span>
              <span className="font-mono text-primary">
                {caseData.ingestionProgress}%
              </span>
            </div>
            <Progress value={caseData.ingestionProgress} className="h-1" />
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/30 border border-border p-1 h-auto gap-1">
          <TabsTrigger
            value="overview"
            data-ocid="case_detail.overview.tab"
            className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="data-sources"
            data-ocid="case_detail.data_sources.tab"
            className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            Data Sources
          </TabsTrigger>
          <TabsTrigger
            value="warnings"
            data-ocid="case_detail.warnings.tab"
            className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            Early Warnings
            {caseData.earlyWarningSignals.length > 0 && (
              <span className="ml-1.5 w-4 h-4 rounded-full bg-red-500/20 text-red-400 text-xs inline-flex items-center justify-center">
                {caseData.earlyWarningSignals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="cam"
            data-ocid="case_detail.cam_report.tab"
            className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            CAM Report
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-5">
          {hasScore ? (
            <>
              {/* Credit Score Card */}
              <div className="rounded-lg border border-border bg-card p-5">
                <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-4">
                  Credit Score & Risk Profile
                </h2>
                <CreditScoreGauge
                  score={caseData.score!}
                  riskBand={caseData.riskBand!}
                  subScores={caseData.subScores!}
                />
              </div>

              {/* Financial Ratios */}
              {caseData.ratios && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-4">
                    Key Financial Ratios
                  </h2>
                  <RatioGrid ratios={caseData.ratios} />
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <div className="w-12 h-12 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Analysis In Progress
              </p>
              <p className="text-xs text-muted-foreground/60">
                Credit score and ratios will be available after analysis
                completes.
              </p>
              <div className="mt-4 max-w-xs mx-auto space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Ingestion Progress
                  </span>
                  <span className="font-mono text-primary">
                    {caseData.ingestionProgress}%
                  </span>
                </div>
                <Progress value={caseData.ingestionProgress} className="h-1" />
              </div>
            </div>
          )}
        </TabsContent>

        {/* Data Sources Tab */}
        <TabsContent value="data-sources" className="mt-4">
          <DataSourcesTab dataSources={caseData.dataSources} />
        </TabsContent>

        {/* Early Warnings Tab */}
        <TabsContent value="warnings" className="mt-4">
          <EarlyWarningsTab signals={caseData.earlyWarningSignals} />
        </TabsContent>

        {/* CAM Report Tab */}
        <TabsContent value="cam" className="mt-4">
          {caseData.camReport ? (
            <CAMReportTab caseData={caseData.camReport} />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                CAM Not Yet Generated
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Complete data ingestion and run analysis to generate the CAM
                report.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
