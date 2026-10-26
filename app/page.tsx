import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Bug,
  Check,
  Gauge,
  GitPullRequest,
  Layers,
  MessageSquareCode,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { GitHubIcon } from "@/features/auth/components/github-sign-in-form";

import { Button } from "@/components/ui/button";
import { getServerSession } from "@/features/auth/actions";
import { DashboardPreview } from "@/features/landing/components/dashboard-preview";

import overviewPreview from "@/public/preview-overview.png";
import pullRequestsPreview from "@/public/preview-pull-requests.png";
import reviewPreview from "@/public/preview-review.png";

const BRAND = "#FF3D00";

/** Set this to whatever your Razorpay plan actually charges. */
const PRO_PRICE = "₹999";

export const metadata: Metadata = {
  title: "AICodeReview — AI pull request reviews for your whole codebase",
  description:
    "Install the GitHub App, sync your repo, and get an expert AI review on every pull request — with one-click fixes.",
};

const STEPS = [
  {
    icon: GitHubIcon,
    title: "Install the GitHub App",
    body: "Two clicks. Choose the repositories you want watched — public and private both work.",
  },
  {
    icon: RefreshCw,
    title: "Sync your codebase",
    body: "We index your repository so reviews understand your conventions, not just the diff in front of them.",
  },
  {
    icon: GitPullRequest,
    title: "Open a pull request",
    body: "A webhook fires the moment the PR lands and queues a background review job. Nothing to run manually.",
  },
  {
    icon: MessageSquareCode,
    title: "Read the review",
    body: "Posted straight to the PR as a comment, with applicable suggestion blocks instead of vague advice.",
  },
];

const PILLARS = [
  {
    icon: Layers,
    title: "Knows your whole repo",
    body: "Every review retrieves related code from across your codebase, so it catches the caller you forgot about — not just the lines you touched.",
  },
  {
    icon: Zap,
    title: "Runs in the background",
    body: "Reviews run as durable background jobs. Your PR is never blocked waiting on a request, and nothing is lost if a step fails.",
  },
  {
    icon: Wrench,
    title: "Fixes, not opinions",
    body: "Every finding ships with real code — a GitHub suggestion you can apply in one click, or a diff you can copy.",
  },
];

const CHECKS = [
  {
    icon: Bug,
    title: "Correctness",
    body: "Bugs, logic errors, off-by-one mistakes, wrong assumptions.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    body: "Injection risks, auth holes, exposed secrets, unvalidated input.",
  },
  {
    icon: Gauge,
    title: "Performance",
    body: "N+1 queries, missing indexes, wasted loops, memory leaks.",
  },
  {
    icon: Sparkles,
    title: "Reliability",
    body: "Unhandled errors, missing null checks, race conditions.",
  },
  {
    icon: MessageSquareCode,
    title: "Readability",
    body: "Unclear naming, tangled logic, undocumented non-obvious code.",
  },
  {
    icon: Layers,
    title: "Maintainability",
    body: "Duplication, tight coupling, SOLID and DRY violations.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    note: "forever",
    features: [
      "Up to 5 AI reviews per month",
      "Public and private repositories",
      "Full codebase context",
      "Community support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: PRO_PRICE,
    note: "per month",
    features: [
      "Unlimited AI reviews on connected repos",
      "Public and private repositories",
      "Full codebase context",
      "Priority support",
    ],
    highlighted: true,
  },
];

const SCREENS = [
  {
    label: "At a glance",
    title: "Know where every review stands",
    body: "Usage against your plan, repositories indexed, reviews still in the queue — the whole account in one screen, updating itself while you watch.",
    image: overviewPreview,
    alt: "Dashboard overview showing reviews this month, repositories synced, queue depth, and a list of recently reviewed pull requests.",
  },
  {
    label: "Every PR",
    title: "Nothing slips through",
    body: "Each pull request the reviewer has seen, filterable by queued, reviewed, or skipped. Statuses move on their own as background jobs finish.",
    image: pullRequestsPreview,
    alt: "Pull requests page listing five pull requests with author, base branch, review status, and last updated time.",
  },
  {
    label: "The payoff",
    title: "A finding is useless without the fix",
    body: "Real vulnerabilities, explained in plain language, each one carrying the exact diff to apply. No vague advice to go read about somewhere else.",
    image: reviewPreview,
    alt: "A review flagging a command injection vulnerability, with a red and green diff replacing exec with execFile.",
  },
];

function ScreenshotFrame({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        sizes="(min-width: 1152px) 1104px, 100vw"
        className="h-auto w-full"
      />
    </div>
  );
}

export default async function Home() {
  const session = await getServerSession();
  const isSignedIn = Boolean(session);

  // Both CTAs point at the dashboard once signed in, sign-in otherwise.
  const ctaHref = isSignedIn ? "/dashboard" : "/sign-in";

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-light.png"
              alt=""
              width={32}
              height={32}
              priority
              className="size-8 object-contain"
            />
            <span className="text-lg font-semibold tracking-tight">
              AICodeReview
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="#review"
              className="transition-colors hover:text-foreground"
            >
              The review
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-foreground"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={ctaHref}>{isSignedIn ? "Dashboard" : "Log In"}</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="text-white hover:opacity-90"
              style={{ backgroundColor: BRAND }}
            >
              <Link href={ctaHref}>
                {isSignedIn ? "Go to dashboard" : "Get a free trial"}
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pt-20 pb-10 text-center sm:pt-28">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
            style={{ borderColor: `${BRAND}55`, color: BRAND }}
          >
            <Sparkles className="size-3.5" />
            Reviews that read your whole codebase
          </span>

          <h1 className="mt-8 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Every pull request reviewed
            <br className="hidden sm:block" /> before anyone opens it.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-8 text-muted-foreground">
            AICodeReview installs on GitHub in two clicks, indexes your
            repository, and comments on every PR with real fixes — correctness,
            security, performance, the lot.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 px-6 text-base text-white hover:opacity-90"
              style={{ backgroundColor: BRAND }}
            >
              <Link href={ctaHref}>
                {isSignedIn ? "Go to dashboard" : "Try it for free"}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              2-click install
              <GitHubIcon />
              <span className="text-border">|</span>
              No credit card
            </p>
          </div>
        </section>

        {/* Product preview */}
        <section className="relative mx-auto max-w-6xl px-6 pb-24">
          <div
            aria-hidden
            className="absolute inset-x-16 top-0 h-48 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: BRAND }}
          />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="overflow-x-auto">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-border/60 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight">
              From install to first review in under five minutes.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              No CI config, no YAML, no scripts to maintain. Connect once and it
              runs on every pull request from then on.
            </p>

            <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(({ icon: Icon, title, body }, index) => (
                <li key={title} className="relative">
                  <div
                    className="flex size-10 items-center justify-center rounded-xl border"
                    style={{ borderColor: `${BRAND}44`, color: BRAND }}
                  >
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-5 text-xs font-medium text-muted-foreground">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pillars */}
        <section className="border-t border-border/60 py-24">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <Icon className="size-6" style={{ color: BRAND }} />
                <h3 className="mt-6 text-lg font-medium">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Screens */}
        <section className="border-t border-border/60 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight">
              What you actually get.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Not a score, not a dashboard of charts. A reviewer that reads the
              change, finds the problem, and hands you the fix.
            </p>

            <div className="mt-16 flex flex-col gap-20">
              {SCREENS.map((screen) => (
                <div key={screen.title}>
                  <div className="max-w-xl">
                    <p
                      className="text-xs font-medium tracking-wide uppercase"
                      style={{ color: BRAND }}
                    >
                      {screen.label}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                      {screen.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {screen.body}
                    </p>
                  </div>
                  <div className="mt-8">
                    <ScreenshotFrame src={screen.image} alt={screen.alt} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What the review covers */}
        <section id="review" className="border-t border-border/60 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight">
              What every review looks for.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Findings are split into blocking issues and non-blocking
              suggestions, each one stated once, each one with the code to fix
              it.
            </p>

            <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {CHECKS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4">
                  <Icon
                    className="mt-0.5 size-5 shrink-0"
                    style={{ color: BRAND }}
                  />
                  <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-border/60 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-balance text-center text-4xl font-semibold tracking-tight">
              Start free. Upgrade when it earns it.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
              Five reviews a month, free forever. Go Pro when your team ships
              faster than that.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className="rounded-2xl border bg-card p-8"
                  style={{
                    borderColor: plan.highlighted ? BRAND : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{plan.name}</h3>
                    {plan.highlighted ? (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
                        style={{ backgroundColor: BRAND }}
                      >
                        Most popular
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.note}
                    </span>
                  </p>

                  <ul className="mt-8 flex flex-col gap-3 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <Check
                          className="mt-0.5 size-4 shrink-0"
                          style={{ color: BRAND }}
                        />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={
                      plan.highlighted
                        ? "mt-8 w-full text-white hover:opacity-90"
                        : "mt-8 w-full"
                    }
                    variant={plan.highlighted ? "default" : "outline"}
                    style={
                      plan.highlighted ? { backgroundColor: BRAND } : undefined
                    }
                  >
                    <Link href={ctaHref}>
                      {isSignedIn ? "Go to dashboard" : "Get started"}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-border/60 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight">
              Connect a repository and see your first review.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              It takes two clicks and costs nothing to find out what it catches.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-10 h-12 px-6 text-base text-white hover:opacity-90"
              style={{ backgroundColor: BRAND }}
            >
              <Link href={ctaHref}>
                {isSignedIn ? "Go to dashboard" : "Get a free trial"}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/logo-light.png"
                alt=""
                width={28}
                height={28}
                className="size-7 object-contain"
              />
              <span className="font-semibold tracking-tight">AICodeReview</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              AI pull request reviews that understand your entire codebase.
            </p>
          </div>

          <div className="text-sm">
            <p className="font-medium">Product</p>
            <ul className="mt-4 flex flex-col gap-3 text-muted-foreground">
              <li>
                <a href="#how-it-works" className="hover:text-foreground">
                  How it works
                </a>
              </li>
              <li>
                <a href="#review" className="hover:text-foreground">
                  The review
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="font-medium">Account</p>
            <ul className="mt-4 flex flex-col gap-3 text-muted-foreground">
              <li>
                <Link href={ctaHref} className="hover:text-foreground">
                  {isSignedIn ? "Dashboard" : "Log in"}
                </Link>
              </li>
              <li>
                <Link href={ctaHref} className="hover:text-foreground">
                  {isSignedIn ? "Repositories" : "Get a free trial"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="font-medium">Legal</p>
            <ul className="mt-4 flex flex-col gap-3 text-muted-foreground">
              <li>
                <span>Terms of Service</span>
              </li>
              <li>
                <span>Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-6 text-sm text-muted-foreground">
          AICodeReview © {new Date().getFullYear()}
        </div>

        {/* Oversized outlined wordmark */}
        <div className="px-6 pb-8">
          <svg
            aria-hidden
            viewBox="0 0 1200 160"
            className="w-full select-none"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 30%, transparent 95%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 30%, transparent 95%)",
            }}
          >
            <text
              x="0"
              y="140"
              textLength="1200"
              lengthAdjust="spacingAndGlyphs"
              fontSize="170"
              fontWeight="700"
              fill="none"
              stroke={BRAND}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity="0.85"
            >
              AICODEREVIEW
            </text>
          </svg>
        </div>
      </footer>
    </div>
  );
}
