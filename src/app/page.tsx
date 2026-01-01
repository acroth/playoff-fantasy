'use client';

import { useState, useEffect } from 'react';
import { Container, Box, Button, Alert, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import WeekSelector from '@/components/WeekSelector';
import MatchupCard from '@/components/MatchupCard';
import PlayoffBracket from '@/components/PlayoffBracket';
import { weeklyRosters, getWeekData } from '@/data/rosters';
import { useMatchupScores } from '@/hooks/useMatchupScores';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { fetchScoreboard } from '@/utils/espn';
import { shouldAutoRefresh } from '@/utils/dateTime';

export default function Home() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [hasLiveGames, setHasLiveGames] = useState(false);
  const [showBracket, setShowBracket] = useState(false);
  
  // Auto-refresh during live games (every 15 minutes)
  const { refreshKey, lastRefresh, manualRefresh } = useAutoRefresh(hasLiveGames, 15 * 60 * 1000);

  // Check for live games
  useEffect(() => {
    const checkLiveGames = async () => {
      const scoreboard = await fetchScoreboard();
      const isLive = shouldAutoRefresh(scoreboard);
      setHasLiveGames(isLive);
    };

    checkLiveGames();
    // Check every minute if games have started
    const interval = setInterval(checkLiveGames, 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const currentWeekData = getWeekData(selectedWeek);
  const maxWeek = weeklyRosters.findIndex(w => w.teams.length === 0);
  const displayMaxWeek = maxWeek === -1 ? 4 : maxWeek;

  if (!currentWeekData) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="info">No data available for this week.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <WeekSelector
        currentWeek={selectedWeek}
        maxWeek={displayMaxWeek}
        onChange={setSelectedWeek}
      />

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button
            variant="outlined"
            onClick={() => setShowBracket(!showBracket)}
            sx={{ mr: 2 }}
          >
            {showBracket ? 'Show Matchups' : 'Show Bracket'}
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={manualRefresh}
          >
            Refresh
          </Button>
        </Box>
        {hasLiveGames && (
          <Alert severity="success" sx={{ py: 0 }}>
            Live Games - Auto-refreshing every 15 minutes
          </Alert>
        )}
      </Box>

      {showBracket ? (
        <BracketView weeklyRosters={weeklyRosters} />
      ) : (
        <MatchupsView
          weekData={currentWeekData}
          refreshKey={refreshKey}
        />
      )}
    </Container>
  );
}

function MatchupsView({ weekData, refreshKey }: { weekData: any; refreshKey: number }) {
  return (
    <Box>
      {weekData.matchups.map((matchup: any, index: number) => {
        const team1 = weekData.teams.find((t: any) => t.id === matchup.team1Id);
        const team2 = weekData.teams.find((t: any) => t.id === matchup.team2Id);

        return (
          <MatchupContainer
            key={`${matchup.team1Id}-${matchup.team2Id}-${index}`}
            team1={team1}
            team2={team2}
            matchupNumber={index + 1}
            refreshKey={refreshKey}
          />
        );
      })}
    </Box>
  );
}

function MatchupContainer({
  team1,
  team2,
  matchupNumber,
  refreshKey,
}: {
  team1: any;
  team2: any;
  matchupNumber: number;
  refreshKey: number;
}) {
  const { team1Score, team2Score } = useMatchupScores(
    team1?.roster || null,
    team2?.roster || null,
    refreshKey
  );

  return (
    <MatchupCard
      matchupNumber={matchupNumber}
      team1={{
        teamName: team1?.name || 'Team 1',
        positions: team1Score.positions,
        totalPoints: team1Score.totalPoints,
        loading: team1Score.loading,
      }}
      team2={{
        teamName: team2?.name || 'Team 2',
        positions: team2Score.positions,
        totalPoints: team2Score.totalPoints,
        loading: team2Score.loading,
      }}
    />
  );
}

function BracketView({ weeklyRosters }: { weeklyRosters: any[] }) {
  const [bracketData, setBracketData] = useState<any>({
    wildCard: [],
    divisional: [],
    conference: [],
    superBowl: undefined,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Build bracket from weekly rosters
    const wildCard = weeklyRosters[0]?.matchups.map((m: any) => {
      const team1 = weeklyRosters[0].teams.find((t: any) => t.id === m.team1Id);
      const team2 = weeklyRosters[0].teams.find((t: any) => t.id === m.team2Id);
      return {
        team1: team1 ? { id: team1.id, name: team1.name } : undefined,
        team2: team2 ? { id: team2.id, name: team2.name } : undefined,
      };
    }) || [];

    const divisional = weeklyRosters[1]?.matchups.map((m: any) => {
      const team1 = weeklyRosters[1].teams.find((t: any) => t.id === m.team1Id);
      const team2 = weeklyRosters[1].teams.find((t: any) => t.id === m.team2Id);
      return {
        team1: team1 ? { id: team1.id, name: team1.name } : undefined,
        team2: team2 ? { id: team2.id, name: team2.name } : undefined,
      };
    }) || [];

    const conference = weeklyRosters[2]?.matchups.map((m: any) => {
      const team1 = weeklyRosters[2].teams.find((t: any) => t.id === m.team1Id);
      const team2 = weeklyRosters[2].teams.find((t: any) => t.id === m.team2Id);
      return {
        team1: team1 ? { id: team1.id, name: team1.name } : undefined,
        team2: team2 ? { id: team2.id, name: team2.name } : undefined,
      };
    }) || [];

    const superBowlMatchup = weeklyRosters[3]?.matchups[0];
    const superBowl = superBowlMatchup ? {
      team1: weeklyRosters[3].teams.find((t: any) => t.id === superBowlMatchup.team1Id),
      team2: weeklyRosters[3].teams.find((t: any) => t.id === superBowlMatchup.team2Id),
    } : undefined;

    setBracketData({ wildCard, divisional, conference, superBowl });
    setLoading(false);
  }, [weeklyRosters]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PlayoffBracket
      wildCard={bracketData.wildCard}
      divisional={bracketData.divisional}
      conference={bracketData.conference}
      superBowl={bracketData.superBowl}
    />
  );
}
