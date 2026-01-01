'use client';

import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

interface WeekSelectorProps {
  currentWeek: number;
  maxWeek: number;
  onChange: (week: number) => void;
}

const weekLabels: { [key: number]: string } = {
  1: 'Wild Card',
  2: 'Divisional',
  3: 'Conference',
  4: 'Super Bowl',
};

export default function WeekSelector({ currentWeek, maxWeek, onChange }: WeekSelectorProps) {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newWeek: number | null) => {
    if (newWeek !== null) {
      onChange(newWeek);
    }
  };

  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        NFL Playoff Fantasy
      </Typography>
      <ToggleButtonGroup
        value={currentWeek}
        exclusive
        onChange={handleChange}
        aria-label="playoff week"
        sx={{ mt: 2 }}
      >
        {[1, 2, 3, 4].map((week) => (
          <ToggleButton
            key={week}
            value={week}
            disabled={week > maxWeek}
            sx={{ px: 3 }}
          >
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Week {week}
              </Typography>
              <Typography variant="caption" display="block">
                {weekLabels[week]}
              </Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}

