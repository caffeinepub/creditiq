# CreditIQ — AI-Powered Corporate Credit Appraisal Engine

## Current State
New project. No existing backend or frontend code.

## Requested Changes (Diff)

### Add
- **Company Profile Setup**: Form to enter borrower company details (name, CIN, sector, turnover, loan amount requested, tenure).
- **Data Ingestion Dashboard**: Multi-tab interface showing ingestion status for all data source categories:
  - Structured Data: GST filings, ITRs, Bank Statements (upload or simulated)
  - Unstructured Data: Annual Reports, Financial Statements, Board Minutes, Rating Reports, Shareholding Pattern (file upload)
  - External Intelligence: News/Sector trends, MCA filings, Legal disputes (simulated fetch)
  - Primary Insights: Site visit observations, Management interview notes (text input)
- **AI Analysis Engine**: Simulated multi-stage analysis pipeline with progress visualization:
  1. Data Validation & Normalization
  2. Financial Ratio Computation (liquidity, leverage, coverage, profitability)
  3. Unstructured Text Analysis (sentiment, red flags, early warning signals)
  4. External Intelligence Synthesis
  5. ML-based Credit Scoring
- **Credit Score Card**: Visual scorecard showing:
  - Overall credit score (0-100) with risk band (AAA, AA, A, BBB, BB, B, C, D)
  - Sub-scores: Financial Health, Management Quality, Industry Outlook, Compliance, Legal Risk
  - Key financial ratios (DSCR, Current Ratio, Debt/Equity, Interest Coverage, ROE)
  - Early Warning Signals flagged (if any)
- **Comprehensive Credit Appraisal Memo (CAM)**: Auto-generated structured report including:
  - Executive Summary with final recommendation (Approve / Conditional Approve / Reject)
  - Recommended loan limit (in INR Cr)
  - Risk premium / suggested interest rate band
  - Detailed section-by-section findings
  - Risk mitigation conditions
  - Comparable industry benchmarks
- **Cases Management**: List of all past credit appraisal cases with status, score, and recommendation
- **Risk Analytics Dashboard**: Aggregate charts — score distribution, sector-wise risk, approval rates

### Modify
Nothing (new project).

### Remove
Nothing (new project).

## Implementation Plan

**Backend (Motoko):**
- `CreditCase` record: id, company name, CIN, sector, requested amount, tenure, status, created date
- `DataIngestionStatus` record: per-source ingestion state (pending/processing/done/error)
- `CreditScore` record: overall score, sub-scores (financial, management, industry, compliance, legal), risk band, DSCR, current ratio, debt/equity, interest coverage, ROE
- `EarlyWarningSignal` record: type, severity, description
- `CAMReport` record: recommendation, loan limit, risk premium, interest rate band, executive summary, section findings, conditions
- CRUD for cases: createCase, getCase, listCases, updateCaseStatus
- Simulated analysis trigger: runAnalysis(caseId) — sets scores and generates CAM with realistic mock data
- seedData: 3-5 pre-populated example cases at various stages

**Frontend:**
- App shell with sidebar navigation: Dashboard, New Appraisal, Cases, Analytics
- New Appraisal wizard: Step 1 (Company Details) → Step 2 (Data Ingestion) → Step 3 (Run Analysis) → Step 4 (View CAM)
- Cases list page with status badges and quick-access to CAM
- CAM viewer page with print/export layout
- Analytics page with charts (score distribution bar chart, sector pie chart, approval rate gauge)
- Realistic Indian corporate context: amounts in INR Cr, sectors like Steel/Textile/Pharma/IT/FMCG/Infrastructure
