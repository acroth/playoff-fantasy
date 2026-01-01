// Date/time utilities for game scheduling and refresh logic

export function isGameLive(gameStatus: any): boolean {
  if (!gameStatus?.type) return false;
  
  return (
    gameStatus.type.state === 'in' ||
    gameStatus.type.name === 'STATUS_IN_PROGRESS' ||
    !gameStatus.type.completed
  );
}

export function isGameCompleted(gameStatus: any): boolean {
  if (!gameStatus?.type) return false;
  
  return (
    gameStatus.type.completed === true ||
    gameStatus.type.state === 'post' ||
    gameStatus.type.name === 'STATUS_FINAL'
  );
}

export function isGameScheduled(gameStatus: any): boolean {
  if (!gameStatus?.type) return true;
  
  return (
    gameStatus.type.state === 'pre' ||
    gameStatus.type.name === 'STATUS_SCHEDULED'
  );
}

export function getGameStatusDisplay(gameStatus: any): string {
  if (!gameStatus?.type) return 'Scheduled';
  
  if (isGameCompleted(gameStatus)) {
    return 'Final';
  }
  
  if (isGameLive(gameStatus)) {
    const quarter = gameStatus.period || 1;
    const clock = gameStatus.displayClock || gameStatus.clock || '';
    return `Q${quarter} ${clock}`.trim();
  }
  
  return 'Scheduled';
}

// Determine if we should auto-refresh based on game states
export function shouldAutoRefresh(scoreboard: any): boolean {
  if (!scoreboard?.events) return false;
  
  // Check if any games are live
  return scoreboard.events.some((event: any) => isGameLive(event.status));
}

// Get refresh interval in milliseconds
// 15 minutes for live games, no auto-refresh otherwise
export function getRefreshInterval(hasLiveGames: boolean): number | null {
  if (hasLiveGames) {
    return 15 * 60 * 1000; // 15 minutes in milliseconds
  }
  return null; // No auto-refresh
}

// Format date for display
export function formatGameDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Get current NFL playoff week based on date
export function getCurrentPlayoffWeek(): number {
  // This is a simplified version - could be enhanced with actual NFL schedule
  const now = new Date();
  const playoffStart = new Date('2025-01-11'); // Wild Card weekend
  
  const daysSinceStart = Math.floor(
    (now.getTime() - playoffStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceStart < 0) return 1; // Before playoffs
  if (daysSinceStart < 7) return 1;  // Wild Card
  if (daysSinceStart < 14) return 2; // Divisional
  if (daysSinceStart < 21) return 3; // Conference Championships
  return 4; // Super Bowl
}

