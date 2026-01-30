"use client";

import { useMemo, useState } from "react";

type Side = "A" | "B";

type Draft = {
  title: string;
  action: string;
  // Deadline picker (max 30 days)
  days: number; // 0-30
  hours: number; // 0-24
  minutes: number; // 0-59
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

// (removed) fmtDuration: replaced by days/hours/minutes picker

export default function Page() {
  const [draft, setDraft] = useState<Draft>({
    title: "",
    action: "",
    days: 3,
    hours: 0,
    minutes: 0,
    stakeA: 20,
    stakeB: 20,
    winner: "A",
  });

  const pot = useMemo(() => {
    return (draft.stakeA || 0) + (draft.stakeB || 0);
  }, [draft.stakeA, draft.stakeB]);

  const deadlineMinutesTotal = useMemo(() => {
    const d = clamp(Math.floor(draft.days || 0), 0, 30);
    const h = clamp(Math.floor(draft.hours || 0), 0, 24);
    const m = clamp(Math.floor(draft.minutes || 0), 0, 59);
    return d * 24 * 60 + h * 60 + m;
  }, [draft.days, draft.hours, draft.minutes]);

  const deadlineLabel = useMemo(() => {
    const d = Math.floor(deadlineMinutesTotal / (24 * 60));
    const rem = deadlineMinutesTotal - d * 24 * 60;
    const h = Math.floor(rem / 60);
    const m = rem - h * 60;
    const parts: string[] = [];
    if (d) parts.push(`${d}d`);
    if (h) parts.push(`${h}h`);
    if (m || parts.length === 0) parts.push(`${m}m`);
    return parts.join(" ");
  }, [deadlineMinutesTotal]);

  const [status, setStatus] = useState<string>("");

  async function createNudge() {
    setStatus("Creating…");
    const payload = {
      title: draft.title.trim(),
      action: draft.action.trim(),
      deadlineMinutes: deadlineMinutesTotal,
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

    const { urlA, urlB } = await res.json();

    // MVP: show both links; creator can send B link to the other person.
    const msg = `Created ✅\nA link: ${urlA}\nB link: ${urlB}`;

    // copy both links
    try {
      await navigator.clipboard.writeText(msg);
      setStatus(`Created ✅ Links copied to clipboard.\n\nA: ${urlA}\nB: ${urlB}`);
    } catch {
      setStatus(msg);
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
              <div className="text-sm text-zinc-300">{deadlineLabel}</div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-zinc-400">Days</label>
                <select
                  value={draft.days}
                  onChange={(e) => setDraft((d) => ({ ...d, days: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-zinc-600"
                >
                  {Array.from({ length: 31 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400">Hours</label>
                <select
                  value={draft.hours}
                  onChange={(e) => setDraft((d) => ({ ...d, hours: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-zinc-600"
                >
                  {Array.from({ length: 25 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400">Minutes</label>
                <select
                  value={draft.minutes}
                  onChange={(e) => setDraft((d) => ({ ...d, minutes: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-zinc-600"
                >
                  {Array.from({ length: 60 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-1 text-xs text-zinc-400">Max 30 days. After deadline, there’s a 24h consensus window.</div>
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
