'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPlayerStats, fetchTeamStats } from '@/utils/espn';

interface PlayerData {
  player: any;
  stats: any;
}

// Hook to fetch player statistics using TanStack Query
export function usePlayerStats(playerId: string | null) {
  return useQuery<PlayerData | null>({
    queryKey: ['player', playerId],
    queryFn: async () => {
      if (!playerId) return null;
      return await fetchPlayerStats(playerId);
    },
    enabled: !!playerId, // Only fetch if playerId exists
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
  });
}

// Hook to fetch team defense statistics using TanStack Query
export function useTeamStats(teamId: string | null) {
  return useQuery<any>({
    queryKey: ['team', teamId],
    queryFn: async () => {
      if (!teamId) return null;
      return await fetchTeamStats(teamId);
    },
    enabled: !!teamId,
    staleTime: 60 * 1000,
  });
}
