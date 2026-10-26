import Link from "next/link";
import { Check, FolderGit2, GitPullRequest } from "lucide-react";
import { GitHubIcon } from "@/features/auth/components/github-sign-in-form";

import { Button } from "@/components/ui/button";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { cn } from "@/lib/utils";

type SetupChecklistProps = {
  connected: boolean;
  accountLogin: string | null;
  reposSynced: number;
  pullRequestsTotal: number;
};

type Step = {
  title: string;
  body: string;
  done: boolean;
  href?: string;
  action?: string;
};

/**
 * Empty state for the overview. Each step reflects real account state, so the
 * list doubles as a status readout while the user works through it.
 */
export function SetupChecklist({
  connected,
  accountLogin,
  reposSynced,
  pullRequestsTotal,
}: SetupChecklistProps) {
  const steps: Step[] = [
    {
      title: "Install the GitHub App",
      body: connected
        ? `Connected to ${accountLogin ?? "your GitHub account"}.`
        : "Grant access to the repositories you want reviewed. Public and private both work.",
      done: connected,
      href: DASHBOARD_ROUTES.github,
      action: connected ? "Manage" : "Install",
    },
    {
      title: "Sync a repository",
      body:
        reposSynced > 0
          ? `${reposSynced} ${reposSynced === 1 ? "repository" : "repositories"} indexed. Reviews now use your codebase for context.`
          : "Indexing your code lets reviews reference the rest of your repo, not just the diff.",
      done: reposSynced > 0,
      href: DASHBOARD_ROUTES.repos,
      action: reposSynced > 0 ? "Sync more" : "Choose a repo",
    },
    {
      title: "Open a pull request",
      body:
        pullRequestsTotal > 0
          ? "Reviews are flowing. Your dashboard will fill in from here."
          : "The next PR on a connected repo gets reviewed automatically. Nothing else to configure.",
      done: pullRequestsTotal > 0,
    },
  ];

  const completed = steps.filter((step) => step.done).length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-medium">Finish setting up</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {completed} of {steps.length} done. Your overview appears here once
          the first review lands.
        </p>
      </div>

      <ol className="max-w-2xl rounded-none border border-border">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="flex items-start gap-4 border-b border-border p-4 last:border-b-0"
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-none border text-xs font-medium",
                step.done
                  ? "border-green-500/40 bg-green-500/15 text-green-700 dark:text-green-400"
                  : "border-border text-muted-foreground",
              )}
            >
              {step.done ? <Check className="size-4" /> : index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.done && "text-muted-foreground line-through",
                )}
              >
                {step.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {step.body}
              </p>
            </div>

            {step.href ? (
              <Button asChild size="sm" variant="outline" className="shrink-0">
                <Link href={step.href}>{step.action}</Link>
              </Button>
            ) : (
              <span className="shrink-0 text-xs text-muted-foreground">
                {step.done ? "Done" : "Waiting"}
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="flex max-w-2xl flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <GitHubIcon /> 2-click install
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FolderGit2 className="size-3.5" /> Whole-repo context
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GitPullRequest className="size-3.5" /> Reviews post to the PR
        </span>
      </div>
    </div>
  );
}
