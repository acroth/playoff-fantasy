import { ScoringRules } from '@/types/scoring.types';

// Custom scoring configuration for playoff fantasy
export const scoringRules: ScoringRules = {
  passing: {
    yards: 0.04,          // 1 point per 25 yards (0.04 per yard)
    touchdowns: 4,        // 4 points per passing TD
    interceptions: -2,    // -2 points per interception
    completions: 0,       // No points for completions
  },
  
  rushing: {
    yards: 0.1,           // 1 point per 10 yards (0.1 per yard)
    touchdowns: 6,        // 6 points per rushing TD
  },
  
  receiving: {
    yards: 0.1,           // 1 point per 10 yards (0.1 per yard)
    touchdowns: 6,        // 6 points per receiving TD
    receptions: 1,        // 1 point per reception (Full PPR)
  },
  
  kicking: {
    fieldGoal0to19: 3,    // 3 points for 0-19 yard FG
    fieldGoal20to29: 3,   // 3 points for 20-29 yard FG
    fieldGoal30to39: 3,   // 3 points for 30-39 yard FG
    fieldGoal40to49: 4,   // 4 points for 40-49 yard FG
    fieldGoal50Plus: 5,   // 5 points for 50+ yard FG
    extraPoint: 1,        // 1 point per extra point
    missedFieldGoal: 0,   // No penalty for missed FGs
  },
  
  defense: {
    sack: 1,              // 1 point per sack
    interception: 2,      // 2 points per interception
    fumbleRecovery: 2,    // 2 points per fumble recovery
    safety: 2,            // 2 points per safety
    touchdown: 6,         // 6 points per defensive/ST touchdown
    
    // Points allowed scoring
    pointsAllowed0: 10,        // 0 points allowed
    pointsAllowed1to6: 7,      // 1-6 points allowed
    pointsAllowed7to13: 4,     // 7-13 points allowed
    pointsAllowed14to20: 1,    // 14-20 points allowed
    pointsAllowed21to27: 0,    // 21-27 points allowed
    pointsAllowed28to34: -1,   // 28-34 points allowed
    pointsAllowed35Plus: -4,   // 35+ points allowed
  },
  
  misc: {
    fumbleLost: -2,         // -2 points per fumble lost
    twoPointConversion: 2,  // 2 points for 2-point conversion
  },
};

