# Chapter 0 — Project Init (Next.js v16.2.9)

## Command
```bash
npx create-next-app@latest || npx create-next-app@16.2.9
```
- Project name: `./`
- Recommended Next.js defaults: `yes`

# Chapter 1 — UI Foundation: shadcn/ui, Dark Mode, TanStack Query

## Step 1 shadcn/ui
- shadcn -> build your own -> shuffle(for color) -> get code -> template: `Next.js` -> base UI : `Radix UI` -> Use pointer on buttons(enable) -> copy npm cmd and execute

```bash
npx shadcn@latest init --preset b7Br7G7Ci --base radix --template next --pointer
```

- shadcn all components: to select all components

```bash
npx shadcn@latest add
```

## Step 2 Dark Mode
- shadcn -> search(dark mode) -> select(Nextjs)

## 2.1
```bash
npm install next-themes
```

## 2.2 Create a theme provider
- components/providers/theme-provider.tsx (copy/paste code)

## 2.3 Wrap your root layout
- app/layout.tsx (edit/copy/paste code)

## 2.4 Add a mode toggle
- components/ui/mode-toggle.tsx (copy/paste code)
- app/page.tsx -> add <ModeToggle/> component

## Step 3 TanStack Query
## 3.1
- TanStack Query -> get started -> installation

```bash
npm i @tanstack/react-query
```

## 3.2 setup
- components\providers\query-provider.tsx (write code)(for QueryProvider)
- wrap the whole application using this (QueryProvider)
    - app/layout.tsx
    ```bash
    <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
    </body>
    ```

# Chapter 2 — Database with Prisma via neon
## 1
- neon.com -> new project -> write name -> create -> connect -> connection string: prisma -> .env -> show pass -> copy snippet -> paste in your .env

```bash
DATABASE_URL="postgresql://neondb_owner:**********************
```

## 2
- prisma -> get started -> Prisma ORM -> Postgres
    - Install required dependencies
    ```bash
    npm install prisma @types/pg --save-dev
    npm install @prisma/client @prisma/adapter-pg pg dotenv
    ```

## 3.1
```bash
npx prisma init
```

## 3.2
- lib/db.ts (copy/paste code)

## 3.3
```bash
npx prisma generate
```

## 3.4
- prisma/schema.prisma
```bash
model Test {
  id String @id @default(cuid())
  title String
}
```

## 3.5
```bash
npx prisma migrate dev
```

## 3.6
```bash
npx prisma generate
```

# Chapter 3 — Authentication with Better Auth
- better-auth.com -> get started -> installation
## 3.1
```bash
npm install better-auth
```
## 3.2 Set Environment Variables
- Secret Key -> Generate Secret -> .env (copy/paste)

```bash
BETTER_AUTH_SECRET=<YOUR_SECRET>
```

- Set Base URL -> .env (copy/paste)
```bash
BETTER_AUTH_URL=http://localhost:3000 # Base URL of your app
```

## 3.3 Create A Better Auth Instance
- lib/auth.ts (copy/paste)

## 3.4 Configure Database (via Prisma ORM)
- lib/auth.ts (edit/copy/paste according to ur usecase)

## 3.5 Create Database Tables
- Generate: This command generates an ORM schema
```bash
npx auth@latest generate
```
- √ The file ./prisma/schema.prisma already exists. Do you want to overwrite the schema to the file? ... yes

```bash
npx prisma generate
npx prisma migrate dev
```
- √ Enter a name for the new migration: ... auth

## 3.6 Authentication Methods
- lib/auth.ts -> add socialProviders github code
- in `.env`
```bash
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## 3.7 Mount Handler
- To handle API requests, you need to set up a route handler on your server.
- next-js-app-router -> /app/api/auth/[...all]/route.ts   (copy/paste)

## 3.8 Create Client Instance
- client-side library helps you interact with the auth server.
- react -> lib/auth-client.ts ->   (copy/paste)
```bash
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();
```

## 3.9 🎉 That's it!
- now u can add credential auth, google auth, github auth, microsoft auth, etc.

## 3.10 cookies setup
- search -> nextjs -> Server Action Cookies
- lib/auth.ts -> add these 2 lines to also setup cookies
```bash
import { nextCookies } from "better-auth/next-js";
plugins: [nextCookies()],
```

******************************************************************************************************
## 3.11 Github credentials setup (3.6)
- Github -> Settings -> Developer Settings -> OAuth Apps -> New OAuth App
  - Application name: `ai-powered-code-reviewer`
  - Homepage URL: `http://localhost:3000`

- Better-Auth -> Authentication -> Github
  `Get your GitHub credentials`
  - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

  - Register Application -> add both of them in `.env`
  ```bash
  GITHUB_CLIENT_ID=Ov2********************
  GITHUB_CLIENT_SECRET=4461*******************
  ```

  - Update Application

`Sign In with GitHub`
<!-- TODO -->

## 3.12 UI
- (write code in below files)
- app/(auth)/layout.tsx
- app/(auth)/sign-in/page.tsx
- features/auth/components/github-sign-in-form.tsx
- features/auth/actions/index.ts
******************************************************************************************************

## 3.a Auth Session helper, middleware(proxy) & logout with UI
- if unauthorized -> go to signin
- if authorized -> go to dashboard

- features/auth/utils/index.ts                          (write PAHTS)
- features/auth/actions/index.ts                        (add the callback fns for those PATHS)
  - requireUnAuth == auth is not req                    (logged in hai)
  - requireAuth == auth is req                          (logged in nhi hai)
- app/(auth)/sign-in/layout.tsx                         (check if ur is authenticated or not)

- app/(protected)   -> page.tsx  & layout.tsx           (create dashboard)

- proxy.ts                                              (for better redirection)
- features/auth/utils/auth-proxy.ts                     (to handle Auth Proxy)

- features/auth/components/user-menu.tsx                (user menu for logout)        (copy/paste)
- app/page.tsx                                          (show in page)

# Chapter 4 — Dashboard UI
## 4.1 Shell & sidebar (copy/paste)
- app/(protected)/dashboard/layout.tsx
- features/dashboard/components/dashboard-shell.tsx
- features/dashboard/components/dashboard-sidebar.tsx
- features/dashboard/lib/routes.ts
- features/dashboard/components/dashboard-nav.tsx
- features/dashboard/components/sidebar-user-button.tsx

# Chapter 5 — GitHub App: Installation & Repo Fetching
- Settings -> Developer Settings -> GitHub Apps -> Create GitHub App -> write:-

## 5.1 Create the GitHub App (Permissions, webhook URL, private key; env vars.)
- GitHub App name:- PR Reviewer Powered via AI
- Homepage URL : `https://unpreserved-elke-unrefractory.ngrok-free.dev/`  (ngrok tunning by following below 2 points)
  - `npm run dev` (on vscode 1st terminal)
  - (ngrok -> setup & installation -> Get a public URL for your app -> `ngrok http --url=unpreserved-elke-unrefractory.ngrok-free.dev 3000` (on vscode 2nd terminal))

- add in next.config.ts
```bash
const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['unpreserved-elke-unrefractory.ngrok-free.dev'],
};
```

- Callback URL: `https://unpreserved-elke-unrefractory.ngrok-free.dev/api/auth/callback/github`   (this will use github client id and secret insted of our OAuth setup)

- ✅ Expire user authorization tokens

- Post installation -> Setup URL (optional) -> `https://unpreserved-elke-unrefractory.ngrok-free.dev/api/github/callback`

- Webhook
  - ✅ Active
  - Webhook URL: `https://unpreserved-elke-unrefractory.ngrok-free.dev/api/github/webhook`
  - Secret: `7cd249ab57**************4cdecad123797c2c` (modify 1-2 char)
  - ✅ Enable SSL verification

- Permissions -> Repository permissions
  - Contents: Read-Only
  - Metadata: Read-Only
  - Pull requests: Read and write

- Subscribe to events ✅
  - Meta
  - Commit comment
  - Pull request
  - Pull request review
  - Pull request review comment
  - Star

- Where can this GitHub App be installed? :- ✅ Any account

- `Create Github APP`


- in `.env`
```bash
GITHUB_APP_ID=****814
GITHUB_APP_NAME=pr-reviewer-powered-via-ai
NEXT_PUBLIC_GITHUB_PUBLIC_LINK=https://github.com/apps/pr-reviewer-powered-via-ai (Public link)
GITHUB_CLIENT_ID=Iv**********
GITHUB_CLIENT_SECRET=467**************  (via generate new client secret button)
```

- Display information :- `upload a logo`

- Private keys -> `generate a private key` -> save it into the project folder

- `save changes`

- in `.env`
```bash
GITHUB_APP_PRIVATE_KEY= (please add the private key with proper escapin character, tell AI to do it)
GITHUB_WEBHOOK_SECRET=7cd249ab57**************4cdecad123797c2c
BETTER_AUTH_URL=https://unpreserved-elke-unrefractory.ngrok-free.dev
```

- in `lib/auth.ts`
```bash
mapProfileToUser: async(profile) => ({
  email: profile.email ?? `${profile.id}@users.noreply.github.com`,
  name: profile.name ?? profile.login
})
```

## 5.2 Installation flow (Connect card → install on GitHub → callback saves installationId per user.)
- features/github/utils/github-app.ts                       (`npm i octokit` -> initialise Github App ka instance using octokit)
- features/dashboard/lib/types.ts                           (copy/paste)
- prisma/schema.prisma                                      (write github installation Model -> `npx prisma migrate dev` -> Enter a name for the new migration: github-app -> `npx prisma generate`)
- features/github/server/installation.ts                    (write functionality for Installation/Deletion of github app & updation in DB)
- features/dashboard/com onents/dashboard-header.tsx        (create dashboard header)
- features/dashboard/lib/LB status-s le.ts                  (copy/paste)
- features/github/actions/index.ts
- features/github/components/github-connect-card.tsx
- app/(protected)/dashboard/github/page.tsx
- app/api/github/callback/route.ts

# Chapter 6 — Receiving PR Webhooks
- app/api/github/webhook/route.ts                   (to handle Github Webhook)
- features/reviews/server/save-pull-request.ts        (save pr to prisma db)
- features/github/server/webhook-handler.ts           (handleGithubWebhook : functionality of route.ts here)
- prisma/schema.prisma                                      (model PullRequest -> `npx prisma migrate dev` -> `npx prisma generate`)
- TESTING THIS FLOW
    - `npm run dev`
    - `ngrok http --url=unpreserved-elke-unrefractory.ngrok-free.dev 3000`
    - go to any project -> do a pr -> create pr in github's repo of that same project -> u can see the events in the vscode terminal
    - `npx prisma studio` to check if it is save in db or not

# Chapter 7 — Background Jobs with Inngest
## 7.1 Inngest setup
- inngest.com -> docs -> getting started(nextjs) -> `.env`
```bash
INNGEST_DEV=1
```

- 1. Install Inngest: `npm install inngest`
- 2. Run the Inngest Dev Server -> npx -> `npx inngest-cli@latest dev` ->u will get `http://localhost:8288` in terminal i.e. inngest client ka server
- 3. Now Create an Inngest client -> 
    - App Router -> features/inngest/client.ts                              (copy/paste)
```bash
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "ai-powered-code-reviewer" });
```
    - app/api/inngest/route.ts                                              (copy/paste)
```bash
import { inngest } from "@/features/inngest/client";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [],
});
```
- 4. Write your first function -> App Router
    - Define the function in :- app/api/inngest/functions.ts                  (copy/paste)
    - Then register the function with your serve handler in :- app/api/inngest/route.ts
```bash
functions: [processTask],
```

- TEST IF YOUR INNGEST APP REGISTER IN INNGEST SERVER OR NOT -> `npm run dev` -> `ngrok http --url=unpreserved-elke-unrefractory.ngrok-free.dev 3000` -> see here (`http://localhost:8288` -> Apps) -> view function -> Invoke function -> 🎉 YOU CAN SEE Fn RUNNING

# Chapter 8 — The AI Review Pipeline
## 8.1 AI-SDK setup
- chrome -> ai sdk -> ai-sdk.dev -> `npm install ai`
- search(open router) -> setup -> npm -> `npm install @openrouter/ai-sdk-provider`

## 8.2 OpenRouter setup
- `openrouter.ai` -> login -> Get API key -> new key -> name: ai-powered-code-reviewer -> create -> copy key -> `.env`
```bash
OPENROUTER_API_KEY=sk-or*****************************
```

## 8.1 cont...
- Provider Instance -> features/ai/index.ts             (copy/paste)
```bash
apiKey: "YOUR_OPENROUTER_API_KEY" ❌ | apiKey: process.env.OPENROUTER_API_KEY ✅
```

## 8.3 Now write code
- features/reviews/types/review.ts                    (ai generated review k types)
- features/reviews/server/pr-files.ts                 (find diff code for review generation by ai, get all PR Files)
- features/reviews/utils/chunk-code.ts                (code chunking functions)
- features/reviews/server/save-pull-request.ts        (update)
- features/github/server/webhook-handler.ts           (update)
- features/reviews/server/generate-review.ts    (generate review by ai)
- features/reviews/server/post-pr-comment.ts    (comments done after PR create, ai review is generated and about to merge)
- features/reviews/server/review-pr-function.ts (inngest workflow)
- app/api/inngest/route.ts                      (register full workflow of reviewPullRequest in inngest)

- TESTING :- 
  - `npm run dev`
  - `ngrok http --url=unpreserved-elke-unrefractory.ngrok-free.dev 3000`
  - `npx inngest-cli@latest dev` -> `localhost/8288` -> runs

  - goto any project -> write some code -> raise pr -> github pe create -> and u can see in inngest cli(`localhost/8288/runs`) -> 🎉 That's it!

# Chapter 9 — Repo Sync (Codebase Context)
- prisma/schema.prisma                          (write model RepoSync -> `npx prisma migrate dev` -> `npx prisma generate`)

- features/repo-sync/actions/repo-sync.ts

- pinecone -> indexed -> `Create Index` -> 
    - name: `aipoweredcodereviewer`
    - `Create Index`
    - `Connect` -> Install Pinecone (select: Node) -> (copy cmd): `npm install @pinecone-database/pinecone`
    - features/pinecone/client.ts               (getting pinecode index)

- PINECONE_API_KEY -> pinecone -> Api Key -> click `Api Key` -> name: aipoweredcodereviewer -> `create key` -> (copy/paste in `.env`) 

- `.env`
```bash
PINECONE_INDEX=<INDEX_NAME>            (name u gave when creating index) eg: aipoweredcodereviewer
PINECONE_API_KEY=pcsk_5*************************
```

## 9.1 Sync Inngest function
- features/repo-sync/types/index.ts                       (contains types)
- features/repo-sync/actions/repo-sync.ts                 (server action of repo-sync)
- features/pinecone/client.ts                             (Pinecode client to get indexes)
- features/repo-sync/server/repo-sync.ts                  (repo-sync code)
- features/repo-sync/server/repo-sync-function.ts         (inngest background job of syncRepoCodebaseFunction)
- features/github/server/repos.ts                         (backend logic to see all the repos in UI)

## 9.2 Fetch the repos with infinite scroll (for UI) + sync button & status
- app/api/github/repos/route.ts
- app/api/inngest/route.ts                                (register syncRepoCodebaseFunction in inngest)
- features/github/lib/repos-query.ts                      (implement infiniteQueryOptions for load data before hand & do infine scroll)
- features/repo-sync/components/sync-repo-button.tsx      (sync button UI)
- features/dashboard/components/repo-list.tsx             (listing all the repos UI)
- app/(protected)/dashboard/repos/page.tsx                (dashboard -> repositories UI)
- app/layout.tsx                                          (added <Toaster /> component)

## 9.3 Use full repo synced context in reviews
- features/reviews/server/review-pr-function.ts           (implemented inngest RAG pipeline)
- features/reviews/server/vector.ts                       (implemented saveChunksToPinecone, searchPrContext functionality)
- features/reviews/server/generate-review.ts

## TESTING 
- `npm run dev`
- `ngrok http --url=unpreserved-elke-unrefractory.ngrok-free.dev 3000` -> `https://unpreserved-elke-unrefractory.ngrok-free.dev`
- `npx inngest-cli@latest dev` -> `http://127.0.0.1:8288/runs`
- see dashboard -> repositories in applicaion -> `sync` anyone of them -> make `PR` in it
- see in inngest (you will see 2 background jobs)
  - 1. syncing background job
  - 2. PR background job
- You can see `Namespaces`:- Pinecone -> indexes
- Now u can see Prisma :- `npx prisma studio` if database if updated or not.
- 🎉 That's it!

# Chapter 10 — Payments with Razorpay
- accounts & setting -> Api Key -> `.env`
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_TK************
RAZORPAY_KEY_SECRET=Xsaa*****************
```

- razorpay -> subscriptions -> plans -> `create plan`
  - Plan Name: AI Powered Code Reviewer
  - Billing frequency: Every `1` `Months`
  - Billing Amount: `999`
  - `Create Plan`
  - `.env`
  ```bash
  RAZORPAY_PLAN_ID=plan_TL***********
  ```

- razorpay -> subscriptions -> subscriptions -> `create new subscription`
  - plan dettails
    - select plan: `select via dropdown menu`
    - start data: ✅(immdiately)
    - Total count: 12
    - click `Next`

  - Add Ons
    - click `Next`

  - Link Details
    - Link Expiry: ✅ No Expiry
    - click `Next`

  - Review
    - click `Create Subscription Link`

- VSCode -> teminal -> `npm i razorpay`

- prisma/schema.prisma                                    (update the user model with payments -> `npx prisma migrate dev` -> name: payment -> `npx prisma generate`)

## 10.1 Create Plan , subscription then webhook in Razorpay
- razorpay -> developers -> webhooks -> `Add new webhook`
  - webhook URL: https://unpreserved-elke-unrefractory.ngrok-free.dev/api/razorpay/webhook    (add `https://unpreserved-elke-unrefractory.ngrok-free.dev` + `/api/razorpay/webhook`)
  - secret: b8d9f*******************                        (create your strong secret)
  - Active Events: ✅ ALL Subscription Events
  - `Create Webhook`
-  `.env`
```bash
RAZORPAY_WEBHOOK_SECRET="b8d9f********************"          (paste that webhook secret here)
```

## 10.2
## 10.2.1 Plans & limits — Free (5 reviews/month) vs Pro (unlimited)
## 10.2.2 Subscription checkout — Razorpay subscription, upgrade button, checkout flow
## 10.2.3 Webhook & rate limiting — Verify Razorpay webhooks, update plan, rate-limit free users in the GitHub webhook.
## 10.2.4 Settings page — Current plan, renewal date, cancel flow.
- features/billing/lib/razorpay.ts                            (initialise reazorpay client)
- features/billing/server/subscription.ts                     (getUserSubscription, createProSubscription, cancelProSubscription)
- features/billing/server/usage.ts                            (usage related)
- features/settings/lib/plan-details.ts                       (PLAN_DETAIL - free | pro)
- features/github/server/webhook-handler.ts                   (rate-limit free users in the GitHub webhook)
- lib/billing.ts                                              (startProSubscription, cancelSubscription)
- features/billing/components/upgrade-button.tsx              (upgrade to pro button)
- app/api/razorpay/webhook/route.ts                           (razorpay webhook POST route)
- features/settings/types/index.ts
- features/billing/components/cancel-subscription-button.tsx  (cancel subscription button)
- features/dashboard/components/settings-content.tsx          (Settings page body with Profile and Subscription tabs)
- features/settings/server/get-settings.ts                    (getUserSettings)
- app/(protected)/dashboard/settings/page.tsx                 (setting page)

## TESTING
- `npm run dev` -> `ngrok http --url=unpreserved-elke-unrefractory.ngrok-free.dev 3000` -> website -> dashboard -> settings -> subscription -> `upgrade to pro` -> 🎉 That's it!

# Chapter 11 — Landing Page
- features/landing/components/dashboard-preview.tsx
- app/page.tsx
- app/layout.tsx

# Chapter 12 — dashboard/overview page
- features/overview/types/index.ts
- features/overview/server/overview.ts
- app/api/overview/route.ts
- features/overview/components/setup-checklist.tsx
- features/overview/components/overview-content.tsx
- app/(protected)/dashboard/page.tsx
- app/(protected)/dashboard/layout.tsx

# Chapter 13 — dashboard/pull-request
- `npm i react-markdown remark-gfm`
- app/page.tsx
- features/dashboard/lib/types.ts
- features/dashboard/lib/status-style.ts
- features/pull-requests/types/index.ts
- features/pull-requests/server/pull-requests.ts
- app/api/pull-requests/route.ts
- features/pull-requests/components/review-markdown.tsx
- features/pull-requests/components/pull-request-list.tsx
- features/pull-requests/components/review-refresher.tsx
- app/(protected)/dashboard/pull-request/page.tsx
- app/(protected)/dashboard/pull-request/[id]/page.tsx
