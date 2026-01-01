'use client';

import { Box, Card, CardContent, Typography, Divider } from '@mui/material';

interface BracketTeam {
  id: string;
  name: string;
  score?: number;
}

interface BracketMatchup {
  team1?: BracketTeam;
  team2?: BracketTeam;
  winner?: string;
}

interface PlayoffBracketProps {
  wildCard: BracketMatchup[];  // Week 1 - 4 matchups
  divisional: BracketMatchup[]; // Week 2 - 2 matchups
  conference: BracketMatchup[]; // Week 3 - 2 matchups
  superBowl?: BracketMatchup;   // Week 4 - 1 matchup
}

export default function PlayoffBracket({
  wildCard,
  divisional,
  conference,
  superBowl,
}: PlayoffBracketProps) {
  return (
    <Card sx={{ mb: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Playoff Bracket
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
            mt: 3,
          }}
        >
          {/* Wild Card Round */}
          <Box>
            <Typography variant="h6" gutterBottom textAlign="center">
              Wild Card
            </Typography>
            {wildCard.map((matchup, idx) => (
              <BracketMatchupCard key={idx} matchup={matchup} />
            ))}
          </Box>

          {/* Divisional Round */}
          <Box>
            <Typography variant="h6" gutterBottom textAlign="center">
              Divisional
            </Typography>
            {divisional.length > 0 ? (
              divisional.map((matchup, idx) => (
                <BracketMatchupCard key={idx} matchup={matchup} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                TBD
              </Typography>
            )}
          </Box>

          {/* Conference Championships */}
          <Box>
            <Typography variant="h6" gutterBottom textAlign="center">
              Conference
            </Typography>
            {conference.length > 0 ? (
              conference.map((matchup, idx) => (
                <BracketMatchupCard key={idx} matchup={matchup} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                TBD
              </Typography>
            )}
          </Box>

          {/* Super Bowl */}
          <Box>
            <Typography variant="h6" gutterBottom textAlign="center">
              Super Bowl
            </Typography>
            {superBowl ? (
              <BracketMatchupCard matchup={superBowl} isFinal />
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                TBD
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function BracketMatchupCard({
  matchup,
  isFinal = false,
}: {
  matchup: BracketMatchup;
  isFinal?: boolean;
}) {
  return (
    <Card variant="outlined" sx={{ mb: 2, bgcolor: isFinal ? 'primary.light' : 'background.paper' }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: matchup.winner === matchup.team1?.id ? 'bold' : 'normal',
              textDecoration: matchup.winner && matchup.winner !== matchup.team1?.id ? 'line-through' : 'none',
            }}
          >
            {matchup.team1?.name || 'TBD'}
          </Typography>
          {matchup.team1?.score !== undefined && (
            <Typography variant="body2" fontWeight="bold">
              {matchup.team1.score.toFixed(2)}
            </Typography>
          )}
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: matchup.winner === matchup.team2?.id ? 'bold' : 'normal',
              textDecoration: matchup.winner && matchup.winner !== matchup.team2?.id ? 'line-through' : 'none',
            }}
          >
            {matchup.team2?.name || 'TBD'}
          </Typography>
          {matchup.team2?.score !== undefined && (
            <Typography variant="body2" fontWeight="bold">
              {matchup.team2.score.toFixed(2)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

