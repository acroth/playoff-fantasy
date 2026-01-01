import { ESPNPlayerStats, ESPNDefenseStats } from '@/types/player.types';
import { ScoringRules } from '@/types/scoring.types';

// Calculate fantasy points for a player based on stats and scoring rules
export function calculatePlayerPoints(
  stats: ESPNPlayerStats,
  scoringRules: ScoringRules
): number {
  let points = 0;

  // Passing stats
  if (stats.passingYards) {
    points += stats.passingYards * scoringRules.passing.yards;
  }
  if (stats.passingTouchdowns) {
    points += stats.passingTouchdowns * scoringRules.passing.touchdowns;
  }
  if (stats.passingInterceptions) {
    points += stats.passingInterceptions * scoringRules.passing.interceptions;
  }

  // Rushing stats
  if (stats.rushingYards) {
    points += stats.rushingYards * scoringRules.rushing.yards;
  }
  if (stats.rushingTouchdowns) {
    points += stats.rushingTouchdowns * scoringRules.rushing.touchdowns;
  }

  // Receiving stats
  if (stats.receivingYards) {
    points += stats.receivingYards * scoringRules.receiving.yards;
  }
  if (stats.receivingTouchdowns) {
    points += stats.receivingTouchdowns * scoringRules.receiving.touchdowns;
  }
  if (stats.receptions) {
    points += stats.receptions * scoringRules.receiving.receptions;
  }

  // Kicking stats
  if (stats.fieldGoalsMade0to19) {
    points += stats.fieldGoalsMade0to19 * scoringRules.kicking.fieldGoal0to19;
  }
  if (stats.fieldGoalsMade20to29) {
    points += stats.fieldGoalsMade20to29 * scoringRules.kicking.fieldGoal20to29;
  }
  if (stats.fieldGoalsMade30to39) {
    points += stats.fieldGoalsMade30to39 * scoringRules.kicking.fieldGoal30to39;
  }
  if (stats.fieldGoalsMade40to49) {
    points += stats.fieldGoalsMade40to49 * scoringRules.kicking.fieldGoal40to49;
  }
  if (stats.fieldGoalsMade50Plus) {
    points += stats.fieldGoalsMade50Plus * scoringRules.kicking.fieldGoal50Plus;
  }
  if (stats.extraPointsMade) {
    points += stats.extraPointsMade * scoringRules.kicking.extraPoint;
  }

  // Misc penalties
  if (stats.fumblesLost) {
    points += stats.fumblesLost * scoringRules.misc.fumbleLost;
  }
  if (stats.twoPointConversions) {
    points += stats.twoPointConversions * scoringRules.misc.twoPointConversion;
  }

  return Math.round(points * 100) / 100; // Round to 2 decimal places
}

// Calculate fantasy points for defense/special teams
export function calculateDefensePoints(
  stats: ESPNDefenseStats,
  scoringRules: ScoringRules
): number {
  let points = 0;

  // Defensive stats
  if (stats.sacks) {
    points += stats.sacks * scoringRules.defense.sack;
  }
  if (stats.interceptions) {
    points += stats.interceptions * scoringRules.defense.interception;
  }
  if (stats.fumblesRecovered) {
    points += stats.fumblesRecovered * scoringRules.defense.fumbleRecovery;
  }
  if (stats.safeties) {
    points += stats.safeties * scoringRules.defense.safety;
  }
  if (stats.defensiveTouchdowns) {
    points += stats.defensiveTouchdowns * scoringRules.defense.touchdown;
  }
  if (stats.kickReturnTouchdowns) {
    points += stats.kickReturnTouchdowns * scoringRules.defense.touchdown;
  }
  if (stats.puntReturnTouchdowns) {
    points += stats.puntReturnTouchdowns * scoringRules.defense.touchdown;
  }

  // Points allowed scoring
  if (stats.pointsAllowed !== undefined) {
    const pa = stats.pointsAllowed;
    if (pa === 0) {
      points += scoringRules.defense.pointsAllowed0;
    } else if (pa >= 1 && pa <= 6) {
      points += scoringRules.defense.pointsAllowed1to6;
    } else if (pa >= 7 && pa <= 13) {
      points += scoringRules.defense.pointsAllowed7to13;
    } else if (pa >= 14 && pa <= 20) {
      points += scoringRules.defense.pointsAllowed14to20;
    } else if (pa >= 21 && pa <= 27) {
      points += scoringRules.defense.pointsAllowed21to27;
    } else if (pa >= 28 && pa <= 34) {
      points += scoringRules.defense.pointsAllowed28to34;
    } else if (pa >= 35) {
      points += scoringRules.defense.pointsAllowed35Plus;
    }
  }

  return Math.round(points * 100) / 100; // Round to 2 decimal places
}

// Calculate total roster points
export function calculateRosterPoints(
  rosterStats: {
    [position: string]: {
      stats: ESPNPlayerStats | ESPNDefenseStats;
      isDefense?: boolean;
    };
  },
  scoringRules: ScoringRules
): { positionPoints: { [key: string]: number }; total: number } {
  const positionPoints: { [key: string]: number } = {};
  let total = 0;

  Object.entries(rosterStats).forEach(([position, data]) => {
    let points = 0;
    
    if (data.isDefense) {
      points = calculateDefensePoints(data.stats as ESPNDefenseStats, scoringRules);
    } else {
      points = calculatePlayerPoints(data.stats as ESPNPlayerStats, scoringRules);
    }
    
    positionPoints[position] = points;
    total += points;
  });

  return {
    positionPoints,
    total: Math.round(total * 100) / 100,
  };
}

// Get projected points (could be enhanced with actual projection data from ESPN)
export function getProjectedPoints(stats: ESPNPlayerStats, scoringRules: ScoringRules): number {
  // For now, just return actual points
  // Could be enhanced to use ESPN projection data if available
  return calculatePlayerPoints(stats, scoringRules);
}

