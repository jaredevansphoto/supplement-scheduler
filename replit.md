# Supplement Stack Tracker

## Overview
A Next.js web application for tracking daily supplement intake. Users can view their supplements with detailed ingredient information (including RDA/UL values), manage schedules organized by time of day, and log consumption.

## Project Structure
```
app/                    # Next.js App Router pages
├── globals.css         # Global styles with Tailwind CSS
├── layout.tsx          # Root layout component
├── page.tsx            # Home page (redirects to /today or /auth/signin)
├── auth/signin/        # Sign-in page
├── stacks/             # Supplement catalog page
├── today/              # Today's supplement schedule page
├── api/                # API routes
│   ├── auth/[...nextauth]/ # NextAuth authentication
│   ├── supplements/    # Supplements CRUD
│   ├── schedule/       # User schedule endpoints
│   └── intake/         # Intake logging endpoints
components/             # Shared React components
├── TopNav.tsx          # Navigation with auth state
lib/                    # Utility functions
├── prisma.ts           # Prisma client singleton
├── auth.ts             # NextAuth configuration
prisma/                 # Prisma ORM files
├── schema.prisma       # Database schema (8 models)
├── seed.ts             # Seed script with 15 supplements, 36 ingredients
├── dev.db              # SQLite database file
server/                 # Custom Next.js server
└── index.ts            # Server entry point
```

## Technology Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma 7 with SQLite (libSQL adapter)
- **Authentication**: NextAuth.js with Credentials provider
- **UI Components**: Radix UI primitives

## Database Schema
The Prisma schema includes the following models:
- `User` - User accounts (sign in with name/email)
- `Account` - OAuth/NextAuth account links
- `Session` - User sessions
- `Ingredient` - Master ingredients with RDA/UL values
- `Supplement` - Supplement products
- `SupplementIngredient` - Links supplements to ingredients with dosage
- `UserSchedule` - User's daily supplement schedule
- `Intake` - Daily intake logs (taken/skipped status)

## Environment Variables
- `AUTH_SECRET` - Required for NextAuth session encryption

## Development
The app runs on port 5000 using a custom server in `server/index.ts`.

```bash
npm run dev           # Start development server
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema changes to database
npx tsx prisma/seed.ts # Seed database with sample data
```

## Features
- Multi-user authentication (sign in with name/email)
- View supplements with ingredient details (RDA/UL tracking)
- Daily schedule organized by time of day
- Log intake status: taken or skipped
- Sign out functionality

## Planned Enhancements
- RDA/UL tracking with warnings when approaching limits
- Cycling rules enforcement (e.g., 5 days on, 2 days off)
- Intake aggregation and analytics
- Supplement management (add/edit/delete)

## Recent Changes
- 2026-01-04: Migrated from Supabase to Prisma with SQLite
- 2026-01-04: Implemented NextAuth authentication with credentials provider
- 2026-01-04: Created seed script with 15 supplements and 36 ingredients with RDA/UL data
- 2026-01-04: Rebuilt Today and Stacks pages using Prisma API routes
- 2026-01-04: Removed legacy Supabase code, dbAccess module, and unused pages

## Default User
For testing: Sign in with any name and email (e.g., "Jared" / "default@example.com")
