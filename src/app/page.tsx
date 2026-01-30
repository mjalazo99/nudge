"use client";

import { useMemo, useState, type ReactNode } from "react";

type Side = "A" | "B";

type StakeMode = "sponsor" | "wager";

type Draft = {
  // "Doer" is the person who is supposed to do the thing.
  doer: Side; // A = "I will", B = "They will"
  action: string;
  stakeMode: StakeMode;
  amount: number; // per-mode amount (sponsor amount or per-person wager amount)
  // Deadline picker (max 30 days)
  days: number; // 0-30
  hours: number; // 0-24
  minutes: number; // 0-59
  // Optional editable title for API (we auto-generate, but keep it available)
  title: string;
};

type Step =
  | "doer"
  | "action"
  | "stakeMode"
  | "amount"
  | "deadline"
  | "review"
  | "created";

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

function makeTitle(d: Draft, pot: number) {
  const who = d.doer === "A" ? "I" : "They";
  const action = (d.action || "").trim().replace(/\s+/g, " ");
  const snippet = action.length > 80 ? `${action.slice(0, 77)}…` : action;
  return `For ${fmtMoney(pot)}, ${who} will ${snippet || "…"}`;
}

function Bubble({
  from,
  children,
}: {
  from: "bot" | "me";
  children: ReactNode;
}) {
  const isMe = from === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isMe
            ? "max-w-[85%] rounded-2xl rounded-br-md bg-emerald-500/15 border border-emerald-500/25 px-4 py-2.5 text-sm text-zinc-50"
            : "max-w-[85%] rounded-2xl rounded-bl-md bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-zinc-100"
        }
      >
        {children}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-200"
          : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/8"
      }`}
    >
      {children}
    </button>
  );
}

export default function Page() {
  const [draft, setDraft] = useState<Draft>({
    doer: "A",
    action: "",
    stakeMode: "wager",
    amount: 20,
    days: 0,
    hours: 1,
    minutes: 0,
    title: "",
  });

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

  const stakes = useMemo(() => {
    const amount = clamp(Number(draft.amount || 0), 0, 100000);

    // Person A is always the creator of the links.
    // "Doer" means: who gets the pot if completed (winner).
    //
    // sponsor:
    //   - sponsor puts up the whole amount
    //   - doer stakes 0
    //   - doer is the winner if completed
    //
    // wager:
    //   - both stake the same amount
    //   - doer is the winner if completed
    let stakeA = 0;
    let stakeB = 0;
    if (draft.stakeMode === "sponsor") {
      if (draft.doer === "A") {
        // They sponsor me
        stakeA = 0;
        stakeB = amount;
      } else {
        // I sponsor them
        stakeA = amount;
        stakeB = 0;
      }
    } else {
      stakeA = amount;
      stakeB = amount;
    }

    const winner: Side = draft.doer;
    const pot = (stakeA || 0) + (stakeB || 0);

    return { stakeA, stakeB, winner, pot };
  }, [draft.amount, draft.doer, draft.stakeMode]);

  const [step, setStep] = useState<Step>("doer");
  const [status, setStatus] = useState<string>("");
  const [links, setLinks] = useState<{ urlA: string; urlB: string } | null>(null);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied ✅");
      setTimeout(() => setStatus(""), 1200);
    } catch {
      // ignore
    }
  }

  async function createNudge() {
    setStatus("Creating…");
    setLinks(null);

    const autoTitle = makeTitle(draft, stakes.pot);

    const payload = {
      title: (draft.title || autoTitle).trim(),
      action: draft.action.trim(),
      deadlineMinutes: deadlineMinutesTotal,
      stakeA: stakes.stakeA,
      stakeB: stakes.stakeB,
      winner: stakes.winner,
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
    setLinks({ urlA, urlB });
    setStep("created");

    // copy clean URLs (not labeled text)
    await copy(`${urlA}\n${urlB}`);
  }

  const stepIndex = (s: Step) => {
    const order: Step[] = ["doer", "action", "stakeMode", "amount", "deadline", "review", "created"];
    return order.indexOf(s);
  };

  function goBack() {
    const order: Step[] = ["doer", "action", "stakeMode", "amount", "deadline", "review", "created"];
    const i = order.indexOf(step);
    if (i <= 0) return;
    setStep(order[i - 1]);
  }

  const canContinue = useMemo(() => {
    if (step === "doer") return true;
    if (step === "action") return draft.action.trim().length > 0;
    if (step === "stakeMode") return true;
    if (step === "amount") return Number.isFinite(draft.amount) && draft.amount > 0;
    if (step === "deadline") return deadlineMinutesTotal >= 1 && deadlineMinutesTotal <= 30 * 24 * 60;
    if (step === "review") return true;
    return false;
  }, [deadlineMinutesTotal, draft.action, draft.amount, step]);

  function continueNext() {
    const order: Step[] = ["doer", "action", "stakeMode", "amount", "deadline", "review", "created"];
    const i = order.indexOf(step);
    if (i < 0 || i >= order.length - 2) return;
    setStep(order[i + 1]);
  }

  const autoTitle = useMemo(() => makeTitle(draft, stakes.pot), [draft, stakes.pot]);

  const promptBubbles = useMemo(() => {
    const bubbles: Array<{ from: "bot" | "me"; node: ReactNode }> = [];

    // Step 1
    bubbles.push({ from: "bot", node: "Who is doing the thing?" });
    if (stepIndex(step) >= stepIndex("action")) {
      bubbles.push({ from: "me", node: draft.doer === "A" ? "I will" : "They will" });
    }

    // Step 2
    if (stepIndex(step) >= stepIndex("action")) {
      bubbles.push({ from: "bot", node: "What’s the action? (Be specific and measurable.)" });
      if (stepIndex(step) >= stepIndex("stakeMode") && draft.action.trim()) {
        bubbles.push({ from: "me", node: draft.action.trim() });
      }
    }

    // Step 3
    if (stepIndex(step) >= stepIndex("stakeMode")) {
      bubbles.push({ from: "bot", node: "Stake mode?" });
      if (stepIndex(step) >= stepIndex("amount")) {
        bubbles.push({
          from: "me",
          node:
            draft.stakeMode === "sponsor"
              ? "Sponsor (one person funds the reward)"
              : "Wager (both put money on it)",
        });
      }
    }

    // Step 4
    if (stepIndex(step) >= stepIndex("amount")) {
      bubbles.push({
        from: "bot",
        node:
          draft.stakeMode === "sponsor"
            ? "How much should the sponsor put up?"
            : "How much should each person wager?",
      });
      if (stepIndex(step) >= stepIndex("deadline") && draft.amount > 0) {
        bubbles.push({ from: "me", node: fmtMoney(draft.amount) });
      }
    }

    // Step 5
    if (stepIndex(step) >= stepIndex("deadline")) {
      bubbles.push({ from: "bot", node: "What’s the deadline?" });
      if (stepIndex(step) >= stepIndex("review")) {
        bubbles.push({ from: "me", node: deadlineLabel });
      }
    }

    // Step 6 (review)
    if (stepIndex(step) >= stepIndex("review")) {
      bubbles.push({ from: "bot", node: "Review" });
    }

    return bubbles;
  }, [deadlineLabel, draft.action, draft.amount, draft.doer, draft.stakeMode, step]);

  return (
    <main className="min-h-screen text-zinc-50">
      <div className="mx-auto w-full max-w-xl px-4 pb-28 pt-8 sm:px-5 sm:pt-12">
        <header className="mb-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            nudge
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Create a nudge</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-300">
            A quick, mobile-first flow. You’ll get two share links at the end.
          </p>
        </header>

        <section className="glass rounded-2xl p-4 sm:p-6">
          <div className="space-y-3">
            {promptBubbles.map((b, i) => (
              <Bubble key={i} from={b.from}>
                {b.node}
              </Bubble>
            ))}
          </div>

          {step === "review" ? (
            <div className="mt-5 space-y-4">
              <div className="glass-soft rounded-xl p-4">
                <div className="text-xs text-zinc-400">Title (auto-generated, editable)</div>
                <input
                  value={draft.title || autoTitle}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  className="input mt-2 w-full rounded-xl px-3 py-2 text-sm text-zinc-50"
                />
              </div>

              <div className="glass-soft rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-zinc-400">Doer</div>
                    <div className="mt-1 font-medium">{draft.doer === "A" ? "I will" : "They will"}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-zinc-400">Deadline</div>
                    <div className="mt-1 font-medium mono">{deadlineLabel}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-zinc-400">Mode</div>
                    <div className="mt-1 font-medium">{draft.stakeMode === "sponsor" ? "Sponsor" : "Wager"}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-zinc-400">Pot</div>
                    <div className="mt-1 font-medium">{fmtMoney(stakes.pot)}</div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-zinc-200 whitespace-pre-wrap">{draft.action.trim()}</div>

                <div className="mt-3 text-xs text-zinc-400">
                  v1 rule: if disagreement or no-response within 24h after deadline → 100% to platform balance.
                </div>
              </div>

              <button onClick={createNudge} className="btn-primary w-full rounded-xl px-4 py-2.5 font-semibold">
                Create share links
              </button>

              {status ? <div className="text-sm text-zinc-200">{status}</div> : null}
            </div>
          ) : null}

          {step === "created" && links ? (
            <div className="mt-5 space-y-3">
              <div className="glass-soft rounded-xl p-4">
                <div className="text-sm font-semibold">Links created</div>
                <div className="mt-1 text-xs text-zinc-400">(Copied to clipboard)</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-zinc-400">Person A link</div>
                <a
                  className="mt-1 block break-all text-sm text-emerald-300 underline"
                  href={links.urlA}
                  target="_blank"
                  rel="noreferrer"
                >
                  {links.urlA}
                </a>
                <div className="mt-2 flex gap-2">
                  <button className="btn-secondary flex-1 rounded-xl px-3 py-2 text-sm" onClick={() => copy(links.urlA)}>
                    Copy A
                  </button>
                  <button
                    className="btn-secondary flex-1 rounded-xl px-3 py-2 text-sm"
                    onClick={() => window.open(links.urlA, "_blank")}
                  >
                    Open A
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-zinc-400">Person B link</div>
                <a
                  className="mt-1 block break-all text-sm text-emerald-300 underline"
                  href={links.urlB}
                  target="_blank"
                  rel="noreferrer"
                >
                  {links.urlB}
                </a>
                <div className="mt-2 flex gap-2">
                  <button className="btn-secondary flex-1 rounded-xl px-3 py-2 text-sm" onClick={() => copy(links.urlB)}>
                    Copy B
                  </button>
                  <button
                    className="btn-secondary flex-1 rounded-xl px-3 py-2 text-sm"
                    onClick={() => window.open(links.urlB, "_blank")}
                  >
                    Open B
                  </button>
                </div>
              </div>

              {status ? <div className="text-sm text-zinc-200">{status}</div> : null}

              <div className="text-xs text-zinc-400">
                Tip: send the B link to the other person. Each link is unique and lets that person accept + vote.
              </div>
            </div>
          ) : null}
        </section>

        <footer className="mt-6 text-center text-xs text-zinc-500">MVP: Stripe (test mode), 2 people, mutual consent up front.</footer>
      </div>

      {/* Sticky controls (mobile-first) */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto w-full max-w-xl px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === "doer" || step === "created"}
              className="btn-secondary rounded-xl px-3 py-2 text-sm disabled:opacity-50"
            >
              Back
            </button>

            <div className="flex-1">
              {step === "doer" ? (
                <div className="flex flex-wrap justify-end gap-2">
                  <Chip active={draft.doer === "A"} onClick={() => setDraft((d) => ({ ...d, doer: "A" }))}>
                    I will
                  </Chip>
                  <Chip active={draft.doer === "B"} onClick={() => setDraft((d) => ({ ...d, doer: "B" }))}>
                    They will
                  </Chip>
                </div>
              ) : null}

              {step === "action" ? (
                <div className="space-y-2">
                  <textarea
                    value={draft.action}
                    onChange={(e) => setDraft((d) => ({ ...d, action: e.target.value }))}
                    rows={2}
                    className="input w-full resize-none rounded-xl px-3 py-2 text-sm text-zinc-50"
                    placeholder={draft.doer === "A" ? "e.g. Run 3 miles 4x this week" : "e.g. Ship the landing page by Friday"}
                  />
                  <div className="text-[11px] text-zinc-400">Keep it crisp. This is what both people accept.</div>
                </div>
              ) : null}

              {step === "stakeMode" ? (
                <div className="flex flex-wrap justify-end gap-2">
                  <Chip active={draft.stakeMode === "sponsor"} onClick={() => setDraft((d) => ({ ...d, stakeMode: "sponsor" }))}>
                    Sponsor
                  </Chip>
                  <Chip active={draft.stakeMode === "wager"} onClick={() => setDraft((d) => ({ ...d, stakeMode: "wager" }))}>
                    Wager
                  </Chip>
                </div>
              ) : null}

              {step === "amount" ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-end gap-2">
                    {[5, 10, 20, 40, 100].map((amt) => (
                      <Chip key={amt} active={draft.amount === amt} onClick={() => setDraft((d) => ({ ...d, amount: amt }))}>
                        {fmtMoney(amt)}
                      </Chip>
                    ))}
                    <Chip
                      active={![5, 10, 20, 40, 100].includes(draft.amount)}
                      onClick={() => {
                        // focus will happen naturally by tapping input
                        setDraft((d) => ({ ...d }));
                      }}
                    >
                      Custom
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-zinc-400">{draft.stakeMode === "sponsor" ? "Sponsor" : "Each"}</div>
                    <input
                      inputMode="decimal"
                      value={draft.amount}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          amount: clamp(Number(e.target.value || 0), 0, 100000),
                        }))
                      }
                      className="input w-full rounded-xl px-3 py-2 text-sm text-zinc-50"
                    />
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {draft.stakeMode === "sponsor"
                      ? "Winner if completed = doer. (Sponsor stakes 100%, doer stakes 0.)"
                      : "Winner if completed = doer. (Both stake the same amount.)"}
                  </div>
                </div>
              ) : null}

              {step === "deadline" ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-[11px] text-zinc-400">Days</div>
                      <select
                        value={draft.days}
                        onChange={(e) => setDraft((d) => ({ ...d, days: Number(e.target.value) }))}
                        className="input mt-1 w-full rounded-xl px-3 py-2 text-sm text-zinc-50"
                      >
                        {Array.from({ length: 31 }).map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="text-[11px] text-zinc-400">Hours</div>
                      <select
                        value={draft.hours}
                        onChange={(e) => setDraft((d) => ({ ...d, hours: Number(e.target.value) }))}
                        className="input mt-1 w-full rounded-xl px-3 py-2 text-sm text-zinc-50"
                      >
                        {Array.from({ length: 25 }).map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="text-[11px] text-zinc-400">Minutes</div>
                      <select
                        value={draft.minutes}
                        onChange={(e) => setDraft((d) => ({ ...d, minutes: Number(e.target.value) }))}
                        className="input mt-1 w-full rounded-xl px-3 py-2 text-sm text-zinc-50"
                      >
                        {Array.from({ length: 60 }).map((_, i) => (
                          <option key={i} value={i}>
                            {i.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <div>Max 30 days</div>
                    <div className="mono">{deadlineLabel}</div>
                  </div>
                </div>
              ) : null}

              {step === "review" || step === "created" ? (
                <div className="text-right text-xs text-zinc-400">
                  {step === "created" ? "Done" : "Review & create"}
                </div>
              ) : null}
            </div>

            {step !== "review" && step !== "created" ? (
              <button
                type="button"
                onClick={continueNext}
                disabled={!canContinue}
                className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Next
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
