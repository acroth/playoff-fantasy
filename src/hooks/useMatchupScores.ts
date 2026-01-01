'use client';

import { useState, useEffect } from 'react';
import { Roster } from '@/types/fantasy.types';
import { scoringRules } from '@/data/scoring';
import { calculateRosterPoints } from '@/utils/scoring';
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

// Hook to calculate live scores for a matchup
export function useMatchupScores(
  team1Roster: Roster | null,
  team2Roster: Roster | null,
  refreshKey: number = 0
) {
  const [team1Score, setTeam1Score] = useState<RosterScore>({
    positions: [],
    totalPoints: 0,
    loading: true,
  });
  const [team2Score, setTeam2Score] = useState<RosterScore>({
    positions: [],
    totalPoints: 0,
    loading: true,
  });
  const [scoreboard, setScoreboard] = useState<any>(null);

  useEffect(() => {
    const loadScores = async () => {
      // Fetch scoreboard first
      const scoreboardData = await fetchScoreboard();
      setScoreboard(scoreboardData);

      // Calculate team 1 score
      if (team1Roster) {
        const team1Data = await calculateTeamScore(team1Roster);
        setTeam1Score(team1Data);
      }

      // Calculate team 2 score
      if (team2Roster) {
        const team2Data = await calculateTeamScore(team2Roster);
        setTeam2Score(team2Data);
      }
    };

    loadScores();
  }, [team1Roster, team2Roster, refreshKey]);

  return { team1Score, team2Score, scoreboard };
}

// Helper function to calculate score for a single team
async function calculateTeamScore(roster: Roster): Promise<RosterScore> {
  const positions: PositionScore[] = [];
  let totalPoints = 0;

  // Fetch all player data in parallel
  const positionEntries = Object.entries(roster) as [keyof Roster, string][];
  
  const results = await Promise.all(
    positionEntries.map(async ([position, playerId]) => {
      const isDST = position === 'DST';
      
      try {
        if (isDST) {
          const teamData = await fetchTeamStats(playerId);
          if (teamData) {
            const points = calculateDefensePointsFromStats(teamData.stats || {});
            return {
              playerId,
              position,
              points,
              playerName: teamData.team?.displayName || `Team ${playerId}`,
              teamAbbr: teamData.team?.abbreviation || '',
              loading: false,
              error: Object.keys(teamData.stats || {}).length === 0 ? 'No data' : undefined,
            };
          }
        } else {
          const playerData = await fetchPlayerStats(playerId);
          if (playerData) {
            const points = calculatePlayerPointsFromStats(playerData.stats || {});
            const hasData = Object.keys(playerData.stats || {}).length > 0;
            return {
              playerId,
              position,
              points,
              playerName: playerData.player?.displayName || `Player ${playerId}`,
              teamAbbr: playerData.player?.team?.abbreviation || '',
              loading: false,
              error: !hasData ? 'No data' : undefined,
            };
          }
        }
      } catch (error) {
        return {
          playerId,
          position,
          points: 0,
          playerName: isDST ? `Team ${playerId}` : `Player ${playerId}`,
          loading: false,
          error: 'Failed to load',
        };
      }
      
      return {
        playerId,
        position,
        points: 0,
        playerName: isDST ? `Team ${playerId}` : `Player ${playerId}`,
        loading: false,
        error: 'No data',
      };
    })
  );

  results.forEach(result => {
    positions.push(result);
    totalPoints += result.points;
  });

  return {
    positions,
    totalPoints: Math.round(totalPoints * 100) / 100,
    loading: false,
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

