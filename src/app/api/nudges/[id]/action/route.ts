import { NextResponse } from "next/server";

type Side = "A" | "B";

const globalAny = global as any;
const store: Map<string, any> = globalAny.__NUDGE_STORE__ || new Map();
globalAny.__NUDGE_STORE__ = store;

function bad(msg: string, status = 400) {
  return new NextResponse(msg, { status });
}

function getSide(n: any, token: string | null): Side | null {
  if (!token) return null;
  if (n.tokens?.A === token) return "A";
  if (n.tokens?.B === token) return "B";
  return null;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const n = store.get(id);
  if (!n) return new NextResponse("Not found", { status: 404 });

  const body = (await req.json().catch(() => null)) as any;
  const token = typeof body?.token === "string" ? body.token : null;
  const side = getSide(n, token);
  if (!side) return bad("Invalid link/token", 403);

  const kind = body?.kind;

  if (kind === "accept") {
    n.accepted[side] = true;
    store.set(id, n);
    return NextResponse.json({ ok: true });
  }

  if (kind === "outcome") {
    const value = body?.value;
    if (value !== "done" && value !== "not_done") return bad("Invalid outcome");

    n.outcome[side] = value;

    // If both agree and it's "done", end early (consensus can end time early).
    if (n.outcome.A === "done" && n.outcome.B === "done") {
      n.endedEarlyAt = Date.now();
    }

    store.set(id, n);
    return NextResponse.json({ ok: true });
  }

  return bad("Unknown action");
}
