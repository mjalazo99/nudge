import { NextResponse } from "next/server";

// MVP placeholder: create a shareable link and store in-memory (not durable).
// Next step: persist to DB (e.g., Supabase) + Stripe Checkout sessions.

type Side = "A" | "B";

type CreateNudge = {
  title: string;
  action: string;
  deadlineHours: number;
  stakeA: number;
  stakeB: number;
  winner: Side;
};

// Simple in-memory store for local dev.
// NOTE: resets on server restart.
const globalAny = global as any;
const store: Map<string, any> = globalAny.__NUDGE_STORE__ || new Map();
globalAny.__NUDGE_STORE__ = store;

function bad(msg: string, status = 400) {
  return new NextResponse(msg, { status });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as CreateNudge | null;
  if (!body) return bad("Invalid JSON");

  const title = (body.title || "").trim();
  const action = (body.action || "").trim();
  if (!title) return bad("Missing title");
  if (!action) return bad("Missing action");

  const deadlineHours = Number(body.deadlineHours);
  if (!Number.isFinite(deadlineHours) || deadlineHours < 24 || deadlineHours > 24 * 30) {
    return bad("Invalid deadline");
  }

  const stakeA = Number(body.stakeA);
  const stakeB = Number(body.stakeB);
  if (!Number.isFinite(stakeA) || stakeA < 0) return bad("Invalid stakeA");
  if (!Number.isFinite(stakeB) || stakeB < 0) return bad("Invalid stakeB");
  if (stakeA + stakeB <= 0) return bad("At least one stake must be > 0");

  const winner = body.winner === "B" ? "B" : "A";

  const id = crypto.randomUUID();
  store.set(id, {
    id,
    title,
    action,
    deadlineHours,
    stakeA,
    stakeB,
    winner,
    createdAt: Date.now(),
    state: "proposed",
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}/n/${id}`;

  return NextResponse.json({ id, url });
}
