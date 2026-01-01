'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute - data is considered fresh
        gcTime: 5 * 60 * 1000, // 5 minutes - garbage collection time (formerly cacheTime)
        refetchOnWindowFocus: true, // Refetch when user returns to the window
        retry: 1, // Retry failed requests once
        refetchOnReconnect: true, // Refetch when network reconnects
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

