# How to Add New Games to Database

## Problem
The new games (Word Guess, Number Guess) are registered in code but don't exist in your database yet. You need to seed them.

## Solution

### Option 1: Run the Seed Script (Recommended)

If you have a seed script set up, run it:

```bash
# Check if you have a seed command in package.json
pnpm seed
# or
npm run seed
# or
tsx src/app/dashboard/seed.ts
```

### Option 2: Manual Database Seeding

Run this in your database or create a one-time script:

```typescript
// Run this once to add the new games
import prisma from "@/lib/prisma";

async function addNewGames() {
  const games = [
    {
      name: "Word Guess",
      description: "Guess the hidden word letter by letter!",
      minPlayers: 2,
      maxPlayers: 6,
      category: "word",
      isActive: true,
    },
    {
      name: "Number Guess",
      description: "Guess the secret number between 1 and 100!",
      minPlayers: 2,
      maxPlayers: 8,
      category: "party",
      isActive: true,
    },
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { name: game.name },
      update: {},
      create: game,
    });
  }

  console.log("✅ Games added!");
}

addNewGames();
```

### Option 3: Use Prisma Studio

1. Open Prisma Studio: `pnpm db:studio`
2. Go to the `game` table
3. Add new records:
   - **Word Guess**: name="Word Guess", category="word", minPlayers=2, maxPlayers=6
   - **Number Guess**: name="Number Guess", category="party", minPlayers=2, maxPlayers=8

## Verification

After seeding, check that:
1. Games appear in the game selection dropdown
2. You can create a game session
3. The game component loads when you start the game

## Debugging

If games still don't show:
1. Check browser console for the debug logs I added
2. Verify game names match exactly between database and registry
3. Check that `isActive: true` in database
4. Refresh the page after seeding



