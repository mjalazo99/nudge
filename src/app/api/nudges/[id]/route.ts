import { NextResponse } from "next/server";

import { ensureSchema, sql } from "@/lib/db";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  await ensureSchema();

  const rows = (await sql/* sql */`
    SELECT
      id,
      title,
      action,
      deadline_minutes,
      stake_a,
      stake_b,
      winner,
      created_at,
      accepted_a,
      accepted_b,
      outcome_a,
      outcome_b,
      ended_early_at,
      token_a,
      token_b
    FROM nudges
    WHERE id = ${id}::uuid
    LIMIT 1;
  `) as any[];

  const n = rows[0] as any;
  if (!n) return new NextResponse("Not found", { status: 404 });

  const url = new URL(req.url);
  const token = url.searchParams.get("t");
  const side = token === n.token_a ? "A" : token === n.token_b ? "B" : null;

  return NextResponse.json({
    id: n.id,
    title: n.title,
    action: n.action,
    deadlineMinutes: Number(n.deadline_minutes),
    stakeA: Number(n.stake_a),
    stakeB: Number(n.stake_b),
    winner: n.winner,
    createdAt: new Date(n.created_at).getTime(),

    accepted: { A: !!n.accepted_a, B: !!n.accepted_b },
    outcome: { A: n.outcome_a ?? null, B: n.outcome_b ?? null },
    endedEarlyAt: n.ended_early_at ? new Date(n.ended_early_at).getTime() : null,

    viewer: {
      side,
      token: side ? token : null,
    },
  });
}
