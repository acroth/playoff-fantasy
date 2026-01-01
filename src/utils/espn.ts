// ESPN API helper functions

export async function fetchPlayerStats(playerId: string) {
  try {
    const response = await fetch(`/api/player/${playerId}`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch player ${playerId} (Status: ${response.status})`);
      // Return a placeholder with empty stats instead of throwing
      return {
        player: {
          id: playerId,
          displayName: `Player ${playerId}`,
        },
        stats: {},
      };
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching player ${playerId}:`, error);
    // Return placeholder on error
    return {
      player: {
        id: playerId,
        displayName: `Player ${playerId}`,
      },
      stats: {},
    };
  }
}

export async function fetchTeamStats(teamId: string) {
  try {
    const response = await fetch(`/api/team/${teamId}/stats`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch team ${teamId} (Status: ${response.status})`);
      // Return placeholder with empty stats instead of throwing
      return {
        team: {
          id: teamId,
          displayName: `Team ${teamId}`,
          abbreviation: `T${teamId}`,
        },
        stats: {},
      };
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching team ${teamId}:`, error);
    // Return placeholder on error
    return {
      team: {
        id: teamId,
        displayName: `Team ${teamId}`,
        abbreviation: `T${teamId}`,
      },
      stats: {},
    };
  }
}

export async function fetchScoreboard() {
  try {
    const response = await fetch('/api/scoreboard');
    
    if (!response.ok) {
      throw new Error('Failed to fetch scoreboard');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    return { events: [] };
  }
}

// Helper to find a player's current game status from scoreboard
export function getPlayerGameStatus(scoreboard: any, teamAbbreviation: string) {
  if (!scoreboard?.events) return null;
  
  for (const event of scoreboard.events) {
    if (event.competitions?.[0]?.competitors) {
      const competitors = event.competitions[0].competitors;
      const team = competitors.find(
        (c: any) => c.team?.abbreviation === teamAbbreviation
      );
      
      if (team) {
        return event.status;
      }
    }
  }
  
  return null;
}

// Check if any games are currently live
export function hasLiveGames(scoreboard: any): boolean {
  if (!scoreboard?.events) return false;
  
  return scoreboard.events.some((event: any) => 
    event.status?.type?.state === 'in' || 
    event.status?.type?.name === 'STATUS_IN_PROGRESS'
  );
}

// Get all team abbreviations with live games
export function getLiveGameTeams(scoreboard: any): string[] {
  if (!scoreboard?.events) return [];
  
  const liveTeams: string[] = [];
  
  scoreboard.events.forEach((event: any) => {
    if (event.status?.type?.state === 'in' || event.status?.type?.name === 'STATUS_IN_PROGRESS') {
      if (event.competitions?.[0]?.competitors) {
        event.competitions[0].competitors.forEach((competitor: any) => {
          if (competitor.team?.abbreviation) {
            liveTeams.push(competitor.team.abbreviation);
          }
        });
      }
    }
  });
  
  return liveTeams;
}

