'use client';

import { useQueries, useQuery } from '@tanstack/react-query';
import { Roster } from '@/types/fantasy.types';
import { scoringRules } from '@/data/scoring';
import { fetchPlayerStats, fetchTeamStats, fetchScoreboard } from '@/utils/espn';

interface PositionScore {
  playerId: string;
  position: string;
  points: number;
  playerName?: string;
  teamAbbr?: string;
  gameStatus?: string;
  loading: boolean;
  error?: string;
}

interface RosterScore {
  positions: PositionScore[];
  totalPoints: number;
  loading: boolean;
}

// Hook to calculate live scores for a matchup using TanStack Query
export function useMatchupScores(
  team1Roster: Roster | null,
  team2Roster: Roster | null,
) {
  // Fetch scoreboard with automatic refetching
  const { data: scoreboard } = useQuery({
    queryKey: ['scoreboard'],
    queryFn: fetchScoreboard,
    refetchInterval: 60 * 1000, // Refetch every minute
    staleTime: 30 * 1000, // Consider stale after 30 seconds
  });

  // Calculate scores for both teams
  const team1Score = useTeamScore(team1Roster);
  const team2Score = useTeamScore(team2Roster);

  return { team1Score, team2Score, scoreboard };
}

// Helper hook to calculate score for a single team
function useTeamScore(roster: Roster | null): RosterScore {
  const positionEntries = roster ? (Object.entries(roster) as [keyof Roster, string][]) : [];

  // Fetch all player/team data in parallel using useQueries
  const queries = useQueries({
    queries: positionEntries.map(([position, playerId]) => ({
      queryKey: position === 'DST' ? ['team', playerId] : ['player', playerId],
      queryFn: () => position === 'DST' ? fetchTeamStats(playerId) : fetchPlayerStats(playerId),
      enabled: !!roster,
      staleTime: 60 * 1000,
    })),
  });

  if (!roster) {
    return {
      positions: [],
      totalPoints: 0,
      loading: false,
    };
  }

  const isLoading = queries.some(q => q.isLoading);
  const positions: PositionScore[] = [];
  let totalPoints = 0;

  queries.forEach((query, index) => {
    const [position, playerId] = positionEntries[index];
    const isDST = position === 'DST';

    if (query.isSuccess && query.data) {
      const data = query.data;
      const points = isDST
        ? calculateDefensePointsFromStats(data.stats || {})
        : calculatePlayerPointsFromStats(data.stats || {});

      positions.push({
        playerId,
        position,
        points,
        playerName: isDST 
          ? data.team?.displayName || `Team ${playerId}`
          : data.player?.displayName || `Player ${playerId}`,
        teamAbbr: isDST 
          ? data.team?.abbreviation || ''
          : data.player?.team?.abbreviation || '',
        loading: false,
        error: Object.keys(data.stats || {}).length === 0 ? 'No data' : undefined,
      });

      totalPoints += points;
    } else {
      positions.push({
        playerId,
        position,
        points: 0,
        playerName: isDST ? `Team ${playerId}` : `Player ${playerId}`,
        loading: query.isLoading,
        error: query.isError ? 'Failed to load' : undefined,
      });
    }
  });

  return {
    positions,
    totalPoints: Math.round(totalPoints * 100) / 100,
    loading: isLoading,
  };
}

// Helper to calculate player points from raw stats
function calculatePlayerPointsFromStats(stats: any): number {
  let points = 0;

  // Apply scoring rules
  const rules = scoringRules;

  // Passing
  if (stats.passingYards) points += stats.passingYards * rules.passing.yards;
  if (stats.passingTouchdowns) points += stats.passingTouchdowns * rules.passing.touchdowns;
  if (stats.passingInterceptions) points += stats.passingInterceptions * rules.passing.interceptions;

  // Rushing
  if (stats.rushingYards) points += stats.rushingYards * rules.rushing.yards;
  if (stats.rushingTouchdowns) points += stats.rushingTouchdowns * rules.rushing.touchdowns;

  // Receiving
  if (stats.receivingYards) points += stats.receivingYards * rules.receiving.yards;
  if (stats.receivingTouchdowns) points += stats.receivingTouchdowns * rules.receiving.touchdowns;
  if (stats.receptions) points += stats.receptions * rules.receiving.receptions;

  // Kicking
  if (stats.fieldGoalsMade0to19) points += stats.fieldGoalsMade0to19 * rules.kicking.fieldGoal0to19;
  if (stats.fieldGoalsMade20to29) points += stats.fieldGoalsMade20to29 * rules.kicking.fieldGoal20to29;
  if (stats.fieldGoalsMade30to39) points += stats.fieldGoalsMade30to39 * rules.kicking.fieldGoal30to39;
  if (stats.fieldGoalsMade40to49) points += stats.fieldGoalsMade40to49 * rules.kicking.fieldGoal40to49;
  if (stats.fieldGoalsMade50Plus) points += stats.fieldGoalsMade50Plus * rules.kicking.fieldGoal50Plus;
  if (stats.extraPointsMade) points += stats.extraPointsMade * rules.kicking.extraPoint;

  // Misc
  if (stats.fumblesLost) points += stats.fumblesLost * rules.misc.fumbleLost;
  if (stats.twoPointConversions) points += stats.twoPointConversions * rules.misc.twoPointConversion;

  return Math.round(points * 100) / 100;
}

// Helper to calculate defense points from raw stats
function calculateDefensePointsFromStats(stats: any): number {
  let points = 0;
  const rules = scoringRules;

  if (stats.sacks) points += stats.sacks * rules.defense.sack;
  if (stats.interceptions) points += stats.interceptions * rules.defense.interception;
  if (stats.fumblesRecovered) points += stats.fumblesRecovered * rules.defense.fumbleRecovery;
  if (stats.safeties) points += stats.safeties * rules.defense.safety;
  if (stats.defensiveTouchdowns) points += stats.defensiveTouchdowns * rules.defense.touchdown;

  // Points allowed
  if (stats.pointsAllowed !== undefined) {
    const pa = stats.pointsAllowed;
    if (pa === 0) points += rules.defense.pointsAllowed0;
    else if (pa <= 6) points += rules.defense.pointsAllowed1to6;
    else if (pa <= 13) points += rules.defense.pointsAllowed7to13;
    else if (pa <= 20) points += rules.defense.pointsAllowed14to20;
    else if (pa <= 27) points += rules.defense.pointsAllowed21to27;
    else if (pa <= 34) points += rules.defense.pointsAllowed28to34;
    else points += rules.defense.pointsAllowed35Plus;
  }

  return Math.round(points * 100) / 100;
}
