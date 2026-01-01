'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Skeleton,
  Chip,
} from '@mui/material';

interface PositionRow {
  position: string;
  playerId: string;
  playerName?: string;
  teamAbbr?: string;
  points: number;
  gameStatus?: string;
  loading: boolean;
  error?: string;
}

interface RosterTableProps {
  teamName: string;
  positions: PositionRow[];
  totalPoints: number;
  loading?: boolean;
}

export default function RosterTable({
  teamName,
  positions,
  totalPoints,
  loading = false,
}: RosterTableProps) {
  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={4}>
              <Typography variant="h6" component="div">
                {teamName}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h6" component="div" fontWeight="bold">
                {loading ? <Skeleton width={50} /> : totalPoints.toFixed(2)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pos</TableCell>
            <TableCell>Player</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map((pos) => (
            <TableRow key={pos.position}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {pos.position}
                </Typography>
              </TableCell>
              <TableCell>
                {pos.loading ? (
                  <Skeleton width={120} />
                ) : (
                  <Typography 
                    variant="body2"
                    color={pos.error ? 'error' : 'text.primary'}
                  >
                    {pos.playerName || pos.playerId}
                    {pos.error && (
                      <Typography component="span" variant="caption" color="error" sx={{ ml: 1 }}>
                        ({pos.error})
                      </Typography>
                    )}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {pos.loading ? (
                  <Skeleton width={40} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {pos.teamAbbr || '-'}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {pos.loading ? (
                  <Skeleton width={60} />
                ) : pos.gameStatus ? (
                  <Chip label={pos.gameStatus} size="small" />
                ) : (
                  <Chip label="Scheduled" size="small" variant="outlined" />
                )}
              </TableCell>
              <TableCell align="right">
                {pos.loading ? (
                  <Skeleton width={40} />
                ) : pos.error ? (
                  <Typography variant="body2" color="error">
                    -
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={pos.points > 0 ? 'success.main' : 'text.primary'}
                  >
                    {pos.points.toFixed(2)}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

