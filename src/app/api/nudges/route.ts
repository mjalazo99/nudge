import { NextResponse } from "next/server";

// MVP: create a shareable link and store in-memory (not durable).
// Next step: persist to DB + Stripe.

type Side = "A" | "B";

type CreateNudge = {
  title: string;
  action: string;
  deadlineMinutes: number;
  stakeA: number;
  stakeB: number;
  winner: Side;
};

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

  const deadlineMinutes = Number(body.deadlineMinutes);
  if (!Number.isFinite(deadlineMinutes) || deadlineMinutes < 1 || deadlineMinutes > 30 * 24 * 60) {
    return bad("Invalid deadline");
  }

  const stakeA = Number(body.stakeA);
  const stakeB = Number(body.stakeB);
  if (!Number.isFinite(stakeA) || stakeA < 0) return bad("Invalid stakeA");
  if (!Number.isFinite(stakeB) || stakeB < 0) return bad("Invalid stakeB");
  if (stakeA + stakeB <= 0) return bad("At least one stake must be > 0");

  const winner = body.winner === "B" ? "B" : "A";

  const id = crypto.randomUUID();
  const tokenA = crypto.randomUUID();
  const tokenB = crypto.randomUUID();

  store.set(id, {
    id,
    title,
    action,
    deadlineMinutes,
    stakeA,
    stakeB,
    winner,
    createdAt: Date.now(),

    // Agreement + outcome state (v1)
    accepted: { A: false, B: false },
    outcome: { A: null as null | "done" | "not_done", B: null as null | "done" | "not_done" },
    endedEarlyAt: null as null | number,

    tokens: { A: tokenA, B: tokenB },
  });

  // Build absolute URLs that work on whatever host the user is actually using (localhost, LAN IP, prod domain).
  const inferredOrigin = new URL(req.url).origin;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || inferredOrigin;

  const urlA = `${baseUrl}/n/${id}?t=${tokenA}`;
  const urlB = `${baseUrl}/n/${id}?t=${tokenB}`;

  return NextResponse.json({ id, urlA, urlB });
}
