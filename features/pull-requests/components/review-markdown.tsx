import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

/** Colors a unified-diff line by its leading marker. */
function getDiffLineClass(line: string) {
  if (line.startsWith("+")) {
    return "bg-green-500/15 text-green-700 dark:text-green-400";
  }

  if (line.startsWith("-")) {
    return "bg-red-500/15 text-red-700 dark:text-red-400";
  }

  if (line.startsWith("@@")) {
    return "text-muted-foreground";
  }

  return "";
}

function DiffBlock({ value }: { value: string }) {
  return (
    <pre className="my-4 overflow-x-auto border border-border bg-muted/40 py-2 text-xs leading-6">
      <code className="block">
        {value.split("\n").map((line, index) => (
          <span
            key={index}
            className={cn("block px-4", getDiffLineClass(line))}
          >
            {/* Non-breaking space keeps blank lines from collapsing */}
            {line || "\u00a0"}
          </span>
        ))}
      </code>
    </pre>
  );
}

function SuggestionBlock({ value }: { value: string }) {
  return (
    <div className="my-4 overflow-hidden border border-green-500/40">
      <p className="border-b border-green-500/40 bg-green-500/10 px-4 py-1.5 text-xs font-medium text-green-700 dark:text-green-400">
        Suggested change
      </p>
      <pre className="overflow-x-auto bg-muted/40 p-4 text-xs leading-6">
        <code>{value}</code>
      </pre>
    </div>
  );
}

function PlainBlock({ value }: { value: string }) {
  return (
    <pre className="my-4 overflow-x-auto border border-border bg-muted/40 p-4 text-xs leading-6">
      <code>{value}</code>
    </pre>
  );
}

const COMPONENTS: Components = {
  // react-markdown wraps fenced blocks in <pre>; our blocks render their own,
  // and nesting <pre> inside <pre> is invalid HTML and breaks hydration.
  pre({ children }) {
    return <>{children}</>;
  },
  code({ className, children, ...props }) {
    const language = /language-(\w+)/.exec(className ?? "")?.[1];
    const value = String(children).replace(/\n$/, "");

    if (!language) {
      return (
        <code className="bg-muted px-1 py-0.5 text-[0.85em]" {...props}>
          {children}
        </code>
      );
    }

    if (language === "diff") {
      return <DiffBlock value={value} />;
    }

    if (language === "suggestion") {
      return <SuggestionBlock value={value} />;
    }

    return <PlainBlock value={value} />;
  },
  h1: ({ children }) => (
    <h2 className="mt-8 mb-3 text-lg font-semibold first:mt-0">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 mb-3 text-base font-semibold first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-sm font-semibold first:mt-0">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-3 text-sm leading-6 text-muted-foreground">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
      {children}
    </ol>
  ),
  strong: ({ children }) => (
    <strong className="font-medium text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-4 hover:text-foreground"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-border pl-4 text-sm text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-border" />,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border px-3 py-2 text-left text-xs font-medium">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
      {children}
    </td>
  ),
};

/**
 * Renders a stored AI review. Handles the two fenced languages the review
 * prompt emits — `diff` and `suggestion` — with GitHub-like coloring.
 */
export function ReviewMarkdown({ content }: { content: string }) {
  return (
    <div className="max-w-3xl">
      <Markdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {content}
      </Markdown>
    </div>
  );
}
