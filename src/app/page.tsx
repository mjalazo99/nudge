"use client";

import { useMemo, useState } from "react";

type Side = "A" | "B";

type Draft = {
  title: string;
  action: string;
  deadlineHours: number; // up to 30d
  stakeA: number;
  stakeB: number;
  winner: Side; // who receives pot if completed
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function fmtDuration(hours: number) {
  if (hours < 48) return `${hours}h`;
  const d = Math.round(hours / 24);
  if (d < 14) return `${d}d`;
  const w = Math.round(d / 7);
  return `${w}w`;
}

export default function Page() {
  const [draft, setDraft] = useState<Draft>({
    title: "",
    action: "",
    deadlineHours: 72,
    stakeA: 20,
    stakeB: 20,
    winner: "A",
  });

  const pot = useMemo(() => {
    return (draft.stakeA || 0) + (draft.stakeB || 0);
  }, [draft.stakeA, draft.stakeB]);

  const [status, setStatus] = useState<string>("");

  async function createNudge() {
    setStatus("Creating…");
    const payload = {
      title: draft.title.trim(),
      action: draft.action.trim(),
      deadlineHours: draft.deadlineHours,
      stakeA: draft.stakeA,
      stakeB: draft.stakeB,
      winner: draft.winner,
    };

    const res = await fetch("/api/nudges", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      setStatus(`Error: ${msg || res.status}`);
      return;
    }

    const { id, url } = await res.json();
    setStatus(`Created ✅ Share link: ${url}`);

    // simple UX: copy link
    try {
      await navigator.clipboard.writeText(url);
      setStatus(`Created ✅ Link copied: ${url}`);
    } catch {
      setStatus(`Created ✅ Share link: ${url}`);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-xl px-5 py-10">
        <header className="mb-8">
          <div className="text-sm text-zinc-400">nudge</div>
          <h1 className="text-3xl font-semibold tracking-tight">Don’t predict. Incentivize.</h1>
          <p className="mt-2 text-zinc-300">
            Two people agree on terms up front, put real money on it, and settle by mutual confirmation.
          </p>
        </header>

        <section className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div>
            <label className="text-sm text-zinc-300">Title</label>
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-zinc-600"
              placeholder="For $40, I’ll…"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Action</label>
            <textarea
              value={draft.action}
              onChange={(e) => setDraft((d) => ({ ...d, action: e.target.value }))}
              className="mt-1 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-zinc-600"
              rows={4}
              placeholder="Describe what has to happen. Keep it crisp."
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-300">Deadline</label>
              <div className="text-sm text-zinc-300">{fmtDuration(draft.deadlineHours)}</div>
            </div>
            <input
              type="range"
              min={24}
              max={24 * 30}
              step={24}
              value={draft.deadlineHours}
              onChange={(e) =>
                setDraft((d) => ({ ...d, deadlineHours: clamp(Number(e.target.value), 24, 24 * 30) }))
              }
              className="mt-2 w-full"
            />
            <div className="mt-1 text-xs text-zinc-400">Max 1 month. After deadline, there’s a 24h consensus window.</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-zinc-300">Stake (Person A)</label>
              <input
                inputMode="decimal"
                value={draft.stakeA}
                onChange={(e) => setDraft((d) => ({ ...d, stakeA: clamp(Number(e.target.value || 0), 0, 100000) }))}
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-300">Stake (Person B)</label>
              <input
                inputMode="decimal"
                value={draft.stakeB}
                onChange={(e) => setDraft((d) => ({ ...d, stakeB: clamp(Number(e.target.value || 0), 0, 100000) }))}
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-300">Winner (gets the pot if completed)</label>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setDraft((d) => ({ ...d, winner: "A" }))}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                  draft.winner === "A"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-950"
                }`}
              >
                Person A
              </button>
              <button
                onClick={() => setDraft((d) => ({ ...d, winner: "B" }))}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                  draft.winner === "B"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-950"
                }`}
              >
                Person B
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-300">Pot</div>
              <div className="text-lg font-semibold">{fmtMoney(pot)}</div>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              If you don’t both confirm within 24h after the deadline, 100% forfeits to the platform (v1 rule).
            </div>
          </div>

          <button
            onClick={createNudge}
            className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            Create share link
          </button>

          {status ? <div className="text-sm text-zinc-200">{status}</div> : null}
        </section>

        <footer className="mt-8 text-xs text-zinc-500">
          MVP: Stripe (test mode), 2 people, mutual consent up front.
        </footer>
      </div>
    </main>
  );
}
