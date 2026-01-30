import { NextResponse } from "next/server";

const globalAny = global as any;
const store: Map<string, any> = globalAny.__NUDGE_STORE__ || new Map();
globalAny.__NUDGE_STORE__ = store;

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const n = store.get(id);
  if (!n) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(n);
}
