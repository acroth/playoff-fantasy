import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{
    teamId: string;
  }>;
}

// Fetch team defense/special teams stats from ESPN API
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { teamId } = await params;
    
    // Fetch team data from ESPN
    const teamResponse = await fetch(
      `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams/${teamId}`,
      {
        next: { revalidate: 300 }  // Cache for 5 minutes
      }
    );

    if (!teamResponse.ok) {
      throw new Error(`ESPN API error: ${teamResponse.status}`);
    }

    const teamData = await teamResponse.json();

    // Try to fetch team statistics if available
    let stats = {};
    try {
      if (teamData.statistics) {
        const statsResponse = await fetch(teamData.statistics.$ref, {
          next: { revalidate: 60 }  // Stats update more frequently during games
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          
          // Parse defensive stats from ESPN format
          if (statsData.splits?.categories) {
            stats = parseDefensiveStats(statsData.splits.categories);
          }
        }
      }
    } catch (statsError) {
      console.warn(`Could not fetch stats for team ${teamId}:`, statsError);
    }

    return NextResponse.json({
      team: teamData,
      stats: stats,
    });
  } catch (error) {
    console.error('Error fetching team data:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch team data' },
      { status: 500 }
    );
  }
}

// Helper function to parse ESPN defensive stats format
function parseDefensiveStats(categories: any[]): Record<string, number> {
  const parsedStats: Record<string, number> = {};
  
  categories.forEach(category => {
    // Focus on defensive and special teams categories
    if (category.name === 'defensive' || category.name === 'specialTeams') {
      if (category.stats) {
        category.stats.forEach((stat: any) => {
          if (stat.name && stat.value !== undefined) {
            // Convert stat names to camelCase
            const statName = stat.name.replace(/\s+/g, '');
            parsedStats[statName] = parseFloat(stat.value) || 0;
          }
        });
      }
    }
  });
  
  return parsedStats;
}

