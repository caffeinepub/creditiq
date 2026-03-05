import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

export type PipelineStageStatus = "pending" | "running" | "done";

export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  status: PipelineStageStatus;
}

interface AnalysisPipelineProps {
  stages: PipelineStage[];
  className?: string;
}

const stageIcons = {
  pending: <Circle className="w-5 h-5 text-muted-foreground" />,
  running: <Loader2 className="w-5 h-5 text-primary animate-spin" />,
  done: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
};

const stageLineStyles: Record<PipelineStageStatus, string> = {
  pending: "bg-border",
  running: "bg-primary/40",
  done: "bg-emerald-500",
};

export function AnalysisPipeline({ stages, className }: AnalysisPipelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {stages.map((stage, idx) => {
        const isLast = idx === stages.length - 1;
        return (
          <div key={stage.id} className="flex gap-4">
            {/* Icon + connector line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md border transition-all duration-300",
                  stage.status === "done"
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : stage.status === "running"
                      ? "border-primary/40 bg-primary/10 pipeline-pulsing"
                      : "border-border bg-muted/50",
                )}
              >
                {stageIcons[stage.status]}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[20px] transition-all duration-500",
                    stageLineStyles[
                      stage.status === "done" ? "done" : "pending"
                    ],
                  )}
                />
              )}
            </div>

            {/* Stage content */}
            <div
              className={cn(
                "flex-1 pb-5 pt-1 transition-all duration-300",
                isLast && "pb-0",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm font-medium font-body transition-colors duration-300",
                    stage.status === "done"
                      ? "text-emerald-400"
                      : stage.status === "running"
                        ? "text-primary"
                        : "text-muted-foreground",
                  )}
                >
                  {stage.label}
                </span>
                {stage.status === "running" && (
                  <span className="text-xs text-primary/70 pipeline-pulsing">
                    Processing...
                  </span>
                )}
                {stage.status === "done" && (
                  <span className="text-xs text-emerald-400/70">Complete</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {stage.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
