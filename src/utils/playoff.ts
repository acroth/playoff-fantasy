import { WeekData, FantasyTeam, Matchup } from '@/types/fantasy.types';

// Playoff bracket logic for determining matchups and winners

export interface BracketNode {
  teamId?: string;
  teamName?: string;
  score?: number;
  winnerId?: string;
}

export interface BracketMatchup {
  round: number;
  matchupIndex: number;
  team1?: BracketNode;
  team2?: BracketNode;
  winner?: string;
}

// Generate bracket from weekly data
export function generateBracket(weeklyData: WeekData[]): BracketMatchup[] {
  const bracket: BracketMatchup[] = [];
  
  weeklyData.forEach((week) => {
    week.matchups.forEach((matchup, index) => {
      const team1 = week.teams.find(t => t.id === matchup.team1Id);
      const team2 = week.teams.find(t => t.id === matchup.team2Id);
      
      bracket.push({
        round: week.week,
        matchupIndex: index,
        team1: team1 ? { teamId: team1.id, teamName: team1.name } : undefined,
        team2: team2 ? { teamId: team2.id, teamName: team2.name } : undefined,
      });
    });
  });
  
  return bracket;
}

// Determine winners from a completed week
export function determineWeekWinners(
  weekData: WeekData,
  matchupScores: Array<{ team1Score: number; team2Score: number }>
): string[] {
  const winners: string[] = [];
  
  weekData.matchups.forEach((matchup, index) => {
    const scores = matchupScores[index];
    if (scores) {
      if (scores.team1Score > scores.team2Score) {
        winners.push(matchup.team1Id);
      } else if (scores.team2Score > scores.team1Score) {
        winners.push(matchup.team2Id);
      }
      // In case of tie, could add tiebreaker logic
    }
  });
  
  return winners;
}

// Create next week's matchups from winners
export function createNextWeekMatchups(winners: string[], previousWeek: WeekData): Matchup[] {
  const matchups: Matchup[] = [];
  
  // Pair winners for next round
  for (let i = 0; i < winners.length; i += 2) {
    if (winners[i] && winners[i + 1]) {
      matchups.push({
        team1Id: winners[i],
        team2Id: winners[i + 1],
      });
    }
  }
  
  return matchups;
}

// Get teams that advance to next week
export function getAdvancingTeams(
  previousWeekData: WeekData,
  winnerIds: string[]
): FantasyTeam[] {
  return previousWeekData.teams.filter(team => winnerIds.includes(team.id));
}

// Check if bracket is complete (Super Bowl decided)
export function isBracketComplete(weeklyData: WeekData[]): boolean {
  const week4 = weeklyData.find(w => w.week === 4);
  return week4 !== undefined && week4.teams.length > 0;
}

// Get championship matchup (Super Bowl)
export function getChampionshipMatchup(weeklyData: WeekData[]): Matchup | null {
  const week4 = weeklyData.find(w => w.week === 4);
  if (week4 && week4.matchups.length > 0) {
    return week4.matchups[0];
  }
  return null;
}

