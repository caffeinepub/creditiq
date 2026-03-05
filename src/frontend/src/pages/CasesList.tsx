import { ScoreBadge } from "@/components/creditiq/CreditScoreGauge";
import { StatusBadge } from "@/components/creditiq/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CaseStatus,
  type Recommendation,
  SECTORS,
  mockCases,
} from "@/data/mockData";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Eye, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 5;

const ALL_STATUSES: CaseStatus[] = [
  "Draft",
  "DataIngestion",
  "Analysis",
  "Completed",
  "Rejected",
];
const ALL_RECOMMENDATIONS: Recommendation[] = [
  "Approve",
  "ConditionalApprove",
  "Reject",
];

export default function CasesList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [recFilter, setRecFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return mockCases.filter((c) => {
      const matchSearch =
        !search ||
        c.companyName.toLowerCase().includes(search.toLowerCase()) ||
        c.cin.toLowerCase().includes(search.toLowerCase()) ||
        c.caseId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchSector = sectorFilter === "all" || c.sector === sectorFilter;
      const matchRec = recFilter === "all" || c.recommendation === recFilter;
      return matchSearch && matchStatus && matchSector && matchRec;
    });
  }, [search, statusFilter, sectorFilter, recFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange(fn: (v: string) => void, val: string) {
    fn(val);
    setPage(1);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Cases
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} case{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button
          data-ocid="cases.new_appraisal.button"
          onClick={() => navigate({ to: "/new-appraisal" })}
          className="gap-2 bg-primary/90 hover:bg-primary"
        >
          <Plus className="w-4 h-4" />
          New Appraisal
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="cases.search.input"
            placeholder="Search by company, CIN, or case ID…"
            className="pl-9 bg-muted/40 border-border text-sm"
            value={search}
            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => handleFilterChange(setStatusFilter, v)}
        >
          <SelectTrigger
            data-ocid="cases.status.select"
            className="w-[160px] bg-muted/40 border-border text-sm"
          >
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "DataIngestion" ? "Data Ingestion" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sectorFilter}
          onValueChange={(v) => handleFilterChange(setSectorFilter, v)}
        >
          <SelectTrigger
            data-ocid="cases.sector.select"
            className="w-[160px] bg-muted/40 border-border text-sm"
          >
            <SelectValue placeholder="All Sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {SECTORS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={recFilter}
          onValueChange={(v) => handleFilterChange(setRecFilter, v)}
        >
          <SelectTrigger className="w-[180px] bg-muted/40 border-border text-sm">
            <SelectValue placeholder="All Recommendations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Recommendations</SelectItem>
            {ALL_RECOMMENDATIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r === "ConditionalApprove" ? "Conditional Approve" : r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="cases.table">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Case ID",
                  "Company",
                  "CIN",
                  "Sector",
                  "Loan (₹ Cr)",
                  "Tenure",
                  "Score",
                  "Risk Band",
                  "Status",
                  "Recommendation",
                  "Created",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No cases match your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((c, idx) => (
                  <tr
                    key={c.id}
                    className="border-b border-border/50 hover:bg-accent/30 transition-colors cursor-pointer"
                    data-ocid={`cases.row.${idx + 1}`}
                    onClick={() =>
                      navigate({
                        to: "/cases/$caseId",
                        params: { caseId: c.id },
                      })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      navigate({
                        to: "/cases/$caseId",
                        params: { caseId: c.id },
                      })
                    }
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-primary">
                        {c.caseId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground whitespace-nowrap">
                        {c.companyName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {c.cin}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {c.sector}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-medium text-foreground">
                        {c.loanAmount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {c.tenureMonths} mo
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={c.score} riskBand={c.riskBand} />
                    </td>
                    <td className="px-4 py-3">
                      {c.riskBand ? (
                        <StatusBadge value={c.riskBand} variant="riskBand" />
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={c.status} variant="status" />
                    </td>
                    <td className="px-4 py-3">
                      {c.recommendation ? (
                        <StatusBadge
                          value={c.recommendation}
                          variant="recommendation"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {c.createdDate}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-primary hover:text-primary/80 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate({
                            to: "/cases/$caseId",
                            params: { caseId: c.id },
                          });
                        }}
                        data-ocid={`cases.view.button.${idx + 1}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Showing {paginated.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              data-ocid="cases.pagination_prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground font-mono">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              data-ocid="cases.pagination_next"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
