// Fantasy team and roster types

export type Position = 'QB' | 'RB1' | 'RB2' | 'WR1' | 'WR2' | 'TE' | 'FLEX' | 'DST' | 'K';

export interface Roster {
  QB: string;      // ESPN player ID
  RB1: string;
  RB2: string;
  WR1: string;
  WR2: string;
  TE: string;
  FLEX: string;
  DST: string;     // ESPN team ID
  K: string;
}

export interface FantasyTeam {
  id: string;
  name: string;
  roster: Roster;
}

export interface Matchup {
  team1Id: string;
  team2Id: string;
}

export interface WeekData {
  week: number;
  teams: FantasyTeam[];
  matchups: Matchup[];
}

export interface RosterWithPoints extends Roster {
  points: {
    [key in Position]: number;
  };
  total: number;
}

export interface TeamScore {
  teamId: string;
  teamName: string;
  roster: RosterWithPoints;
  totalPoints: number;
}

export interface MatchupScore {
  team1: TeamScore;
  team2: TeamScore;
  winner?: string;  // teamId of winner, undefined if game in progress or tied
}

