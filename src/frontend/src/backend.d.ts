import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface DataIngestionStatus {
    filings: Array<SourceStatus>;
}
export interface SourceStatus {
    status: SourceStatusEnum;
    name: SourceCategory;
    notes?: string;
}
export interface CreditScore {
    roe: number;
    netProfitMargin: number;
    overallScore: bigint;
    currentRatio: number;
    interestCoverageRatio: number;
    dscr: number;
    riskBand: RiskBand;
    managementQuality: bigint;
    debtToEquity: number;
    legalRiskScore: bigint;
    industryOutlook: bigint;
    complianceScore: bigint;
    financialHealth: bigint;
}
export interface EarlyWarningSignal {
    description: string;
    category: SignalCategory;
    severity: Severity;
    detectedDate: Time;
}
export interface CreditCase {
    id: bigint;
    cin: string;
    status: CaseStatus;
    camReport?: CAMReport;
    sector: Sector;
    creditScore?: CreditScore;
    tenureMonths: bigint;
    earlyWarningSignals?: Array<EarlyWarningSignal>;
    createdTimestamp: Time;
    companyName: string;
    dataIngestion?: DataIngestionStatus;
    loanAmountCrores: bigint;
    assignedAnalyst?: Principal;
}
export interface CAMReport {
    keyStrengths: Array<string>;
    keyRisks: Array<string>;
    recommendedLimitCrores: bigint;
    interestRateMax: number;
    interestRateMin: number;
    executiveSummary: string;
    riskPremiumBps: bigint;
    conditions: Array<string>;
    recommendation: Recommendation;
}
export interface UserProfile {
    name: string;
    department: string;
}
export enum CaseStatus {
    completed = "completed",
    rejected = "rejected",
    dataIngestion = "dataIngestion",
    analysis = "analysis",
    draft = "draft"
}
export enum Recommendation {
    reject = "reject",
    approve = "approve",
    conditionalApprove = "conditionalApprove"
}
export enum RiskBand {
    a = "a",
    b = "b",
    d = "d",
    aa = "aa",
    bb = "bb",
    aaa = "aaa",
    bbb = "bbb",
    ccc = "ccc"
}
export enum Sector {
    it = "it",
    realEstate = "realEstate",
    auto = "auto",
    fmcg = "fmcg",
    chemicals = "chemicals",
    steel = "steel",
    infrastructure = "infrastructure",
    textile = "textile",
    pharma = "pharma"
}
export enum Severity {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum SignalCategory {
    compliance = "compliance",
    legal = "legal",
    market = "market",
    financial = "financial",
    management = "management"
}
export enum SourceCategory {
    gst = "gst",
    itr = "itr",
    legalDisputes = "legalDisputes",
    siteVisitNotes = "siteVisitNotes",
    ratingReport = "ratingReport",
    boardMinutes = "boardMinutes",
    financialStatements = "financialStatements",
    managementInterviewNotes = "managementInterviewNotes",
    shareholdingPattern = "shareholdingPattern",
    annualReport = "annualReport",
    newsIntelligence = "newsIntelligence",
    bankStatements = "bankStatements",
    mcaFilings = "mcaFilings"
}
export enum SourceStatusEnum {
    pending = "pending",
    done = "done",
    error = "error",
    uploaded = "uploaded",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignAnalyst(caseId: bigint, analyst: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeCaseStatus(caseId: bigint, status: CaseStatus): Promise<void>;
    createCreditCase(companyName: string, cin: string, sector: Sector, loanAmountCrores: bigint, tenureMonths: bigint): Promise<bigint>;
    filterCasesBySector(sector: Sector): Promise<Array<CreditCase>>;
    filterCasesByStatus(status: CaseStatus): Promise<Array<CreditCase>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCreditCase(caseId: bigint): Promise<CreditCase>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listCases(): Promise<Array<CreditCase>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    triggerAnalysis(caseId: bigint, creditScore: CreditScore, earlyWarningSignals: Array<EarlyWarningSignal> | null, camReport: CAMReport): Promise<void>;
    updateDataIngestion(caseId: bigint, dataIngestion: DataIngestionStatus): Promise<void>;
}
