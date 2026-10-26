# AI Powered Code Reviewer

An AI-assisted code review platform built with Next.js, Prisma, Better Auth, Pinecone, and GitHub integration.

## Overview

This project appears to be a full-stack application for reviewing code, managing pull requests, authenticating users, and syncing repositories.

Key capabilities likely include:

- OAuth authentication via Better Auth
- GitHub repository and pull request integration
- AI-enhanced code review workflows
- Billing and subscription management
- Inngest event handling
- Pinecone-powered search or vector embeddings

## Tech stack

- Next.js 16.2.9
- React 19.2.4
- TypeScript
- Tailwind CSS v4
- Prisma 7.8.0
- PostgreSQL (`pg`)
- Better Auth
- Pinecone
- Inngest
- Radix UI / shadcn/ui
- TanStack Query
- Razorpay

## Project structure

- `app/` - Next.js App Router routes and layouts
- `components/` - shared UI components and providers
- `features/` - feature-based modules for AI, auth, billing, GitHub, repo sync, reviews, settings, and more
- `lib/` - shared utility code for auth, database, billing, and helpers
- `prisma/` - Prisma schema and migrations
- `public/` - static assets

## Requirements

- Node.js (recommended latest stable version)
- PostgreSQL database
- GitHub OAuth credentials (if GitHub login or integration is used)
- Better Auth credentials
- Optional Pinecone API key and Razorpay credentials for additional features

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file from your environment variables.

3. Set required environment variables, for example:

```bash
DATABASE_URL="postgresql://user:password@host:port/dbname"
BETTER_AUTH_SECRET="your_better_auth_secret"
BETTER_AUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

4. Generate Prisma client and run migrations

```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

## Available scripts

- `npm run dev` - start the Next.js development server
- `npm run build` - generate Prisma client and build the app
- `npm run start` - run the production build
- `npm run lint` - run ESLint

## Prisma

This project uses Prisma as the ORM. The Prisma schema and migrations are stored in `prisma/`.

Run Prisma generate after changing the schema:

```bash
npx prisma generate
```

Apply schema changes:

```bash
npx prisma migrate dev
```

## Auth

The app uses Better Auth for authentication. Ensure the following variables are configured:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## Notes

- The project uses `@shadcn/react` components and `next-themes` for dark mode support.
- Inngest is included for event-driven workflows.
- Pinecone may be used for vector search / embeddings.
- Razorpay is included for payment or billing integrations.

## Further documentation

Refer to `DOCS.md` for project initialization notes and additional setup guidance.


## Live application
[AICODEREVIEW](https://aicodereview-ag.vercel.app)
