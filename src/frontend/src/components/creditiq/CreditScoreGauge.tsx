import type { RiskBand, SubScores } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface CreditScoreGaugeProps {
  score: number;
  riskBand: RiskBand;
  subScores: SubScores;
}

function getRiskBandColor(band: RiskBand): string {
  const colors: Record<RiskBand, string> = {
    AAA: "#10b981",
    AA: "#10b981",
    A: "#3b82f6",
    BBB: "#3b82f6",
    BB: "#f59e0b",
    B: "#f59e0b",
    CCC: "#ef4444",
    D: "#ef4444",
  };
  return colors[band];
}

function getRiskBandLabel(band: RiskBand): string {
  const labels: Record<RiskBand, string> = {
    AAA: "Excellent Risk",
    AA: "Very Low Risk",
    A: "Low Risk",
    BBB: "Moderate Risk",
    BB: "Elevated Risk",
    B: "High Risk",
    CCC: "Very High Risk",
    D: "Default Risk",
  };
  return labels[band];
}

const subScoreLabels: Record<keyof SubScores, string> = {
  financialHealth: "Financial Health",
  managementQuality: "Management Quality",
  industryOutlook: "Industry Outlook",
  compliance: "Compliance",
  legalRisk: "Legal Risk",
};

interface SubScoreBarProps {
  label: string;
  value: number;
  color: string;
}

function SubScoreBar({ label, value, color }: SubScoreBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-mono font-medium" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export function CreditScoreGauge({
  score,
  riskBand,
  subScores,
}: CreditScoreGaugeProps) {
  const arcRef = useRef<SVGCircleElement>(null);
  const color = getRiskBandColor(riskBand);
  const label = getRiskBandLabel(riskBand);

  // SVG arc gauge config
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // We use 3/4 of the circle (270 degrees)
  const arcLength = circumference * 0.75;
  const offset = arcLength - (score / 100) * arcLength;

  useEffect(() => {
    if (arcRef.current) {
      arcRef.current.style.setProperty("--gauge-offset", String(offset));
    }
  }, [offset]);

  const subScoreKeys = Object.keys(subScores) as (keyof SubScores)[];

  function getSubScoreColor(value: number): string {
    if (value >= 80) return "#10b981";
    if (value >= 65) return "#3b82f6";
    if (value >= 50) return "#f59e0b";
    return "#ef4444";
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gauge */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative">
          <svg
            width="160"
            height="120"
            viewBox="0 0 160 120"
            className="overflow-visible"
            aria-label="Credit score gauge"
            role="img"
          >
            <title>Credit Score Gauge</title>
            {/* Background arc */}
            <circle
              cx="80"
              cy="90"
              r={radius}
              fill="none"
              stroke="oklch(0.22 0.025 255)"
              strokeWidth="10"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform="rotate(135 80 90)"
            />
            {/* Score arc */}
            <circle
              ref={arcRef}
              cx="80"
              cy="90"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(135 80 90)"
              style={{
                filter: `drop-shadow(0 0 8px ${color}88)`,
                transition:
                  "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </svg>
          {/* Score number centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span
              className="text-5xl font-display font-bold score-count-in"
              style={{ color }}
            >
              {score}
            </span>
            <span className="text-xs text-muted-foreground font-body mt-0.5">
              / 100
            </span>
          </div>
        </div>
        <div className="text-center mt-2">
          <span
            className="text-lg font-display font-semibold tracking-tight"
            style={{ color }}
          >
            {riskBand}
          </span>
          <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="space-y-3 py-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Score Components
        </p>
        {subScoreKeys.map((key) => (
          <SubScoreBar
            key={key}
            label={subScoreLabels[key]}
            value={subScores[key]}
            color={getSubScoreColor(subScores[key])}
          />
        ))}
      </div>
    </div>
  );
}

// Mini score badge for tables
interface ScoreBadgeProps {
  score: number | null;
  riskBand: RiskBand | null;
  className?: string;
}

export function ScoreBadge({ score, riskBand, className }: ScoreBadgeProps) {
  if (score === null || riskBand === null) {
    return (
      <span
        className={cn("text-muted-foreground text-sm font-mono", className)}
      >
        —
      </span>
    );
  }
  const color = getRiskBandColor(riskBand);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-semibold border",
        className,
      )}
      style={{
        color,
        backgroundColor: `${color}18`,
        borderColor: `${color}40`,
      }}
    >
      {score}
    </span>
  );
}
