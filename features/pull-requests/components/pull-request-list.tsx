"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Filter, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import {
  PR_STATUS_LABEL,
  PR_STATUS_TONE,
  statusBadge,
} from "@/features/dashboard/lib/status-style";
import {validate, type Group} from "../lib/filters";
import {GroupEditor} from "./filter-editor";
import type {
  PullRequestFilter,
  PullRequestListItem,
  PullRequestPage,
} from "../types";
import { OutletBoundary } from "next/dist/lib/framework/boundary-components";

/** Matches the overview page so the dashboard feels consistent. */
const POLL_INTERVAL = 10_000;

/** Delay before a keystroke becomes a request. */
const SEARCH_DEBOUNCE = 300;

const TAB_LABELS: Record<PullRequestFilter, string> = {
  all: "All",
  queued: "Queued",
  reviewed: "Reviewed",
  rate_limited: "Rate limited",
};

function detailHref(id: string) {
  return `${DASHBOARD_ROUTES.pullRequest}/${id}`;
}

export function PullRequestList() {
  const [filter, setFilter] = useState<PullRequestFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [draft, setDraft] = useState<Group>({logic: "and", items: []});
  const [applied, setApplied] = useState<Group | null>(null);
  const appliedJson = applied ? JSON.stringify(applied) : "";

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["pull-requests", "list", filter, debouncedSearch, appliedJson],
    queryFn: async ({ pageParam }): Promise<PullRequestPage> => {
      const params = new URLSearchParams({
        filter,
        page: String(pageParam),
      });

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }

      if(appliedJson) {
        params.set("filters", appliedJson);
      }

      const response = await fetch(`/api/pull-requests?${params}`);

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to load pull requests");
      }

      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    refetchInterval: POLL_INTERVAL,
  });

  const pullRequests = useMemo(
    () => data?.pages.flatMap((page) => page.pullRequests) ?? [],
    [data],
  );

  const counts = data?.pages[0]?.counts ?? {
    all: 0,
    queued: 0,
    reviewed: 0,
    rate_limited: 0,
  };

  let rows;

  if (isPending) {
    rows = (
      <TableRow>
        <TableCell colSpan={6} className="text-center text-muted-foreground">
          Loading pull requests…
        </TableCell>
      </TableRow>
    );
  } else if (isError) {
    rows = (
      <TableRow>
        <TableCell colSpan={6} className="text-center text-muted-foreground">
          {error instanceof Error ? error.message : "Failed to load pull requests."}
        </TableCell>
      </TableRow>
    );
  } else if (pullRequests.length === 0) {
    rows = (
      <TableRow>
        <TableCell colSpan={6} className="text-center text-muted-foreground">
          {applied
          ? "No results. Your filters may conflict"
          : debouncedSearch
            ? "No pull requests match that search."
            : "No pull requests yet. Open one on a connected repository."}
        </TableCell>
      </TableRow>
    );
  } else {
    rows = pullRequests.map((pullRequest) => (
      <PullRequestRow key={pullRequest.id} pullRequest={pullRequest} />
    ));
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as PullRequestFilter)}
        >
          <TabsList>
            {(Object.keys(TAB_LABELS) as PullRequestFilter[]).map((key) => (
              <TabsTrigger key={key} value={key}>
                {TAB_LABELS[key]} ({counts[key]})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters((o) => !o)}>
            <Filter className="size-4" /> Filters{applied ? " (on)" : ""}
          </Button>
          <Input
            placeholder="Search by repo or title…"
            className="max-w-xs"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-col gap-3 border border-border p-4">
          <GroupEditor value={draft} onChange={setDraft}/>
          <div className="flex items-center gap-2">
            <Button size="sm" disabled={!!validate(draft)} onClick={() => setApplied(draft.items.length ? draft : null)}>Apply</Button>
            <Button size="sm" variant="outline" onClick={() => {setDraft({logic: "and", items: []}); setApplied(null);}}>Clear</Button>
          </div>
        </div>
      )}

      <div className="rounded-none border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pull request</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Base</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Updated</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>{rows}</TableBody>
        </Table>
      </div>

      {hasNextPage ? (
        <div className="py-2 text-center">
          <Button
            size="sm"
            variant="outline"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function PullRequestRow({ pullRequest }: { pullRequest: PullRequestListItem }) {
  const href = detailHref(pullRequest.id);

  return (
    <TableRow>
      <TableCell>
        <Link href={href} className="flex flex-col">
          <span className="font-medium hover:underline">
            {pullRequest.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {pullRequest.repoFullName} #{pullRequest.prNumber}
          </span>
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {pullRequest.authorLogin ?? "—"}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {pullRequest.baseBranch}
      </TableCell>
      <TableCell>
        <span
          className={statusBadge(PR_STATUS_TONE[pullRequest.status], "gap-1")}
        >
          {pullRequest.status === "processing" ? (
            <Loader2 className="size-3 animate-spin" />
          ) : null}
          {PR_STATUS_LABEL[pullRequest.status]}
        </span>
      </TableCell>
      <TableCell className="text-right whitespace-nowrap text-muted-foreground">
        {formatDistanceToNow(new Date(pullRequest.updatedAt), {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="text-right">
        <Link
          href={href}
          aria-label={`Open review for ${pullRequest.title}`}
          className="inline-flex text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </Link>
      </TableCell>
    </TableRow>
  );
}
