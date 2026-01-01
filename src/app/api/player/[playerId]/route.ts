import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{
    playerId: string;
  }>;
}

// Fetch individual player stats from ESPN API
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { playerId } = await params;
    
    // Fetch player data from ESPN
    const playerResponse = await fetch(
      `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes/${playerId}`,
      {
        next: { revalidate: 300 }  // Cache for 5 minutes
      }
    );

    if (!playerResponse.ok) {
      throw new Error(`ESPN API error: ${playerResponse.status}`);
    }

    const playerData = await playerResponse.json();

    // Try to fetch player statistics if available
    let stats = {};
    try {
      if (playerData.statistics) {
        const statsResponse = await fetch(playerData.statistics.$ref, {
          next: { revalidate: 60 }  // Stats update more frequently
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          
          // Parse stats from ESPN format
          if (statsData.splits?.categories) {
            stats = parseESPNStats(statsData.splits.categories);
          }
        }
      }
    } catch (statsError) {
      console.warn(`Could not fetch stats for player ${playerId}:`, statsError);
    }

    return NextResponse.json({
      player: playerData,
      stats: stats,
    });
  } catch (error) {
    console.error('Error fetching player data:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch player data' },
      { status: 500 }
    );
  }
}

// Helper function to parse ESPN stats format
function parseESPNStats(categories: any[]): Record<string, number> {
  const parsedStats: Record<string, number> = {};
  
  categories.forEach(category => {
    if (category.stats) {
      category.stats.forEach((stat: any) => {
        if (stat.name && stat.value !== undefined) {
          // Convert stat names to camelCase
          const statName = stat.name.replace(/\s+/g, '');
          parsedStats[statName] = parseFloat(stat.value) || 0;
        }
      });
    }
  });
  
  return parsedStats;
}

