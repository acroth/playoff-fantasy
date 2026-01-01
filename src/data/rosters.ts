import { WeekData } from '@/types/fantasy.types';

// Placeholder roster data for playoff fantasy
// Replace player IDs with actual ESPN player IDs when available
// ESPN player IDs can be found in the URL when viewing a player on ESPN.com

export const weeklyRosters: WeekData[] = [
  // Wild Card Round - Week 1
  {
    week: 1,
    teams: [
      {
        id: 'team1',
        name: 'Team 1',
        roster: {
          QB: '3116407',      // Placeholder - replace with actual ESPN player ID
          RB1: '4361370',     // Placeholder
          RB2: '4361741',     // Placeholder
          WR1: '4046359',     // Placeholder
          WR2: '3122840',     // Placeholder
          TE: '3116406',      // Placeholder
          FLEX: '4361281',    // Placeholder (can be RB/WR/TE)
          DST: '22',          // Team ID for DST (e.g., '22' for Patriots)
          K: '3116165',       // Placeholder
        },
      },
      {
        id: 'team2',
        name: 'Team 2',
        roster: {
          QB: '3139477',
          RB1: '4372519',
          RB2: '4035538',
          WR1: '4361579',
          WR2: '4241457',
          TE: '3121427',
          FLEX: '4035687',
          DST: '16',          // Team ID for DST
          K: '2969939',
        },
      },
      {
        id: 'team3',
        name: 'Team 3',
        roster: {
          QB: '4361741',
          RB1: '3929630',
          RB2: '4360438',
          WR1: '3915511',
          WR2: '4239996',
          TE: '4047365',
          FLEX: '4426347',
          DST: '4',           // Team ID for DST
          K: '3046779',
        },
      },
      {
        id: 'team4',
        name: 'Team 4',
        roster: {
          QB: '3052587',
          RB1: '4241389',
          RB2: '4035538',
          WR1: '3128720',
          WR2: '3116593',
          TE: '3040021',
          FLEX: '4426515',
          DST: '27',          // Team ID for DST
          K: '2576434',
        },
      },
      {
        id: 'team5',
        name: 'Team 5',
        roster: {
          QB: '4040715',
          RB1: '3117251',
          RB2: '4361741',
          WR1: '4035687',
          WR2: '3116406',
          TE: '3116389',
          FLEX: '4361579',
          DST: '11',          // Team ID for DST
          K: '3139477',
        },
      },
      {
        id: 'team6',
        name: 'Team 6',
        roster: {
          QB: '3918298',
          RB1: '4040715',
          RB2: '4241389',
          WR1: '4241457',
          WR2: '3929630',
          TE: '3121427',
          FLEX: '4372519',
          DST: '3',           // Team ID for DST
          K: '2969939',
        },
      },
      {
        id: 'team7',
        name: 'Team 7',
        roster: {
          QB: '3139477',
          RB1: '4361370',
          RB2: '4035538',
          WR1: '3116593',
          WR2: '4239996',
          TE: '4047365',
          FLEX: '4360438',
          DST: '12',          // Team ID for DST
          K: '3046779',
        },
      },
      {
        id: 'team8',
        name: 'Team 8',
        roster: {
          QB: '3052587',
          RB1: '3117251',
          RB2: '4241389',
          WR1: '4046359',
          WR2: '3128720',
          TE: '3040021',
          FLEX: '3915511',
          DST: '29',          // Team ID for DST
          K: '2576434',
        },
      },
    ],
    matchups: [
      { team1Id: 'team1', team2Id: 'team2' },
      { team1Id: 'team3', team2Id: 'team4' },
      { team1Id: 'team5', team2Id: 'team6' },
      { team1Id: 'team7', team2Id: 'team8' },
    ],
  },
  
  // Divisional Round - Week 2
  // These will be populated based on Week 1 winners
  {
    week: 2,
    teams: [],
    matchups: [],
  },
  
  // Conference Championships - Week 3
  {
    week: 3,
    teams: [],
    matchups: [],
  },
  
  // Super Bowl - Week 4
  {
    week: 4,
    teams: [],
    matchups: [],
  },
];

// Helper function to get data for a specific week
export function getWeekData(week: number): WeekData | undefined {
  return weeklyRosters.find(w => w.week === week);
}

// Helper function to get current playoff week (defaults to week 1)
export function getCurrentWeek(): number {
  // This could be enhanced to automatically determine the current week
  // based on the current date and NFL playoff schedule
  return 1;
}

