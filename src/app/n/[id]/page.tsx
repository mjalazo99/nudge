"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Side = "A" | "B";

type Nudge = {
  id: string;
  title: string;
  action: string;
  deadlineHours: number;
  stakeA: number;
  stakeB: number;
  winner: Side;
  createdAt: number;
  state: string;
};

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export default function NudgePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const [error, setError] = useState<string>("");

  const pot = useMemo(() => {
    if (!nudge) return 0;
    return (nudge.stakeA || 0) + (nudge.stakeB || 0);
  }, [nudge]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/nudges/${id}`);
      if (!res.ok) {
        setError(await res.text());
        return;
      }
      setNudge(await res.json());
    })();
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
        <div className="mx-auto max-w-xl">Error: {error}</div>
      </main>
    );
  }

  if (!nudge) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
        <div className="mx-auto max-w-xl">Loading…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-xl px-5 py-10">
        <div className="text-sm text-zinc-400">nudge</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{nudge.title}</h1>
        <p className="mt-3 text-zinc-200 whitespace-pre-wrap">{nudge.action}</p>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-300">Pot</div>
            <div className="text-lg font-semibold">{fmtMoney(pot)}</div>
          </div>
          <div className="text-sm text-zinc-300">Stake A: {fmtMoney(nudge.stakeA)}</div>
          <div className="text-sm text-zinc-300">Stake B: {fmtMoney(nudge.stakeB)}</div>
          <div className="text-sm text-zinc-300">Winner if completed: Person {nudge.winner}</div>

          <div className="pt-2 text-xs text-zinc-400">
            MVP placeholder: next step is Stripe checkout + accept/fund flow.
          </div>
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Rule: if you don’t both confirm within 24h after deadline, funds forfeit to platform (v1).
        </div>
      </div>
    </main>
  );
}
