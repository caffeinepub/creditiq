import {
  AnalysisPipeline,
  type PipelineStage,
} from "@/components/creditiq/AnalysisPipeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type DataSourceStatus, SECTORS } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Play,
  RefreshCw,
  Upload,
  Zap,
} from "lucide-react";
import { useCallback, useState } from "react";

const STEPS = [
  "Company Details",
  "Data Ingestion",
  "Run Analysis",
  "CAM Report",
];

// ── Step 1 Form ───────────────────────────────────────────────────────────────

interface CompanyForm {
  companyName: string;
  cin: string;
  sector: string;
  loanAmount: string;
  tenureMonths: string;
  purposeOfLoan: string;
}

type FormErrors = Partial<Record<keyof CompanyForm, string>>;

function validateCIN(cin: string): boolean {
  return /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(cin);
}

function validateForm(form: CompanyForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.companyName.trim()) errors.companyName = "Company name is required";
  if (!form.cin.trim()) errors.cin = "CIN is required";
  else if (!validateCIN(form.cin))
    errors.cin = "Invalid CIN format (e.g. L27100MH1998PLC112543)";
  if (!form.sector) errors.sector = "Sector is required";
  if (!form.loanAmount) errors.loanAmount = "Loan amount is required";
  else if (
    Number.isNaN(Number(form.loanAmount)) ||
    Number(form.loanAmount) <= 0
  )
    errors.loanAmount = "Enter a valid positive amount";
  if (!form.tenureMonths) errors.tenureMonths = "Tenure is required";
  else if (
    Number.isNaN(Number(form.tenureMonths)) ||
    Number(form.tenureMonths) <= 0
  )
    errors.tenureMonths = "Enter a valid tenure";
  if (!form.purposeOfLoan.trim())
    errors.purposeOfLoan = "Purpose of loan is required";
  return errors;
}

function Step1Form({
  form,
  setForm,
  errors,
}: {
  form: CompanyForm;
  setForm: React.Dispatch<React.SetStateAction<CompanyForm>>;
  errors: FormErrors;
}) {
  const update = (k: keyof CompanyForm, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-5" data-ocid="new_appraisal.step1.panel">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label
            htmlFor="companyName"
            className="text-xs text-muted-foreground uppercase tracking-wider"
          >
            Company Name *
          </Label>
          <Input
            id="companyName"
            data-ocid="new_appraisal.company_name.input"
            placeholder="e.g. Tata Advanced Materials Ltd"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className={cn(
              "bg-muted/40 border-border",
              errors.companyName && "border-destructive",
            )}
          />
          {errors.companyName && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.companyName}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="cin"
            className="text-xs text-muted-foreground uppercase tracking-wider"
          >
            CIN *
          </Label>
          <Input
            id="cin"
            data-ocid="new_appraisal.cin.input"
            placeholder="L27100MH1998PLC112543"
            value={form.cin}
            onChange={(e) => update("cin", e.target.value.toUpperCase())}
            className={cn(
              "bg-muted/40 border-border font-mono",
              errors.cin && "border-destructive",
            )}
            maxLength={21}
          />
          {errors.cin && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.cin}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
            Sector *
          </Label>
          <Select
            value={form.sector}
            onValueChange={(v) => update("sector", v)}
          >
            <SelectTrigger
              data-ocid="new_appraisal.sector.select"
              className={cn(
                "bg-muted/40 border-border",
                errors.sector && "border-destructive",
              )}
            >
              <SelectValue placeholder="Select sector…" />
            </SelectTrigger>
            <SelectContent>
              {SECTORS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sector && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.sector}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="amount"
              className="text-xs text-muted-foreground uppercase tracking-wider"
            >
              Loan Amount (₹ Cr) *
            </Label>
            <Input
              id="amount"
              data-ocid="new_appraisal.amount.input"
              placeholder="e.g. 250"
              type="number"
              min="1"
              value={form.loanAmount}
              onChange={(e) => update("loanAmount", e.target.value)}
              className={cn(
                "bg-muted/40 border-border font-mono",
                errors.loanAmount && "border-destructive",
              )}
            />
            {errors.loanAmount && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.loanAmount}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="tenure"
              className="text-xs text-muted-foreground uppercase tracking-wider"
            >
              Tenure (months) *
            </Label>
            <Input
              id="tenure"
              data-ocid="new_appraisal.tenure.input"
              placeholder="e.g. 60"
              type="number"
              min="1"
              value={form.tenureMonths}
              onChange={(e) => update("tenureMonths", e.target.value)}
              className={cn(
                "bg-muted/40 border-border font-mono",
                errors.tenureMonths && "border-destructive",
              )}
            />
            {errors.tenureMonths && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.tenureMonths}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="purpose"
          className="text-xs text-muted-foreground uppercase tracking-wider"
        >
          Purpose of Loan *
        </Label>
        <Textarea
          id="purpose"
          placeholder="Describe the purpose and use of proceeds in detail…"
          value={form.purposeOfLoan}
          onChange={(e) => update("purposeOfLoan", e.target.value)}
          className={cn(
            "bg-muted/40 border-border min-h-[100px] resize-none",
            errors.purposeOfLoan && "border-destructive",
          )}
        />
        {errors.purposeOfLoan && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.purposeOfLoan}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Step 2 Data Ingestion ─────────────────────────────────────────────────────

interface IngestionSource {
  id: string;
  name: string;
  status: DataSourceStatus;
  type: "upload" | "auto";
}

interface IngestionSection {
  title: string;
  sources: IngestionSource[];
}

function getInitialSections(): IngestionSection[] {
  return [
    {
      title: "Structured Data",
      sources: [
        { id: "gst", name: "GST Filings", status: "Pending", type: "upload" },
        {
          id: "itr",
          name: "Income Tax Returns (ITR)",
          status: "Pending",
          type: "upload",
        },
        {
          id: "bank",
          name: "Bank Statements",
          status: "Pending",
          type: "upload",
        },
      ],
    },
    {
      title: "Unstructured Data",
      sources: [
        {
          id: "annual",
          name: "Annual Report",
          status: "Pending",
          type: "upload",
        },
        {
          id: "financials",
          name: "Financial Statements",
          status: "Pending",
          type: "upload",
        },
        {
          id: "minutes",
          name: "Board Meeting Minutes",
          status: "Pending",
          type: "upload",
        },
        {
          id: "rating",
          name: "Rating Agency Report",
          status: "Pending",
          type: "upload",
        },
        {
          id: "shareholding",
          name: "Shareholding Pattern",
          status: "Pending",
          type: "upload",
        },
      ],
    },
    {
      title: "External & Primary Intelligence",
      sources: [
        {
          id: "news",
          name: "News Intelligence",
          status: "Pending",
          type: "auto",
        },
        { id: "mca", name: "MCA Filings", status: "Pending", type: "auto" },
        {
          id: "legal",
          name: "Legal Disputes (eCourts)",
          status: "Pending",
          type: "auto",
        },
      ],
    },
  ];
}

const statusChipClasses: Record<DataSourceStatus, string> = {
  Pending: "bg-muted text-muted-foreground border-border",
  Uploaded: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Processing: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Error: "bg-red-500/10 text-red-400 border-red-500/30",
};

function Step2Ingestion({
  sections,
  setSections,
  siteVisit,
  setSiteVisit,
  mgmtInterview,
  setMgmtInterview,
}: {
  sections: IngestionSection[];
  setSections: React.Dispatch<React.SetStateAction<IngestionSection[]>>;
  siteVisit: string;
  setSiteVisit: (v: string) => void;
  mgmtInterview: string;
  setMgmtInterview: (v: string) => void;
}) {
  function updateStatus(
    sectionIdx: number,
    sourceId: string,
    status: DataSourceStatus,
  ) {
    setSections((prev) =>
      prev.map((sec, si) =>
        si === sectionIdx
          ? {
              ...sec,
              sources: sec.sources.map((src) =>
                src.id === sourceId ? { ...src, status } : src,
              ),
            }
          : sec,
      ),
    );
  }

  async function handleUpload(sectionIdx: number, sourceId: string) {
    updateStatus(sectionIdx, sourceId, "Uploaded");
    setTimeout(() => updateStatus(sectionIdx, sourceId, "Processing"), 400);
    setTimeout(() => updateStatus(sectionIdx, sourceId, "Done"), 1600);
  }

  async function handleAutoFetch(sectionIdx: number, sourceId: string) {
    updateStatus(sectionIdx, sourceId, "Processing");
    setTimeout(() => updateStatus(sectionIdx, sourceId, "Done"), 1800);
  }

  const allSources = sections.flatMap((s) => s.sources);
  const doneCount = allSources.filter((s) => s.status === "Done").length;
  const progress = Math.round((doneCount / allSources.length) * 100);

  return (
    <div className="space-y-5" data-ocid="new_appraisal.step2.panel">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Overall Ingestion Progress
          </span>
          <span className="font-mono text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {sections.map((section, sectionIdx) => (
        <div
          key={section.title}
          className="rounded-lg border border-border overflow-hidden"
        >
          <div className="bg-muted/30 px-4 py-2.5 border-b border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
          </div>
          <div className="divide-y divide-border/50">
            {section.sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{source.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-md border font-medium",
                      statusChipClasses[source.status],
                    )}
                  >
                    {source.status}
                  </span>
                  {source.type === "upload" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 gap-1 text-xs"
                      disabled={
                        source.status === "Done" ||
                        source.status === "Processing"
                      }
                      onClick={() => handleUpload(sectionIdx, source.id)}
                      data-ocid="new_appraisal.step2.upload_button"
                    >
                      <Upload className="w-3 h-3" />
                      {source.status === "Done"
                        ? "Uploaded"
                        : source.status === "Processing"
                          ? "Processing…"
                          : "Upload"}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 gap-1 text-xs text-blue-400 hover:text-blue-300"
                      disabled={
                        source.status === "Done" ||
                        source.status === "Processing"
                      }
                      onClick={() => handleAutoFetch(sectionIdx, source.id)}
                      data-ocid="new_appraisal.step2.upload_button"
                    >
                      <RefreshCw
                        className={cn(
                          "w-3 h-3",
                          source.status === "Processing" && "animate-spin",
                        )}
                      />
                      {source.status === "Done"
                        ? "Fetched"
                        : source.status === "Processing"
                          ? "Fetching…"
                          : "Auto-Fetch"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Primary Intelligence text inputs */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-muted/30 px-4 py-2.5 border-b border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Primary Intelligence Notes
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Site Visit Observations
            </Label>
            <Textarea
              placeholder="Document observations from factory/office site visit…"
              className="bg-muted/40 border-border min-h-[80px] resize-none text-sm"
              value={siteVisit}
              onChange={(e) => setSiteVisit(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Management Interview Notes
            </Label>
            <Textarea
              placeholder="Summary of due diligence interviews with management team…"
              className="bg-muted/40 border-border min-h-[80px] resize-none text-sm"
              value={mgmtInterview}
              onChange={(e) => setMgmtInterview(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3 Run Analysis ──────────────────────────────────────────────────────

const INITIAL_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "s1",
    label: "Data Validation & Normalization",
    description:
      "Cross-validate uploaded documents, check for completeness, normalize formats across sources.",
    status: "pending",
  },
  {
    id: "s2",
    label: "Financial Ratio Computation",
    description:
      "Compute DSCR, current ratio, D/E, ICR, ROE, NPM from parsed financial statements and bank data.",
    status: "pending",
  },
  {
    id: "s3",
    label: "Unstructured Text NLP Analysis",
    description:
      "Extract key insights from annual reports, board minutes, and rating reports using LLM-powered NLP.",
    status: "pending",
  },
  {
    id: "s4",
    label: "External Intelligence Synthesis",
    description:
      "Synthesize MCA filings, legal disputes, news signals, and sector outlook data into risk flags.",
    status: "pending",
  },
  {
    id: "s5",
    label: "ML Credit Score Generation",
    description:
      "Run ensemble ML model (XGBoost + Neural Net) on 200+ features to generate final credit score.",
    status: "pending",
  },
  {
    id: "s6",
    label: "CAM Report Compilation",
    description:
      "Assemble comprehensive credit appraisal memo with recommendations, conditions, and risk summary.",
    status: "pending",
  },
];

function Step3Analysis({
  stages,
  setStages,
  analysisComplete,
  setAnalysisComplete,
}: {
  stages: PipelineStage[];
  setStages: React.Dispatch<React.SetStateAction<PipelineStage[]>>;
  analysisComplete: boolean;
  setAnalysisComplete: (v: boolean) => void;
}) {
  const [running, setRunning] = useState(false);

  const runAnalysis = useCallback(async () => {
    setRunning(true);
    setStages(
      INITIAL_PIPELINE_STAGES.map((s) => ({
        ...s,
        status: "pending" as const,
      })),
    );

    for (let i = 0; i < INITIAL_PIPELINE_STAGES.length; i++) {
      setStages((prev) =>
        prev.map((s, si) =>
          si === i ? { ...s, status: "running" as const } : s,
        ),
      );
      await new Promise((r) => setTimeout(r, 900));
      setStages((prev) =>
        prev.map((s, si) => (si === i ? { ...s, status: "done" as const } : s)),
      );
      await new Promise((r) => setTimeout(r, 100));
    }
    setRunning(false);
    setAnalysisComplete(true);
  }, [setStages, setAnalysisComplete]);

  const allDone = stages.every((s) => s.status === "done");

  return (
    <div className="space-y-6" data-ocid="new_appraisal.step3.panel">
      {/* Run button */}
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="relative">
          <div
            className={cn(
              "absolute inset-0 rounded-full blur-xl transition-all duration-500",
              running
                ? "bg-primary/30 scale-125 animate-pulse"
                : "bg-primary/10",
            )}
          />
          <Button
            size="lg"
            data-ocid="new_appraisal.run_analysis.button"
            disabled={running}
            onClick={runAnalysis}
            className={cn(
              "relative gap-3 px-8 py-5 text-base font-semibold rounded-lg transition-all duration-300",
              running
                ? "bg-primary/80 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 shadow-primary-glow",
            )}
          >
            {running ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                Analysis Running…
              </>
            ) : allDone ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                Re-run Analysis
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run AI Analysis
              </>
            )}
          </Button>
        </div>
        {!running && !allDone && (
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            Click to initiate the full AI-powered credit analysis pipeline
            across all ingested data sources.
          </p>
        )}
      </div>

      {/* Pipeline stages */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">
          Analysis Pipeline
        </h3>
        <AnalysisPipeline stages={stages} />
      </div>

      {/* Summary card on completion */}
      {analysisComplete && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-400">
              Analysis Complete
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-mono font-bold text-emerald-400">
                86
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Credit Score
              </div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-blue-400">
                A
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Risk Band
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-400">
                Approve
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Recommendation
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step 4 CAM Preview ───────────────────────────────────────────────────────

function Step4CAMPreview() {
  return (
    <div className="space-y-5" data-ocid="new_appraisal.step4.panel">
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/8 p-5">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-400 font-display">
            RECOMMENDATION: APPROVE
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on the AI-powered analysis, this application meets
          creditworthiness criteria. The full CAM has been generated and is
          ready for review.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-md border border-border bg-muted/30 p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">
            Recommended Limit
          </div>
          <div className="text-2xl font-mono font-bold text-foreground">
            ₹150 Cr
          </div>
        </div>
        <div className="rounded-md border border-border bg-muted/30 p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">
            Interest Rate Band
          </div>
          <div className="text-xl font-mono font-bold text-foreground">
            9.0–9.75%
          </div>
        </div>
        <div className="rounded-md border border-border bg-muted/30 p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Risk Premium</div>
          <div className="text-2xl font-mono font-bold text-foreground">
            75 bps
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        View the case detail page for the complete Credit Appraisal Memo with
        all analysis details.
      </p>
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────────

export default function NewAppraisal() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CompanyForm>({
    companyName: "",
    cin: "",
    sector: "",
    loanAmount: "",
    tenureMonths: "",
    purposeOfLoan: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [sections, setSections] =
    useState<IngestionSection[]>(getInitialSections);
  const [siteVisit, setSiteVisit] = useState("");
  const [mgmtInterview, setMgmtInterview] = useState("");
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(
    INITIAL_PIPELINE_STAGES,
  );
  const [analysisComplete, setAnalysisComplete] = useState(false);

  function handleNext() {
    if (step === 0) {
      const errors = validateForm(form);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const stepContent = [
    <Step1Form key="s1" form={form} setForm={setForm} errors={formErrors} />,
    <Step2Ingestion
      key="s2"
      sections={sections}
      setSections={setSections}
      siteVisit={siteVisit}
      setSiteVisit={setSiteVisit}
      mgmtInterview={mgmtInterview}
      setMgmtInterview={setMgmtInterview}
    />,
    <Step3Analysis
      key="s3"
      stages={pipelineStages}
      setStages={setPipelineStages}
      analysisComplete={analysisComplete}
      setAnalysisComplete={setAnalysisComplete}
    />,
    <Step4CAMPreview key="s4" />,
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          New Credit Appraisal
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Follow the steps to initiate a comprehensive credit assessment
        </p>
      </div>

      {/* Step indicator */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-0">
          {STEPS.map((label, idx) => {
            const isDone = idx < step;
            const isCurrent = idx === step;
            const isLast = idx === STEPS.length - 1;
            return (
              <div key={label} className="flex items-center flex-1">
                <div
                  className={cn(
                    "flex items-center gap-2 flex-shrink-0",
                    isCurrent
                      ? "text-primary"
                      : isDone
                        ? "text-emerald-400"
                        : "text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono border flex-shrink-0",
                      isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : isDone
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-border bg-muted/30 text-muted-foreground",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium whitespace-nowrap hidden sm:block",
                      isCurrent
                        ? "text-primary"
                        : isDone
                          ? "text-emerald-400"
                          : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "flex-1 h-px mx-2",
                      isDone ? "bg-emerald-500/40" : "bg-border",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-base font-display font-semibold text-foreground mb-5 pb-4 border-b border-border">
          Step {step + 1}: {STEPS[step]}
        </h2>
        {stepContent[step]}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={step === 0 ? () => navigate({ to: "/cases" }) : handleBack}
          className="gap-2"
          data-ocid="new_appraisal.back.button"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 0 ? "Cancel" : "Back"}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            className="gap-2 bg-primary/90 hover:bg-primary"
            data-ocid="new_appraisal.next.button"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() =>
              navigate({ to: "/cases/$caseId", params: { caseId: "case-002" } })
            }
            className="gap-2 bg-emerald-600 hover:bg-emerald-500"
          >
            View Full CAM
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Ensure ArrowRight is imported
import { ArrowRight } from "lucide-react";
