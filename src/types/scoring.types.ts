// Scoring configuration types

export interface PassingScoringRules {
  yards: number;           // Points per yard
  touchdowns: number;      // Points per TD
  interceptions: number;   // Points per INT (typically negative)
  completions?: number;    // Points per completion (optional)
}

export interface RushingScoringRules {
  yards: number;           // Points per yard
  touchdowns: number;      // Points per TD
}

export interface ReceivingScoringRules {
  yards: number;           // Points per yard
  touchdowns: number;      // Points per TD
  receptions: number;      // Points per reception (PPR)
}

export interface KickingScoringRules {
  fieldGoal0to19: number;
  fieldGoal20to29: number;
  fieldGoal30to39: number;
  fieldGoal40to49: number;
  fieldGoal50Plus: number;
  extraPoint: number;
  missedFieldGoal?: number;  // Penalty for missed FG (optional)
}

export interface DefenseScoringRules {
  sack: number;
  interception: number;
  fumbleRecovery: number;
  safety: number;
  touchdown: number;
  pointsAllowed0: number;
  pointsAllowed1to6: number;
  pointsAllowed7to13: number;
  pointsAllowed14to20: number;
  pointsAllowed21to27: number;
  pointsAllowed28to34: number;
  pointsAllowed35Plus: number;
}

export interface MiscScoringRules {
  fumbleLost: number;        // Typically negative
  twoPointConversion: number;
}

export interface ScoringRules {
  passing: PassingScoringRules;
  rushing: RushingScoringRules;
  receiving: ReceivingScoringRules;
  kicking: KickingScoringRules;
  defense: DefenseScoringRules;
  misc: MiscScoringRules;
}

