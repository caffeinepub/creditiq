import {
  pipelineStages,
  riskDistribution,
  sectorExposure,
} from "@/data/mockData";
import { Activity, BarChart2, PieChartIcon, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const approvalTrendData = [
  { month: "Oct", approved: 8, conditional: 3, rejected: 2 },
  { month: "Nov", approved: 10, conditional: 4, rejected: 1 },
  { month: "Dec", approved: 7, conditional: 5, rejected: 3 },
  { month: "Jan", approved: 11, conditional: 3, rejected: 2 },
  { month: "Feb", approved: 9, conditional: 4, rejected: 1 },
  { month: "Mar", approved: 12, conditional: 2, rejected: 2 },
];

const avgScoreBySector = [
  { sector: "Pharma", score: 82 },
  { sector: "IT", score: 75 },
  { sector: "FMCG", score: 72 },
  { sector: "Infrastructure", score: 71 },
  { sector: "Steel", score: 69 },
  { sector: "Real Estate", score: 65 },
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

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "oklch(0.18 0.024 255)",
    border: "1px solid oklch(0.28 0.028 255)",
    borderRadius: "6px",
    fontSize: "12px",
    color: "oklch(0.93 0.01 255)",
    fontFamily: "Geist Mono",
  },
  cursor: { fill: "oklch(0.22 0.025 255)" },
};

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in" data-ocid="analytics.page">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Portfolio performance and trend analysis — FY 2025–26
        </p>
      </div>

      {/* Summary stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Cases Processed",
            value: "47",
            icon: BarChart2,
            color: "text-blue-400",
            bg: "bg-blue-500/10 border-blue-500/20",
          },
          {
            label: "Avg Turnaround",
            value: "8.2d",
            icon: Activity,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
          },
          {
            label: "Portfolio Approval",
            value: "73%",
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20",
          },
          {
            label: "Total Exposure",
            value: "₹1,295 Cr",
            icon: PieChartIcon,
            color: "text-primary",
            bg: "bg-primary/10 border-primary/20",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center border ${stat.bg}`}
                >
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-mono font-bold text-foreground">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Approval Trend */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-4">
            Monthly Decision Trend
          </h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={approvalTrendData}
                margin={{ left: -20, right: 0 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 11,
                    fontFamily: "Plus Jakarta Sans",
                    fill: "oklch(0.58 0.025 255)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fontFamily: "Geist Mono",
                    fill: "oklch(0.58 0.025 255)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    fontFamily: "Plus Jakarta Sans",
                  }}
                />
                <Bar
                  dataKey="approved"
                  name="Approved"
                  fill="#10b981"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={18}
                />
                <Bar
                  dataKey="conditional"
                  name="Conditional"
                  fill="#f59e0b"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={18}
                />
                <Bar
                  dataKey="rejected"
                  name="Rejected"
                  fill="#ef4444"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-4">
            Risk Band Distribution
          </h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={riskDistribution}
                layout="vertical"
                margin={{ left: 0, right: 20 }}
              >
                <XAxis
                  type="number"
                  tick={{
                    fontSize: 11,
                    fontFamily: "Geist Mono",
                    fill: "oklch(0.58 0.025 255)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
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
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar
                  dataKey="count"
                  name="Cases"
                  radius={[0, 3, 3, 0]}
                  maxBarSize={14}
                >
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

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Avg Score by Sector */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-4">
            Avg Credit Score by Sector
          </h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={avgScoreBySector}
                layout="vertical"
                margin={{ left: 10, right: 20 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{
                    fontSize: 11,
                    fontFamily: "Geist Mono",
                    fill: "oklch(0.58 0.025 255)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="sector"
                  width={80}
                  tick={{
                    fontSize: 11,
                    fontFamily: "Plus Jakarta Sans",
                    fill: "oklch(0.58 0.025 255)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar
                  dataKey="score"
                  name="Avg Score"
                  radius={[0, 3, 3, 0]}
                  maxBarSize={14}
                >
                  {avgScoreBySector.map((entry) => {
                    const color =
                      entry.score >= 80
                        ? "#10b981"
                        : entry.score >= 70
                          ? "#3b82f6"
                          : "#f59e0b";
                    return (
                      <Cell key={entry.sector} fill={color} opacity={0.85} />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline breakdown */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-4">
            Pipeline Stage Distribution
          </h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineStages}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={3}
                >
                  {pipelineStages.map((entry, index) => {
                    const colors = ["#64748b", "#3b82f6", "#f59e0b", "#10b981"];
                    return <Cell key={entry.label} fill={colors[index]} />;
                  })}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    fontFamily: "Plus Jakarta Sans",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sector exposure table */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-4">
          Sector Exposure Detail
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-0 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sector
              </th>
              <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Cases
              </th>
              <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Avg Score
              </th>
              <th className="text-right px-0 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Health
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {sectorExposure.map((s) => (
              <tr
                key={s.sector}
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="px-0 py-3 font-medium text-foreground">
                  {s.sector}
                </td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  {s.count}
                </td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  {s.avgScore}
                </td>
                <td className="px-0 py-3 text-right">
                  <span
                    className={`text-xs font-medium ${s.avgScore >= 80 ? "text-emerald-400" : s.avgScore >= 70 ? "text-blue-400" : "text-amber-400"}`}
                  >
                    {s.avgScore >= 80
                      ? "Strong"
                      : s.avgScore >= 70
                        ? "Moderate"
                        : "Watch"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
