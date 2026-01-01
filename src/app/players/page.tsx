'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface PlayerResult {
  id: string;
  displayName: string;
  shortName?: string;
  type?: string;
  jersey?: string;
  teamRelationships?: Array<{
    type: string;
    displayName: string;
    core: {
      id: string;
      abbreviation: string;
      displayName: string;
    };
  }>;
  leagueRelationships?: Array<{
    type: string;
  }>;
  headshot?: {
    href: string;
    alt: string;
  };
}

export default function PlayerLookupPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const searchPlayers = async () => {
    if (!query.trim()) {
      setError('Please enter a player name');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(
        `https://site.api.espn.com/apis/common/v3/search?query=${encodeURIComponent(query)}&region=us&lang=en&type=player&sport=football&league=nfl`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        setResults(data.items);
      } else {
        setError('No players found. Try a different search term.');
      }
    } catch (err) {
      setError('Failed to search players. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPlayers();
    }
  };

  const copyToClipboard = (playerId: string) => {
    navigator.clipboard.writeText(playerId);
    setCopiedId(playerId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Player Lookup
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Search for NFL players to find their ESPN player IDs for your fantasy rosters.
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search player name (e.g., Patrick Mahomes)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={searchPlayers}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Results ({results.length} found)
            </Typography>
            <List>
              {results.map((result, index) => {
                const playerId = result.id;
                const playerName = result.displayName;
                const teamInfo = result.teamRelationships?.[0]?.core;
                const team = teamInfo?.abbreviation || 'FA';
                const teamName = teamInfo?.displayName || 'Free Agent';
                const jersey = result.jersey || '';

                return (
                  <Box key={playerId + index}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <ListItemText
                          primary={
                            <Typography variant="h6" component="div">
                              {playerName}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                              {jersey && <Chip label={`#${jersey}`} size="small" color="primary" />}
                              <Chip label={team} size="small" variant="outlined" />
                              <Typography variant="body2" color="text.secondary">
                                {teamName}
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            ESPN ID
                          </Typography>
                          <Typography
                            variant="h6"
                            component="code"
                            sx={{
                              fontFamily: 'monospace',
                              bgcolor: 'action.hover',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            {playerId}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ContentCopyIcon />}
                          onClick={() => copyToClipboard(playerId)}
                          sx={{ minWidth: 100 }}
                        >
                          {copiedId === playerId ? 'Copied!' : 'Copy ID'}
                        </Button>
                      </Box>
                    </ListItem>
                  </Box>
                );
              })}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card sx={{ mt: 4, bgcolor: 'info.main', color: 'info.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            How to Use
          </Typography>
          <Typography variant="body2" paragraph>
            1. Search for a player by name
          </Typography>
          <Typography variant="body2" paragraph>
            2. Click "Copy ID" to copy their ESPN player ID
          </Typography>
          <Typography variant="body2">
            3. Paste the ID into your roster configuration in <code>src/data/rosters.ts</code>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

