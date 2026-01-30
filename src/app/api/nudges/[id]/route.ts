import { NextResponse } from "next/server";

const globalAny = global as any;
const store: Map<string, any> = globalAny.__NUDGE_STORE__ || new Map();
globalAny.__NUDGE_STORE__ = store;

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const n = store.get(id);
  if (!n) return new NextResponse("Not found", { status: 404 });

  const url = new URL(req.url);
  const token = url.searchParams.get("t");
  const side = token === n.tokens?.A ? "A" : token === n.tokens?.B ? "B" : null;

  // Never leak the partner token.
  return NextResponse.json({
    ...n,
    viewer: {
      side,
      // show only the viewer token for convenience; hide the other.
      token: side ? token : null,
    },
    tokens: undefined,
  });
}
