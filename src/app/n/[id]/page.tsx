"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Side = "A" | "B";

type Nudge = {
  id: string;
  title: string;
  action: string;
  deadlineMinutes: number;
  stakeA: number;
  stakeB: number;
  winner: Side;
  createdAt: number;
  accepted: { A: boolean; B: boolean };
  outcome: { A: null | "done" | "not_done"; B: null | "done" | "not_done" };
  endedEarlyAt: null | number;
  viewer: { side: Side | null; token: string | null };
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

  // Always define hooks before any early returns to avoid hook-order errors.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  async function refresh() {
    if (!id) return;
    const url = new URL(`/api/nudges/${id}`, window.location.origin);
    const t = new URLSearchParams(window.location.search).get("t");
    if (t) url.searchParams.set("t", t);

    const res = await fetch(url.toString());
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    setNudge(await res.json());
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen text-zinc-50 p-8">
        <div className="mx-auto max-w-xl">Error: {error}</div>
      </main>
    );
  }

  if (!nudge) {
    return (
      <main className="min-h-screen text-zinc-50 p-8">
        <div className="mx-auto max-w-xl">Loading…</div>
      </main>
    );
  }

  const isKnownViewer = !!nudge.viewer.side;
  const mySide = nudge.viewer.side;
  const token = nudge.viewer.token;

  const deadlineMs = nudge.createdAt + nudge.deadlineMinutes * 60_000;
  const effectiveEndMs = nudge.endedEarlyAt ?? deadlineMs;

  const remainingMs = Math.max(0, effectiveEndMs - now);
  const expired = now >= effectiveEndMs;

  const mm = Math.floor(remainingMs / 60000);
  const ss = Math.floor((remainingMs % 60000) / 1000);
  const hh = Math.floor(mm / 60);
  const dd = Math.floor(hh / 24);
  const hh2 = hh % 24;
  const mm2 = mm % 60;
  const countdown = `${dd}d ${hh2}h ${mm2}m ${ss.toString().padStart(2, "0")}s`;

  async function act(kind: "accept" | "outcome", value?: "done" | "not_done") {
    if (!token || !nudge) return;
    await fetch(`/api/nudges/${nudge.id}/action`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, kind, value }),
    });
    await refresh();
  }

  const bothAccepted = nudge.accepted.A && nudge.accepted.B;
  const bothDone = nudge.outcome.A === "done" && nudge.outcome.B === "done";
  const bothNotDone = nudge.outcome.A === "not_done" && nudge.outcome.B === "not_done";
  const anyVoted = nudge.outcome.A || nudge.outcome.B;

  return (
    <main className="min-h-screen text-zinc-50">
      <div className="mx-auto max-w-xl px-5 py-10">
        <div className="text-sm text-zinc-400">nudge</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{nudge.title}</h1>
        <p className="mt-3 text-zinc-200 whitespace-pre-wrap">{nudge.action}</p>

        <div className="glass mt-6 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-300">Pot</div>
            <div className="text-lg font-semibold">{fmtMoney(pot)}</div>
          </div>
          <div className="text-sm text-zinc-300">Stake A: {fmtMoney(nudge.stakeA)}</div>
          <div className="text-sm text-zinc-300">Stake B: {fmtMoney(nudge.stakeB)}</div>
          <div className="text-sm text-zinc-300">Winner if completed: Person {nudge.winner}</div>

          <div className="glass-soft rounded-xl p-4">
            <div className="text-xs text-zinc-400">Time remaining</div>
            <div className="mt-1 font-mono text-lg">{expired ? "ENDED" : countdown}</div>
            {nudge.endedEarlyAt ? (
              <div className="mt-1 text-xs text-emerald-400">Ended early by mutual confirmation ✅</div>
            ) : null}
          </div>
        </div>

        <div className="glass mt-6 rounded-2xl p-6 space-y-4">
          <div className="text-sm font-semibold">Step 1 — Agree to the terms</div>
          <div className="text-sm text-zinc-300">
            Both people must accept before any money is captured (Stripe wiring next).
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className={`rounded-xl border p-3 ${nudge.accepted.A ? "border-emerald-500/60 bg-emerald-500/10" : "border-zinc-800"}`}>
              Person A: {nudge.accepted.A ? "Accepted" : "Not yet"}
            </div>
            <div className={`rounded-xl border p-3 ${nudge.accepted.B ? "border-emerald-500/60 bg-emerald-500/10" : "border-zinc-800"}`}>
              Person B: {nudge.accepted.B ? "Accepted" : "Not yet"}
            </div>
          </div>

          <button
            disabled={!isKnownViewer || (mySide === "A" ? nudge.accepted.A : nudge.accepted.B)}
            onClick={() => act("accept")}
            className="w-full rounded-xl bg-zinc-50 px-4 py-2.5 font-semibold text-zinc-950 disabled:opacity-50"
          >
            {isKnownViewer ? `Accept as Person ${mySide}` : "Open with your personal link to accept"}
          </button>
        </div>

        <div className="glass mt-6 rounded-2xl p-6 space-y-4">
          <div className="text-sm font-semibold">Step 2 — Consensus</div>
          <div className="text-sm text-zinc-300">
            Each person submits whether it happened. If both submit “done”, we end the timer early.
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-zinc-800 p-3">Person A vote: {nudge.outcome.A ?? "—"}</div>
            <div className="rounded-xl border border-zinc-800 p-3">Person B vote: {nudge.outcome.B ?? "—"}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={!isKnownViewer || !bothAccepted || bothDone}
              onClick={() => act("outcome", "done")}
              className="btn-primary rounded-xl px-4 py-2.5 font-semibold disabled:opacity-50"
            >
              It happened ✅
            </button>
            <button
              disabled={!isKnownViewer || !bothAccepted || bothDone}
              onClick={() => act("outcome", "not_done")}
              className="btn-secondary rounded-xl px-4 py-2.5 font-semibold text-zinc-50 disabled:opacity-50"
            >
              It didn’t ❌
            </button>
          </div>

          <div className="text-xs text-zinc-500">
            v1 rules: if disagreement or no-response within 24h after deadline → 100% to platform balance.
          </div>

          {bothDone ? <div className="text-sm text-emerald-400">Consensus reached: DONE ✅ (timer ends early)</div> : null}
          {bothNotDone ? <div className="text-sm text-zinc-300">Consensus reached: NOT DONE.</div> : null}
          {!bothDone && anyVoted ? <div className="text-xs text-zinc-500">Waiting for the other person…</div> : null}
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          This page is the consensus UX mock. Next step: Stripe funding + deadlines + the 24h post-deadline window.
        </div>
      </div>
    </main>
  );
}
