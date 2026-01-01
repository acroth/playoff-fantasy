'use client';

import { Card, CardContent, Box, Typography, Divider, Chip } from '@mui/material';
import RosterTable from './RosterTable';

interface PositionScore {
  position: string;
  playerId: string;
  playerName?: string;
  teamAbbr?: string;
  points: number;
  gameStatus?: string;
  loading: boolean;
  error?: string;
}

interface TeamScore {
  teamName: string;
  positions: PositionScore[];
  totalPoints: number;
  loading: boolean;
}

interface MatchupCardProps {
  team1: TeamScore;
  team2: TeamScore;
  matchupNumber: number;
}

export default function MatchupCard({ team1, team2, matchupNumber }: MatchupCardProps) {
  const isComplete = !team1.loading && !team2.loading;
  const winner = isComplete
    ? team1.totalPoints > team2.totalPoints
      ? team1.teamName
      : team2.totalPoints > team1.totalPoints
      ? team2.teamName
      : null
    : null;

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div">
            Matchup {matchupNumber}
          </Typography>
          {winner && (
            <Chip
              label={`Winner: ${winner}`}
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          {/* Team 1 */}
          <Box>
            <RosterTable
              teamName={team1.teamName}
              positions={team1.positions}
              totalPoints={team1.totalPoints}
              loading={team1.loading}
            />
          </Box>

          {/* VS Divider */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100%',
            }}
          >
            <Divider orientation="vertical" sx={{ mx: 2 }}>
              <Chip label="VS" />
            </Divider>
          </Box>

          <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', my: 1 }}>
            <Chip label="VS" />
          </Box>

          {/* Team 2 */}
          <Box>
            <RosterTable
              teamName={team2.teamName}
              positions={team2.positions}
              totalPoints={team2.totalPoints}
              loading={team2.loading}
            />
          </Box>
        </Box>

        {/* Score Summary */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {team1.teamName}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {team1.loading ? '-' : team1.totalPoints.toFixed(2)}
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            -
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {team2.teamName}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {team2.loading ? '-' : team2.totalPoints.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

