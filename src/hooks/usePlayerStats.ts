'use client';

import { useState, useEffect } from 'react';
import { fetchPlayerStats, fetchTeamStats } from '@/utils/espn';

interface PlayerData {
  player: any;
  stats: any;
}

interface CachedData {
  [key: string]: {
    data: PlayerData | null;
    timestamp: number;
  };
}

const cache: CachedData = {};
const CACHE_DURATION = 60 * 1000; // 1 minute cache

// Hook to fetch player statistics
export function usePlayerStats(playerId: string | null, refreshKey: number = 0) {
  const [data, setData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) {
      setData(null);
      return;
    }

    const loadPlayerStats = async () => {
      // Check cache
      const cacheKey = `player-${playerId}`;
      const cached = cache[cacheKey];
      const now = Date.now();

      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        setData(cached.data);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetchPlayerStats(playerId);
        
        if (result) {
          setData(result);
          cache[cacheKey] = { data: result, timestamp: now };
        } else {
          setError('Failed to fetch player data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadPlayerStats();
  }, [playerId, refreshKey]);

  return { data, loading, error };
}

// Hook to fetch team defense statistics
export function useTeamStats(teamId: string | null, refreshKey: number = 0) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setData(null);
      return;
    }

    const loadTeamStats = async () => {
      // Check cache
      const cacheKey = `team-${teamId}`;
      const cached = cache[cacheKey];
      const now = Date.now();

      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        setData(cached.data);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetchTeamStats(teamId);
        
        if (result) {
          setData(result);
          cache[cacheKey] = { data: result, timestamp: now };
        } else {
          setError('Failed to fetch team data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadTeamStats();
  }, [teamId, refreshKey]);

  return { data, loading, error };
}

