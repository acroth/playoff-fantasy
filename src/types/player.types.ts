// ESPN API response types for players and stats

export interface ESPNPlayerStats {
  // Passing stats
  passingYards?: number;
  passingTouchdowns?: number;
  passingInterceptions?: number;
  passingCompletions?: number;
  passingAttempts?: number;
  
  // Rushing stats
  rushingYards?: number;
  rushingTouchdowns?: number;
  rushingAttempts?: number;
  
  // Receiving stats
  receivingYards?: number;
  receivingTouchdowns?: number;
  receptions?: number;
  receivingTargets?: number;
  
  // Misc offensive
  fumblesLost?: number;
  twoPointConversions?: number;
  
  // Kicking stats
  fieldGoalsMade?: number;
  fieldGoalsMade0to19?: number;
  fieldGoalsMade20to29?: number;
  fieldGoalsMade30to39?: number;
  fieldGoalsMade40to49?: number;
  fieldGoalsMade50Plus?: number;
  fieldGoalsMissed?: number;
  extraPointsMade?: number;
  extraPointsMissed?: number;
}

export interface ESPNDefenseStats {
  // Defense/Special Teams stats
  sacks?: number;
  interceptions?: number;
  fumblesRecovered?: number;
  safeties?: number;
  defensiveTouchdowns?: number;
  kickReturnTouchdowns?: number;
  puntReturnTouchdowns?: number;
  pointsAllowed?: number;
  yardsAllowed?: number;
}

export interface ESPNPlayer {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  position?: {
    abbreviation: string;
  };
  team?: {
    id: string;
    abbreviation: string;
    displayName: string;
  };
}

export interface ESPNGameStatus {
  type: {
    id: string;
    name: string;
    state: string;
    completed: boolean;
    description: string;
  };
  period: number;
  clock?: string;
  displayClock?: string;
}

export interface ESPNGame {
  id: string;
  date: string;
  status: ESPNGameStatus;
  competitions: Array<{
    competitors: Array<{
      id: string;
      team: {
        id: string;
        abbreviation: string;
        displayName: string;
      };
      score: string;
      homeAway: 'home' | 'away';
    }>;
  }>;
}

export interface ESPNScoreboard {
  events: ESPNGame[];
}

export interface PlayerWithStats extends ESPNPlayer {
  stats: ESPNPlayerStats;
  gameStatus?: ESPNGameStatus;
}

export interface TeamWithStats {
  id: string;
  abbreviation: string;
  displayName: string;
  stats: ESPNDefenseStats;
  gameStatus?: ESPNGameStatus;
}

