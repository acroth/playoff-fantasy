'use client';

import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SearchIcon from '@mui/icons-material/Search';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AppBar position="sticky" sx={{ mb: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SportsFootballIcon sx={{ display: 'flex', mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 4,
              display: 'flex',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/')}
          >
            Playoff Fantasy
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button
              onClick={() => router.push('/')}
              sx={{
                color: 'white',
                fontWeight: pathname === '/' ? 'bold' : 'normal',
                borderBottom: pathname === '/' ? '2px solid white' : 'none',
                borderRadius: 0,
              }}
            >
              Matchups
            </Button>
            <Button
              onClick={() => router.push('/players')}
              startIcon={<SearchIcon />}
              sx={{
                color: 'white',
                fontWeight: pathname === '/players' ? 'bold' : 'normal',
                borderBottom: pathname === '/players' ? '2px solid white' : 'none',
                borderRadius: 0,
              }}
            >
              Player Lookup
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

