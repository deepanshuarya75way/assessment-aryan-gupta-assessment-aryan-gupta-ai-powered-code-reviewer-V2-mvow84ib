import { Prisma } from "@/lib/generated/prisma/client";

export const STATUSES = ["pending", "processing", "reviewed", "rate_limited"];
export const FIELDS = {
  status : "enum",
  repoFullName: "text",
  authorLogin: "text",
  createdAt: "date",
  updatedAt: "date",
  reviewedAt: "date",
} as const;
export const OPS = {
  enum: ["eq", "in"],
  text: ["eq", "contains", "in"],
  date: ["between"],
} as const;

export type Field = keyof typeof FIELDS;
export type Op = "eq" | "contains" | "in" | "between";
export type Cond = { field: Field; op: Op; value: string; not?: boolean };
export type Group = { logic: "and" | "or"; items: (Cond | Group)[] };

export function validate(n: unknown, depth = 0, seen = {n:0}): string | null {
  const x = n as {
    field?: string; op?: string; value?: unknown; logic?: unknown; items?: unknown[];
  } | null;
  if (!x || typeof x !== "object") return "Invalid filter";

  if("items" in x) {
    if(depth > 3 || !Array.isArray(x.items) || (x.logic !== "and" && x.logic !== "or")) 
      return "Invalid group";
    for(const item of x.items) {
      const error = validate(item, depth + 1, seen);
      if(error) return error;
    }
    return null;
  }

  if(++seen.n > 20) return "Use at most 20 conditions";
  const kind = x.field && Object.hasOwn(FIELDS, x.field) ? FIELDS[x.field as Field] : null;
  if(!kind || !x.op || !(OPS[kind] as readonly string[]).includes(x.op)) return "Invalid condition";

  const v = typeof x.value === "string" ? x.value.trim() : "";
  if(!v || v.length > 200) return `${x.field}: enter a value`;
  const parts = v.split(",").map(() => s.trim());

  if(kind === "date") {
    const [from, to] = parts;
    const ok = (d: string) => !d || (/^\d{4}-\d{2}-\d{2}$/.test(d) && isNaN(Date.parse(d)));
    if(parts.length !== 2 || !ok(from) || !ok(to) || (!from && !to)) return `${x.field}: pick a valid date range`;
    if(from && to && from > to) return `${x.field}: start is after end`;
  } else {
    const list = x.op === "in" ? parts.filter(Boolean) : [v];
    if(!list.length || kind == "enum" && !list.every((s) => STATUSES.includes(s)))
      return `${x.field}: invalid value`;
  }
  return null;
}

const at = (field: Field, value: unknown) => ({[field]: value}) as Prisma.PullRequestWhereInput;
const NULLABLE = ["authorLogin", "reviewedAt"];

export function toWhere(n: Cond | Group): Prisma.PullRequestWhereInput | null {
  if("items" in n) {
    const parts = n.items.map(toWhere).filter((p) => p !== null);
    return parts.length ? {[n.logic === "and" ? "AND" : "OR"]: parts} : null;
  }

  const parts = n.value.split(",").map((s) => s.trim());
  const text = FIELDS[n.field] === "text";
  let w: Prisma.PullRequestWhereInput;

  if(n.op === "between") {
    const [from, to] = parts;
    w = at(n.field, {
      ...(from && {gte: new Date(from)}),
      ...(to && {lt: new Date(Date.parse(to) + 864e5)}),
    });
  } else if(n.op === "contains") {
    w = at(n.field, {contains: n.value.trim(), mode: "insensitive"});
  } else {
    const vals = n.op === "in" ? parts.filter(Boolean) : [n.value.trim()];
    w = text
      ? {OR: vals.map((v) => at(n.field, {equals: v, mode: "insensitive"}))}
      : at(n.field, {in: vals});
  }

  if(!n.not) return w;
  return NULLABLE.includes(n.field) ? {OR: [{NOT: w}, at(n.field, null)]} : {NOT: w};
}
