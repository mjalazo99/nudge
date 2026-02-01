import { NextResponse } from "next/server";

// MVP v2: create a shareable link and store in Postgres (durable on Vercel).
// Next step: auth (magic link) + Stripe.

import { ensureSchema, sql } from "@/lib/db";

type Side = "A" | "B";

type CreateNudge = {
  title: string;
  action: string;
  deadlineMinutes: number;
  stakeA: number;
  stakeB: number;
  winner: Side;
};

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

  const winner: Side = body.winner === "B" ? "B" : "A";

  const id = crypto.randomUUID();
  const tokenA = crypto.randomUUID();
  const tokenB = crypto.randomUUID();

  await ensureSchema();

  await sql/* sql */`
    INSERT INTO nudges (
      id,
      title,
      action,
      deadline_minutes,
      stake_a,
      stake_b,
      winner,
      token_a,
      token_b
    ) VALUES (
      ${id}::uuid,
      ${title},
      ${action},
      ${deadlineMinutes},
      ${stakeA},
      ${stakeB},
      ${winner},
      ${tokenA}::uuid,
      ${tokenB}::uuid
    );
  `;

  // Build absolute URLs that work on whatever host the user is actually using (localhost, LAN IP, prod domain).
  const inferredOrigin = new URL(req.url).origin;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || inferredOrigin;

  const urlA = `${baseUrl}/n/${id}?t=${tokenA}`;
  const urlB = `${baseUrl}/n/${id}?t=${tokenB}`;

  return NextResponse.json({ id, urlA, urlB });
}
