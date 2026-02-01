import { NextResponse } from "next/server";

import { ensureSchema, sql } from "@/lib/db";

type Side = "A" | "B";

function bad(msg: string, status = 400) {
  return new NextResponse(msg, { status });
}

async function getRow(id: string) {
  await ensureSchema();
  const rows = (await sql/* sql */`
    SELECT id, token_a, token_b, accepted_a, accepted_b, outcome_a, outcome_b, ended_early_at
    FROM nudges
    WHERE id = ${id}::uuid
    LIMIT 1;
  `) as any[];
  return rows[0] as any;
}

function getSide(n: any, token: string | null): Side | null {
  if (!token) return null;
  if (n.token_a === token) return "A";
  if (n.token_b === token) return "B";
  return null;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const n = await getRow(id);
  if (!n) return new NextResponse("Not found", { status: 404 });

  const body = (await req.json().catch(() => null)) as any;
  const token = typeof body?.token === "string" ? body.token : null;
  const side = getSide(n, token);
  if (!side) return bad("Invalid link/token", 403);

  const kind = body?.kind;

  if (kind === "accept") {
    if (side === "A") {
      await sql/* sql */`UPDATE nudges SET accepted_a = TRUE WHERE id = ${id}::uuid;`;
    } else {
      await sql/* sql */`UPDATE nudges SET accepted_b = TRUE WHERE id = ${id}::uuid;`;
    }
    return NextResponse.json({ ok: true });
  }

  if (kind === "outcome") {
    const value = body?.value;
    if (value !== "done" && value !== "not_done") return bad("Invalid outcome");

    if (side === "A") {
      await sql/* sql */`UPDATE nudges SET outcome_a = ${value} WHERE id = ${id}::uuid;`;
    } else {
      await sql/* sql */`UPDATE nudges SET outcome_b = ${value} WHERE id = ${id}::uuid;`;
    }

    // If both agree and it's "done", end early (consensus can end time early).
    const updated = await getRow(id);
    if (updated?.outcome_a === "done" && updated?.outcome_b === "done" && !updated?.ended_early_at) {
      await sql/* sql */`UPDATE nudges SET ended_early_at = NOW() WHERE id = ${id}::uuid;`;
    }

    return NextResponse.json({ ok: true });
  }

  return bad("Unknown action");
}
