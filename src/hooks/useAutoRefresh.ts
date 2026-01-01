import { useState, useEffect } from 'react';

// Hook for auto-refresh functionality during live games
export function useAutoRefresh(shouldRefresh: boolean, interval: number = 15 * 60 * 1000) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (!shouldRefresh) return;

    const timer = setInterval(() => {
      setRefreshKey(prev => prev + 1);
      setLastRefresh(new Date());
    }, interval);

    return () => clearInterval(timer);
  }, [shouldRefresh, interval]);

  const manualRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setLastRefresh(new Date());
  };

  return { refreshKey, lastRefresh, manualRefresh };
}

