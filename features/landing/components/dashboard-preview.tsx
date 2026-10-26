import Image from "next/image";
import {
  FolderGit2,
  LayoutDashboard,
  Lock,
  PanelLeft,
  Search,
  Settings,
  Star,
} from "lucide-react";
import { GitHubIcon } from "@/features/auth/components/github-sign-in-form";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Repositories", icon: FolderGit2, active: true },
  { label: "PullRequests", icon: FolderGit2 },
  { label: "GitHub App", icon: GitHubIcon },
  { label: "Settings", icon: Settings },
];

const REPOS = [
  {
    name: "HTML-CSS-JS",
    owner: "ARRGUPT/HTML-CSS-JS",
    visibility: "Private",
    language: "TypeScript",
    updated: "11 minutes ago",
    synced: true,
  },
  {
    name: "ai-powered-code-reviewer",
    owner: "ARRGUPT/ai-powered-code-reviewer",
    visibility: "Public",
    language: "TypeScript",
    updated: "4 days ago",
    synced: false,
  },
  {
    name: "hello-world-nodejs",
    owner: "ARRGUPT/hello-world-nodejs",
    visibility: "Public",
    language: "JavaScript",
    updated: "25 days ago",
    synced: false,
  },
  {
    name: "chai-aur-nextjs",
    owner: "ARRGUPT/chai-aur-nextjs",
    visibility: "Public",
    language: "TypeScript",
    updated: "30 days ago",
    synced: false,
  },
  {
    name: "OIDC-AUTH-CAS",
    owner: "ARRGUPT/OIDC-AUTH-CAS",
    visibility: "Public",
    language: "JavaScript",
    updated: "about 1 month ago",
    synced: false,
  },
  {
    name: "tic-tac-toe",
    owner: "ARRGUPT/tic-tac-toe",
    visibility: "Public",
    language: "JavaScript",
    updated: "about 1 month ago",
    synced: false,
  },
  {
    name: "timer-stopwatch",
    owner: "ARRGUPT/timer-stopwatch",
    visibility: "Public",
    language: "JavaScript",
    updated: "about 1 month ago",
    synced: false,
  },
  {
    name: "to-do-list",
    owner: "ARRGUPT/to-do-list",
    visibility: "Public",
    language: "CSS",
    updated: "about 1 month ago",
    synced: false,
  },
] as const;

const COLS =
  "grid grid-cols-[2.2fr_0.9fr_0.7fr_1fr_0.6fr_1.1fr_0.8fr] items-center gap-3 px-4";

/**
 * Static replica of /dashboard/repos used as the landing hero visual.
 * Markup instead of a screenshot so it stays sharp at any DPI and follows
 * the active theme.
 */
export function DashboardPreview() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex min-w-[900px] select-none bg-background text-[13px]"
    >
      <aside className="flex w-[220px] shrink-0 flex-col gap-6 border-r border-border bg-sidebar px-3 py-4">
        <div className="flex items-center gap-2 px-1">
          <Image
            src="/logo-light.png"
            alt=""
            width={28}
            height={28}
            className="size-7 object-contain"
          />
          <span className="font-medium">AICodeReview</span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="px-2 pb-1 text-[11px] font-medium text-muted-foreground">
            Workspace
          </p>
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </div>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-4 px-6 py-5">
        <div className="flex items-start gap-3">
          <PanelLeft className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Repositories</p>
            <p className="text-xs text-muted-foreground">
              All public and private repositories available to the GitHub App.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 rounded-full bg-muted p-1 text-xs">
            <span className="rounded-full bg-background px-3 py-1 font-medium">
              All (67)
            </span>
            <span className="px-3 py-1 text-muted-foreground">Public (61)</span>
            <span className="px-3 py-1 text-muted-foreground">Private (6)</span>
          </div>
          <div className="flex w-64 items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
            <Search className="size-3.5" />
            Search repositories...
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div
            className={`${COLS} border-b border-border py-2.5 text-xs font-medium text-muted-foreground`}
          >
            <span>Repository</span>
            <span>Visibility</span>
            <span>Branch</span>
            <span>Language</span>
            <span>Stars</span>
            <span className="text-right">Updated</span>
            <span className="text-right">Codebase</span>
          </div>

          {REPOS.map((repo) => (
            <div
              key={repo.owner}
              className={`${COLS} border-b border-border/60 py-2.5 last:border-b-0`}
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{repo.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {repo.owner}
                </span>
              </span>
              <span>
                <span
                  className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] ${
                    repo.visibility === "Private"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                      : "border-blue-500/40 bg-blue-500/10 text-blue-400"
                  }`}
                >
                  <Lock className="size-3" />
                  {repo.visibility}
                </span>
              </span>
              <span className="text-muted-foreground">main</span>
              <span className="truncate text-muted-foreground">
                {repo.language}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Star className="size-3.5" />0
              </span>
              <span className="truncate text-right text-muted-foreground">
                {repo.updated}
              </span>
              <span className="text-right">
                <span className="inline-flex rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium">
                  {repo.synced ? "Re-sync" : "Sync"}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
