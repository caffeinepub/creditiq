import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // CreditCase definition
  public type CreditCase = {
    id : Nat;
    companyName : Text;
    cin : Text;
    sector : Sector;
    loanAmountCrores : Nat;
    tenureMonths : Nat;
    status : CaseStatus;
    createdTimestamp : Time.Time;
    assignedAnalyst : ?Principal;
    dataIngestion : ?DataIngestionStatus;
    creditScore : ?CreditScore;
    earlyWarningSignals : ?[EarlyWarningSignal];
    camReport : ?CAMReport;
  };

  public type CaseStatus = {
    #draft;
    #dataIngestion;
    #analysis;
    #completed;
    #rejected;
  };

  public type Sector = {
    #steel;
    #textile;
    #pharma;
    #it;
    #fmcg;
    #infrastructure;
    #realEstate;
    #auto;
    #chemicals;
  };

  public type DataIngestionStatus = {
    filings : [SourceStatus];
  };

  public type SourceStatus = {
    name : SourceCategory;
    status : SourceStatusEnum;
    notes : ?Text;
  };

  public type SourceStatusEnum = {
    #pending;
    #uploaded;
    #processing;
    #done;
    #error;
  };

  public type SourceCategory = {
    #gst;
    #itr;
    #bankStatements;
    #annualReport;
    #financialStatements;
    #boardMinutes;
    #ratingReport;
    #shareholdingPattern;
    #newsIntelligence;
    #mcaFilings;
    #legalDisputes;
    #siteVisitNotes;
    #managementInterviewNotes;
  };

  public type CreditScore = {
    overallScore : Nat;
    riskBand : RiskBand;
    financialHealth : Nat;
    managementQuality : Nat;
    industryOutlook : Nat;
    complianceScore : Nat;
    legalRiskScore : Nat;
    dscr : Float;
    currentRatio : Float;
    debtToEquity : Float;
    interestCoverageRatio : Float;
    roe : Float;
    netProfitMargin : Float;
  };

  public type RiskBand = {
    #aaa;
    #aa;
    #a;
    #bbb;
    #bb;
    #b;
    #ccc;
    #d;
  };

  public type EarlyWarningSignal = {
    severity : Severity;
    category : SignalCategory;
    description : Text;
    detectedDate : Time.Time;
  };

  public type Severity = {
    #low;
    #medium;
    #high;
    #critical;
  };

  public type SignalCategory = {
    #financial;
    #legal;
    #compliance;
    #management;
    #market;
  };

  public type CAMReport = {
    recommendation : Recommendation;
    recommendedLimitCrores : Nat;
    interestRateMin : Float;
    interestRateMax : Float;
    riskPremiumBps : Nat;
    executiveSummary : Text;
    conditions : [Text];
    keyStrengths : [Text];
    keyRisks : [Text];
  };

  public type Recommendation = {
    #approve;
    #conditionalApprove;
    #reject;
  };

  public type UserProfile = {
    name : Text;
    department : Text;
  };

  module CreditCase {
    public func compareById(a : CreditCase, b : CreditCase) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // State management
  let cases = Map.empty<Nat, CreditCase>();
  var nextCaseId = 1;
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // CRUD operations for CreditCase
  public shared ({ caller }) func createCreditCase(companyName : Text, cin : Text, sector : Sector, loanAmountCrores : Nat, tenureMonths : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create credit cases");
    };

    let newCase : CreditCase = {
      id = nextCaseId;
      companyName;
      cin;
      sector;
      loanAmountCrores;
      tenureMonths;
      status = #draft;
      createdTimestamp = Time.now();
      assignedAnalyst = null;
      dataIngestion = null;
      creditScore = null;
      earlyWarningSignals = null;
      camReport = null;
    };

    cases.add(nextCaseId, newCase);
    nextCaseId += 1;
    newCase.id;
  };

  public query ({ caller }) func getCreditCase(caseId : Nat) : async CreditCase {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view credit cases");
    };

    switch (cases.get(caseId)) {
      case (?creditCase) { creditCase };
      case (null) { Runtime.trap("Case not found") };
    };
  };

  public query ({ caller }) func listCases() : async [CreditCase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list credit cases");
    };

    cases.values().toArray();
  };

  public query ({ caller }) func filterCasesByStatus(status : CaseStatus) : async [CreditCase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can filter credit cases");
    };

    let filtered = cases.values().toArray().filter(
      func(creditCase) {
        creditCase.status == status;
      }
    );
    filtered.sort(CreditCase.compareById);
  };

  public query ({ caller }) func filterCasesBySector(sector : Sector) : async [CreditCase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can filter credit cases");
    };

    let filtered = cases.values().toArray().filter(
      func(creditCase) {
        creditCase.sector == sector;
      }
    );
    filtered.sort(CreditCase.compareById);
  };

  public shared ({ caller }) func updateDataIngestion(caseId : Nat, dataIngestion : DataIngestionStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update data ingestion status");
    };

    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?creditCase) {
        let updatedCase : CreditCase = {
          creditCase with
          dataIngestion = ?dataIngestion;
          status = #dataIngestion;
        };
        cases.add(caseId, updatedCase);
      };
    };
  };

  public shared ({ caller }) func assignAnalyst(caseId : Nat, analyst : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign analysts");
    };

    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?creditCase) {
        let updatedCase : CreditCase = {
          creditCase with
          assignedAnalyst = ?analyst;
        };
        cases.add(caseId, updatedCase);
      };
    };
  };

  public shared ({ caller }) func triggerAnalysis(caseId : Nat, creditScore : CreditScore, earlyWarningSignals : ?[EarlyWarningSignal], camReport : CAMReport) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can trigger analysis");
    };

    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?creditCase) {
        let updatedCase : CreditCase = {
          creditCase with
          creditScore = ?creditScore;
          earlyWarningSignals;
          camReport = ?camReport;
          status = #completed;
        };
        cases.add(caseId, updatedCase);
      };
    };
  };

  public shared ({ caller }) func changeCaseStatus(caseId : Nat, status : CaseStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can change case status directly");
    };

    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?creditCase) {
        let updatedCase : CreditCase = {
          creditCase with
          status;
        };
        cases.add(caseId, updatedCase);
      };
    };
  };
};
