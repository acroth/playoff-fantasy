# NFL Playoff Fantasy - Implementation Complete

## Overview
The playoff fantasy football tracking system has been successfully implemented with all planned features.

## What's Been Built

### 1. Data Structure
- **Types** (`src/types/`):
  - `fantasy.types.ts` - Fantasy team, roster, and matchup types
  - `player.types.ts` - ESPN API response types for players
  - `scoring.types.ts` - Scoring configuration types

- **Configuration** (`src/data/`):
  - `scoring.ts` - Custom scoring rules (Full PPR, 4pt passing TD, etc.)
  - `rosters.ts` - Weekly roster data (Week 1 has 8 placeholder teams)

### 2. API Routes (`src/app/api/`)
- `/api/scoreboard` - Fetches live NFL playoff scoreboard from ESPN
- `/api/player/[playerId]` - Fetches individual player statistics
- `/api/team/[teamId]/stats` - Fetches team defense/special teams stats

All routes implement caching (60 seconds for live games, 5 minutes for completed).

### 3. Utilities (`src/utils/`)
- `espn.ts` - Helper functions for ESPN API calls
- `scoring.ts` - Fantasy point calculation engine
- `dateTime.ts` - Game status checking and refresh logic
- `playoff.ts` - Bracket generation and winner determination

### 4. Custom Hooks (`src/hooks/`)
- `usePlayerStats.ts` - Fetches and caches player statistics
- `useMatchupScores.ts` - Calculates live scores for matchups
- `useAutoRefresh.ts` - Auto-refreshes every 15 minutes during live games

### 5. UI Components (`src/components/`)
- `WeekSelector.tsx` - Navigate between playoff weeks
- `RosterTable.tsx` - Display position-by-position roster breakdown
- `MatchupCard.tsx` - Show head-to-head matchup with live scores
- `PlayoffBracket.tsx` - Visual bracket showing progression through playoffs

### 6. Main Page (`src/app/page.tsx`)
- Displays all matchups for selected week
- Auto-refreshes during live games (every 15 minutes)
- Toggle between matchup view and bracket view
- Manual refresh button

## How to Configure Teams

### Step 1: Find ESPN Player IDs

1. Go to ESPN.com and search for a player
2. Click on their profile
3. Look at the URL - the ID is the number at the end
   - Example: `https://www.espn.com/nfl/player/_/id/4361741/` → ID is `4361741`

### Step 2: Update Rosters

Edit `src/data/rosters.ts`:

```typescript
{
  id: 'team1',
  name: 'Team 1',  // Change to actual team name
  roster: {
    QB: '3116407',   // Replace with actual ESPN player ID
    RB1: '4361370',  // Replace with actual ESPN player ID
    RB2: '4361741',  // etc.
    WR1: '4046359',
    WR2: '3122840',
    TE: '3116406',
    FLEX: '4361281',  // Can be RB/WR/TE
    DST: '22',        // Team ID (e.g., '22' for Patriots)
    K: '3116165',
  },
}
```

### Step 3: Configure Subsequent Weeks

After Week 1 completes:
1. Determine winners based on scores
2. Update Week 2 teams array with winners
3. Create matchups for Week 2

Example:
```typescript
{
  week: 2,
  teams: [
    // Copy winning teams from Week 1
    { id: 'team1', name: 'Team 1', roster: { /* same roster */ } },
    { id: 'team3', name: 'Team 3', roster: { /* same roster */ } },
    // ... other winners
  ],
  matchups: [
    { team1Id: 'team1', team2Id: 'team3' },  // Random pairings
    { team1Id: 'team5', team2Id: 'team7' },
  ],
}
```

## Scoring Rules

Current configuration (can be modified in `src/data/scoring.ts`):

**Passing:**
- 0.04 points per yard (1 point per 25 yards)
- 4 points per TD
- -2 points per interception

**Rushing:**
- 0.1 points per yard (1 point per 10 yards)
- 6 points per TD

**Receiving:**
- 0.1 points per yard
- 6 points per TD
- 1 point per reception (Full PPR)

**Kicking:**
- 3 points for FG 0-39 yards
- 4 points for FG 40-49 yards
- 5 points for FG 50+ yards
- 1 point per XP

**Defense/ST:**
- 1 point per sack
- 2 points per INT/fumble recovery
- 2 points per safety
- 6 points per TD
- Points based on points allowed (0 PA = 10 pts, scaling down)

**Misc:**
- -2 points per fumble lost
- 2 points per 2-pt conversion

## Features

✅ Live score tracking from ESPN API
✅ Position-by-position breakdown
✅ Auto-refresh every 15 minutes during live games
✅ Manual refresh button
✅ Week selector (Wild Card → Divisional → Conference → Super Bowl)
✅ Bracket view showing playoff progression
✅ Winner determination
✅ Responsive design (mobile-friendly)
✅ Loading states and error handling
✅ Custom scoring rules

## Running the Application

```bash
npm run dev
```

Then open http://localhost:3000

## Next Steps

1. **Add Real Player Data**: Replace placeholder player IDs in `src/data/rosters.ts` with actual ESPN player IDs from your draft
2. **Test Live Scoring**: During playoff games, the app will automatically fetch and update scores
3. **Update Weekly**: After each playoff round, update the next week's teams and matchups based on winners
4. **Customize Scoring**: Modify `src/data/scoring.ts` if you want different point values

## Notes

- ESPN API is unofficial and may change without notice
- Caching helps reduce API calls (60 seconds during live games)
- Auto-refresh only activates when games are live
- The app starts with Week 1 (Wild Card) by default
- All 8 teams must be configured before meaningful data displays
- DST uses team IDs (different from player IDs)

## Troubleshooting

**Players showing 0 points:**
- Verify player IDs are correct
- Check that games have started
- Try manual refresh button

**API errors:**
- ESPN API may be temporarily down
- Check browser console for detailed errors
- Try again after a few minutes

**No live updates:**
- Auto-refresh only works during live games
- Use manual refresh button to update immediately
- Check that scoreboard is detecting live games

