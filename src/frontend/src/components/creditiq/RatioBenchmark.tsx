import type { FinancialRatios } from "@/data/mockData";
import { ratioBenchmarks } from "@/data/mockData";
import { cn } from "@/lib/utils";

type TrafficLight = "green" | "amber" | "red";

function getTrafficLight(
  value: number,
  key: keyof FinancialRatios,
): TrafficLight {
  const bm = ratioBenchmarks[key];
  if (bm.higherIsBetter) {
    if (value >= bm.excellent) return "green";
    if (value >= bm.good) return "green";
    if (value >= bm.min) return "amber";
    return "red";
  }
  // lower is better (e.g., D/E ratio)
  if (value <= bm.excellent) return "green";
  if (value <= bm.good) return "amber";
  if (value <= bm.min) return "amber";
  return "red";
}

function getBenchmarkLabel(value: number, key: keyof FinancialRatios): string {
  const bm = ratioBenchmarks[key];
  if (bm.higherIsBetter) {
    if (value >= bm.excellent) return "Excellent";
    if (value >= bm.good) return "Good";
    if (value >= bm.min) return "Adequate";
    return "Below Min";
  }
  if (value <= bm.excellent) return "Excellent";
  if (value <= bm.good) return "Good";
  if (value <= bm.min) return "Adequate";
  return "High Risk";
}

const trafficColors: Record<
  TrafficLight,
  { dot: string; text: string; bg: string }
> = {
  green: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-500/5 border-emerald-500/20",
  },
  amber: {
    dot: "bg-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-500/5 border-amber-500/20",
  },
  red: {
    dot: "bg-red-400",
    text: "text-red-400",
    bg: "bg-red-500/5 border-red-500/20",
  },
};

interface RatioBenchmarkProps {
  ratioKey: keyof FinancialRatios;
  value: number;
  className?: string;
}

export function RatioBenchmark({
  ratioKey,
  value,
  className,
}: RatioBenchmarkProps) {
  const bm = ratioBenchmarks[ratioKey];
  const light = getTrafficLight(value, ratioKey);
  const colors = trafficColors[light];
  const benchmarkLabel = getBenchmarkLabel(value, ratioKey);

  return (
    <div
      className={cn(
        "rounded-md border p-3 flex flex-col gap-2",
        colors.bg,
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-body">
          {bm.label}
        </span>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full", colors.dot)} />
          <span className={cn("text-xs font-medium", colors.text)}>
            {benchmarkLabel}
          </span>
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono font-bold text-foreground">
          {value}
        </span>
        <span className="text-sm text-muted-foreground">{bm.unit}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        Min:{" "}
        <span className="font-mono">
          {bm.min}
          {bm.unit}
        </span>
        {" · "}
        Good:{" "}
        <span className="font-mono">
          {bm.good}
          {bm.unit}
        </span>
      </div>
    </div>
  );
}

interface RatioGridProps {
  ratios: FinancialRatios;
}

export function RatioGrid({ ratios }: RatioGridProps) {
  const keys = Object.keys(ratios) as (keyof FinancialRatios)[];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {keys.map((key) => (
        <RatioBenchmark key={key} ratioKey={key} value={ratios[key]} />
      ))}
    </div>
  );
}
