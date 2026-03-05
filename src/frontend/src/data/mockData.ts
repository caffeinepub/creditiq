export type RiskBand = "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "D";
export type CaseStatus =
  | "Draft"
  | "DataIngestion"
  | "Analysis"
  | "Completed"
  | "Rejected";
export type Recommendation = "Approve" | "ConditionalApprove" | "Reject";
export type EWSSeverity = "Critical" | "High" | "Medium" | "Low";
export type DataSourceStatus =
  | "Pending"
  | "Uploaded"
  | "Processing"
  | "Done"
  | "Error";

export interface FinancialRatios {
  dscr: number;
  currentRatio: number;
  debtEquity: number;
  icr: number;
  roe: number;
  npm: number;
}

export interface SubScores {
  financialHealth: number;
  managementQuality: number;
  industryOutlook: number;
  compliance: number;
  legalRisk: number;
}

export interface EarlyWarningSignal {
  id: string;
  severity: EWSSeverity;
  category: string;
  description: string;
  detectedDate: string;
}

export interface DataSource {
  id: string;
  name: string;
  category: "Structured" | "Unstructured" | "External" | "Primary";
  status: DataSourceStatus;
  lastUpdated: string | null;
}

export interface CAMReport {
  recommendedLimit: number;
  interestRateLow: number;
  interestRateHigh: number;
  riskPremiumBps: number;
  executiveSummary: string;
  keyStrengths: string[];
  keyRisks: string[];
  conditions: string[];
}

export interface CreditCase {
  id: string;
  caseId: string;
  companyName: string;
  cin: string;
  sector: string;
  loanAmount: number;
  tenureMonths: number;
  purposeOfLoan: string;
  status: CaseStatus;
  score: number | null;
  riskBand: RiskBand | null;
  recommendation: Recommendation | null;
  createdDate: string;
  assignedAnalyst: string;
  ingestionProgress: number;
  ratios: FinancialRatios | null;
  subScores: SubScores | null;
  earlyWarningSignals: EarlyWarningSignal[];
  dataSources: DataSource[];
  camReport: CAMReport | null;
}

export const SECTORS = [
  "Steel",
  "Pharma",
  "Infrastructure",
  "IT",
  "FMCG",
  "Automotive",
  "Textiles",
  "Real Estate",
  "Energy",
  "Healthcare",
  "Chemicals",
  "Logistics",
];

const defaultDataSources = (
  partialStatuses: Partial<Record<string, DataSourceStatus>> = {},
): DataSource[] => {
  const sources: {
    id: string;
    name: string;
    category: DataSource["category"];
  }[] = [
    { id: "gst", name: "GST Filings", category: "Structured" },
    { id: "itr", name: "Income Tax Returns (ITR)", category: "Structured" },
    { id: "bank", name: "Bank Statements", category: "Structured" },
    { id: "annual_report", name: "Annual Report", category: "Unstructured" },
    {
      id: "financials",
      name: "Financial Statements",
      category: "Unstructured",
    },
    {
      id: "board_minutes",
      name: "Board Meeting Minutes",
      category: "Unstructured",
    },
    {
      id: "rating_report",
      name: "Rating Agency Report",
      category: "Unstructured",
    },
    {
      id: "shareholding",
      name: "Shareholding Pattern",
      category: "Unstructured",
    },
    { id: "news", name: "News Intelligence", category: "External" },
    { id: "mca", name: "MCA Filings", category: "External" },
    { id: "legal", name: "Legal Disputes (eCourts)", category: "External" },
    { id: "site_visit", name: "Site Visit Notes", category: "Primary" },
    {
      id: "mgmt_interview",
      name: "Management Interview Notes",
      category: "Primary",
    },
  ];
  return sources.map((s) => ({
    ...s,
    status: partialStatuses[s.id] ?? "Pending",
    lastUpdated:
      partialStatuses[s.id] === "Done" || partialStatuses[s.id] === "Uploaded"
        ? "2026-02-20"
        : null,
  }));
};

export const mockCases: CreditCase[] = [
  {
    id: "case-001",
    caseId: "CASE-2026-001",
    companyName: "Tata Advanced Materials Ltd",
    cin: "L27100MH1998PLC112543",
    sector: "Steel",
    loanAmount: 350,
    tenureMonths: 84,
    purposeOfLoan:
      "Expansion of manufacturing capacity at Pune facility and modernization of blast furnace technology to meet BIS standards.",
    status: "Completed",
    score: 78,
    riskBand: "BBB",
    recommendation: "ConditionalApprove",
    createdDate: "2026-01-15",
    assignedAnalyst: "Priya Sharma",
    ingestionProgress: 100,
    ratios: {
      dscr: 1.42,
      currentRatio: 1.85,
      debtEquity: 1.2,
      icr: 3.8,
      roe: 14.2,
      npm: 8.5,
    },
    subScores: {
      financialHealth: 72,
      managementQuality: 80,
      industryOutlook: 65,
      compliance: 85,
      legalRisk: 78,
    },
    earlyWarningSignals: [
      {
        id: "ews-001-1",
        severity: "Medium",
        category: "Financial",
        description:
          "Revenue concentration >40% in single customer (SAIL) creates dependency risk.",
        detectedDate: "2026-01-28",
      },
      {
        id: "ews-001-2",
        severity: "High",
        category: "Market",
        description:
          "Steel sector facing anti-dumping duties from US and EU — potential 12–15% revenue headwind in FY27.",
        detectedDate: "2026-02-01",
      },
    ],
    dataSources: defaultDataSources({
      gst: "Done",
      itr: "Done",
      bank: "Done",
      annual_report: "Done",
      financials: "Done",
      board_minutes: "Done",
      rating_report: "Done",
      shareholding: "Done",
      news: "Done",
      mca: "Done",
      legal: "Done",
      site_visit: "Done",
      mgmt_interview: "Done",
    }),
    camReport: {
      recommendedLimit: 280,
      interestRateLow: 10.5,
      interestRateHigh: 11.5,
      riskPremiumBps: 180,
      executiveSummary:
        "Tata Advanced Materials Ltd demonstrates solid operational performance with a DSCR of 1.42x, reflecting adequate but not comfortable debt servicing capacity. The company's strong management track record and compliance posture are positives. However, the elevated customer concentration (40%+ with SAIL) and macro headwinds from US/EU anti-dumping measures on steel introduce moderate cyclical risk. The recommended credit limit of ₹280 Cr (vs. ₹350 Cr requested) reflects a 20% haircut to account for peak-cycle steel pricing assumptions and provide a buffer against margin compression. Conditional approval is recommended subject to additional collateral and performance covenants.",
      keyStrengths: [
        "Strong management team with 25+ years average tenure in steel manufacturing",
        "Diversified product portfolio across flat and long steel products",
        "CARE BBB+ rating with stable outlook confirms adequate creditworthiness",
        "Established lender relationships with SBI and HDFC — no overdues on record",
        "ISO 9001:2015 and BIS certification across all product lines",
      ],
      keyRisks: [
        "Customer concentration: Top-1 customer represents 43% of FY25 revenue",
        "Anti-dumping duties from US/EU create 12–15% revenue headwind risk in FY27",
        "Working capital cycle extended to 92 days vs. sector average of 75 days",
        "Capex plan aggressive relative to cash generation — execution risk exists",
      ],
      conditions: [
        "Additional collateral: equitable mortgage on Pune plant machinery (₹80 Cr value)",
        "Quarterly DSCR reporting covenant — breach triggers mandatory prepayment review",
        "Escrow mechanism for 15% of loan repayments from identified receivables",
        "Restriction on dividend payout exceeding 30% of PAT during loan tenure",
        "Annual independent technical audit of expanded manufacturing facility",
      ],
    },
  },
  {
    id: "case-002",
    caseId: "CASE-2026-002",
    companyName: "Zenith Pharma Industries",
    cin: "L24230GJ2005PLC044231",
    sector: "Pharma",
    loanAmount: 150,
    tenureMonths: 60,
    purposeOfLoan:
      "Setting up a WHO-GMP compliant API manufacturing unit in Ahmedabad SEZ and expanding exports to regulated markets (US, EU, UK).",
    status: "Completed",
    score: 86,
    riskBand: "A",
    recommendation: "Approve",
    createdDate: "2026-01-22",
    assignedAnalyst: "Priya Sharma",
    ingestionProgress: 100,
    ratios: {
      dscr: 2.1,
      currentRatio: 2.4,
      debtEquity: 0.6,
      icr: 6.2,
      roe: 22.1,
      npm: 15.3,
    },
    subScores: {
      financialHealth: 88,
      managementQuality: 85,
      industryOutlook: 90,
      compliance: 82,
      legalRisk: 95,
    },
    earlyWarningSignals: [
      {
        id: "ews-002-1",
        severity: "Low",
        category: "Compliance",
        description:
          "Pending CDSCO renewal for 2 product licenses (Metformin HCl, Amlodipine) — renewal expected within 60 days, minor disruption risk.",
        detectedDate: "2026-02-10",
      },
    ],
    dataSources: defaultDataSources({
      gst: "Done",
      itr: "Done",
      bank: "Done",
      annual_report: "Done",
      financials: "Done",
      board_minutes: "Done",
      rating_report: "Done",
      shareholding: "Done",
      news: "Done",
      mca: "Done",
      legal: "Done",
      site_visit: "Done",
      mgmt_interview: "Done",
    }),
    camReport: {
      recommendedLimit: 150,
      interestRateLow: 9.0,
      interestRateHigh: 9.75,
      riskPremiumBps: 75,
      executiveSummary:
        "Zenith Pharma Industries presents a strong credit profile underpinned by exceptional financial metrics: DSCR of 2.1x, ROE of 22.1%, and minimal leverage (D/E 0.6x). The company's focus on regulated-market APIs (US FDA, EU EMA approved facilities) provides premium pricing power and stable export revenue. The management team's execution track record on prior capex cycles is commendable. The loan purpose — WHO-GMP compliant API unit in Ahmedabad SEZ — is strategically sound and backed by confirmed off-take agreements worth ₹240 Cr annually. Full approval at the requested limit of ₹150 Cr is recommended with standard covenants.",
      keyStrengths: [
        "US FDA-inspected facility with zero 483 observations in last 3 audits",
        "Confirmed export off-take agreements covering 1.6x the proposed loan amount",
        "Strong promoter commitment: 68% shareholding with no pledging",
        "Pharma sector outlook remains robust with India API market growing at 12% CAGR",
        "Minimal legal risk — no pending litigations above ₹1 Cr threshold",
        "Consistently improving margins: NPM improved from 11.2% to 15.3% over 3 years",
      ],
      keyRisks: [
        "CDSCO license renewal pending for 2 products (minor, expected resolution in 60 days)",
        "Regulatory risk: US FDA import alert could materially impact export revenue",
        "R&D pipeline concentration — 3 molecules represent 55% of new product revenue",
      ],
      conditions: [
        "Standard quarterly financial reporting and DSCR compliance certificate",
        "Obtain CDSCO renewals for Metformin HCl and Amlodipine within 90 days of disbursal",
        "Maintain minimum net worth covenant of ₹180 Cr throughout loan tenure",
      ],
    },
  },
  {
    id: "case-003",
    caseId: "CASE-2026-003",
    companyName: "BuildRight Infrastructure",
    cin: "U45200DL2010PLC198765",
    sector: "Infrastructure",
    loanAmount: 500,
    tenureMonths: 120,
    purposeOfLoan:
      "Financing construction of 4-lane highway stretch (NH-48, Km 240–285) under HAM model — NHAI awarded contract FY25.",
    status: "Analysis",
    score: null,
    riskBand: null,
    recommendation: null,
    createdDate: "2026-02-05",
    assignedAnalyst: "Rohan Mehta",
    ingestionProgress: 80,
    ratios: null,
    subScores: null,
    earlyWarningSignals: [],
    dataSources: defaultDataSources({
      gst: "Done",
      itr: "Done",
      bank: "Done",
      annual_report: "Done",
      financials: "Done",
      board_minutes: "Uploaded",
      rating_report: "Processing",
      shareholding: "Done",
      news: "Done",
      mca: "Done",
      legal: "Processing",
      site_visit: "Pending",
      mgmt_interview: "Pending",
    }),
    camReport: null,
  },
  {
    id: "case-004",
    caseId: "CASE-2026-004",
    companyName: "NexGen IT Solutions",
    cin: "U72200KA2015PTC082341",
    sector: "IT",
    loanAmount: 75,
    tenureMonths: 36,
    purposeOfLoan:
      "Working capital financing to support ramp-up of two large GCC (Global Capability Centre) contracts won from Fortune 500 clients.",
    status: "DataIngestion",
    score: null,
    riskBand: null,
    recommendation: null,
    createdDate: "2026-02-18",
    assignedAnalyst: "Priya Sharma",
    ingestionProgress: 45,
    ratios: null,
    subScores: null,
    earlyWarningSignals: [],
    dataSources: defaultDataSources({
      gst: "Done",
      itr: "Done",
      bank: "Processing",
      annual_report: "Uploaded",
      financials: "Processing",
      board_minutes: "Pending",
      rating_report: "Pending",
      shareholding: "Done",
      news: "Done",
      mca: "Done",
      legal: "Pending",
      site_visit: "Pending",
      mgmt_interview: "Pending",
    }),
    camReport: null,
  },
  {
    id: "case-005",
    caseId: "CASE-2026-005",
    companyName: "Annapurna FMCG Ltd",
    cin: "L15400MH2001PLC134567",
    sector: "FMCG",
    loanAmount: 220,
    tenureMonths: 72,
    purposeOfLoan:
      "Debt consolidation and working capital for expansion into Tier-2/3 markets — new distribution centers in MP, Rajasthan, and UP.",
    status: "Completed",
    score: 61,
    riskBand: "BB",
    recommendation: "Reject",
    createdDate: "2026-01-08",
    assignedAnalyst: "Priya Sharma",
    ingestionProgress: 100,
    ratios: {
      dscr: 0.95,
      currentRatio: 1.1,
      debtEquity: 2.8,
      icr: 1.4,
      roe: 6.2,
      npm: 2.1,
    },
    subScores: {
      financialHealth: 52,
      managementQuality: 60,
      industryOutlook: 70,
      compliance: 58,
      legalRisk: 65,
    },
    earlyWarningSignals: [
      {
        id: "ews-005-1",
        severity: "Critical",
        category: "Financial",
        description:
          "DSCR of 0.95x is below 1.0 threshold — company cannot service its debt from operating cash flows alone without asset monetization.",
        detectedDate: "2026-02-12",
      },
      {
        id: "ews-005-2",
        severity: "High",
        category: "Legal",
        description:
          "3 pending NCLT cases: supplier disputes (₹18 Cr), employee PF default (₹4.2 Cr), and inter-corporate loan dispute (₹22 Cr).",
        detectedDate: "2026-02-14",
      },
      {
        id: "ews-005-3",
        severity: "Medium",
        category: "Management",
        description:
          "Key management attrition: CFO and COO exits within 12 months raises governance concerns and continuity risk.",
        detectedDate: "2026-02-15",
      },
    ],
    dataSources: defaultDataSources({
      gst: "Done",
      itr: "Done",
      bank: "Done",
      annual_report: "Done",
      financials: "Done",
      board_minutes: "Done",
      rating_report: "Done",
      shareholding: "Done",
      news: "Done",
      mca: "Done",
      legal: "Done",
      site_visit: "Done",
      mgmt_interview: "Done",
    }),
    camReport: {
      recommendedLimit: 0,
      interestRateLow: 0,
      interestRateHigh: 0,
      riskPremiumBps: 0,
      executiveSummary:
        "Annapurna FMCG Ltd's credit application is recommended for rejection based on multiple critical risk factors that individually and collectively exceed our risk appetite. The sub-unity DSCR (0.95x) indicates the company's operating cash flows are insufficient to meet existing debt obligations, making additional leverage counterproductive. Three pending NCLT cases with combined exposure of ₹44.2 Cr represent material contingent liabilities. The recent departure of both CFO and COO within a 12-month window raises serious governance and continuity concerns. The company may reapply after a 6-month stabilization period with evidence of improved cash flows, NCLT case resolution, and appointment of qualified C-suite replacements.",
      keyStrengths: [
        "Established brand with 20+ years of market presence in West India",
        "Moderate industry tailwinds from rural consumption recovery",
        "Asset-heavy balance sheet provides collateral buffer",
      ],
      keyRisks: [
        "DSCR of 0.95x — operating cash flows insufficient to service existing debt",
        "D/E ratio of 2.8x significantly above sector average of 1.2x",
        "3 pending NCLT cases with aggregate exposure of ₹44.2 Cr",
        "C-suite instability: CFO and COO exits within 12 months",
        "Net profit margin of 2.1% leaves no buffer for adverse macro conditions",
        "Inventory build-up of 78 days vs. sector average of 45 days",
      ],
      conditions: [
        "Reapplication eligible after 6 months from date of rejection letter",
        "Must demonstrate trailing-6-month DSCR above 1.1x",
        "Resolution or adequate provisioning for all 3 NCLT cases required",
        "Appointment of CFO and COO with minimum 10 years relevant experience",
        "D/E ratio to be below 2.0x before loan disbursement",
      ],
    },
  },
];

export const dashboardKPIs = {
  totalCases: 47,
  activeCases: 12,
  avgCreditScore: 68.4,
  approvalRate: 73,
};

export const pipelineStages = [
  { label: "Draft", count: 8 },
  { label: "Data Ingestion", count: 12 },
  { label: "Analysis", count: 7 },
  { label: "Completed", count: 20 },
];

export const riskDistribution = [
  { band: "AAA", count: 2 },
  { band: "AA", count: 4 },
  { band: "A", count: 7 },
  { band: "BBB", count: 9 },
  { band: "BB", count: 10 },
  { band: "B", count: 8 },
  { band: "CCC", count: 5 },
  { band: "D", count: 2 },
];

export const sectorExposure = [
  { sector: "Infrastructure", count: 11, avgScore: 71 },
  { sector: "Pharma", count: 9, avgScore: 82 },
  { sector: "Steel", count: 8, avgScore: 69 },
  { sector: "IT", count: 7, avgScore: 75 },
];

export const ratioBenchmarks: Record<
  keyof FinancialRatios,
  {
    label: string;
    unit: string;
    min: number;
    good: number;
    excellent: number;
    higherIsBetter: boolean;
  }
> = {
  dscr: {
    label: "DSCR",
    unit: "x",
    min: 1.0,
    good: 1.3,
    excellent: 1.8,
    higherIsBetter: true,
  },
  currentRatio: {
    label: "Current Ratio",
    unit: "x",
    min: 1.0,
    good: 1.5,
    excellent: 2.0,
    higherIsBetter: true,
  },
  debtEquity: {
    label: "Debt / Equity",
    unit: "x",
    min: 3.0,
    good: 2.0,
    excellent: 1.0,
    higherIsBetter: false,
  },
  icr: {
    label: "Interest Coverage",
    unit: "x",
    min: 1.5,
    good: 3.0,
    excellent: 5.0,
    higherIsBetter: true,
  },
  roe: {
    label: "Return on Equity",
    unit: "%",
    min: 8,
    good: 15,
    excellent: 20,
    higherIsBetter: true,
  },
  npm: {
    label: "Net Profit Margin",
    unit: "%",
    min: 3,
    good: 8,
    excellent: 15,
    higherIsBetter: true,
  },
};
