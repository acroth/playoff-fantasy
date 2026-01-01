import { NextResponse } from 'next/server';
import { ESPNScoreboard } from '@/types/player.types';

export const dynamic = 'force-dynamic';

// Fetch current NFL scoreboard from ESPN API
export async function GET() {
  try {
    // Fetch playoff games (seasontype=3 for postseason)
    const response = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=3',
      {
        next: { 
          revalidate: 60  // Cache for 60 seconds during live games
        }
      }
    );

    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }

    const data: ESPNScoreboard = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch scoreboard data',
        events: []
      },
      { status: 500 }
    );
  }
}

