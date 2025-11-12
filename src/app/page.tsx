"use client";

import React, { useEffect, useState } from "react";
import { fcl } from "../lib/flow";

// pretend price: 1 FLOW = $0.50
const FLOW_USD = 0.5;

// ---------------- HERO ----------------
function Hero() {
  return (
    <section
      style={{
        background:
          "linear-gradient(140deg, rgba(59,130,246,0.16) 0%, rgba(0,0,0,0) 60%)",
        border: "1px solid rgba(255,255,255,0.03)",
        borderRadius: "1.4rem",
        padding: "1.25rem 1.25rem 1.1rem",
        marginBottom: "1.25rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.25rem",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        {/* left text */}
        <div style={{ maxWidth: "420px" }}>
          <p
            style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "0.3rem",
            }}
          >
            nudge 👀
          </p>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 650,
              color: "#fff",
              marginBottom: "0.35rem",
            }}
          >
            Don’t predict. Incentivize.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.62)",
              fontSize: "0.78rem",
              lineHeight: 1.4,
            }}
          >
            “I’ll do it if you fund it.” Nudge lets you post an action, set a
            goal in dollars, and rally your friends to make it happen. Money
            stays locked until it’s done — because motivation hits different
            when your friends are in.
          </p>
        </div>

        {/* right example cards */}
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            flexWrap: "wrap",
            minWidth: "280px",
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.03)",
              borderRadius: "1rem",
              padding: "0.6rem 0.7rem 0.55rem",
              minWidth: "160px",
            }}
          >
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>
              Social dare
            </p>
            <p style={{ fontSize: "0.75rem", color: "#fff", marginTop: "0.25rem" }}>
              “$20 and I’ll jump in the ocean.”
            </p>
          </div>
          <div
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.03)",
              borderRadius: "1rem",
              padding: "0.6rem 0.7rem 0.55rem",
              minWidth: "160px",
            }}
          >
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>
              Group goal
            </p>
            <p style={{ fontSize: "0.75rem", color: "#fff", marginTop: "0.25rem" }}>
              “When this hits $500, we host the afterparty.”
            </p>
          </div>
          <div
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.03)",
              borderRadius: "1rem",
              padding: "0.6rem 0.7rem 0.55rem",
              minWidth: "160px",
            }}
          >
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>
              Dream nudge
            </p>
            <p style={{ fontSize: "0.75rem", color: "#fff", marginTop: "0.25rem" }}>
              “$1,000 and I’ll book the show.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// --------------- EXPLORE SECTION ---------------
function ExploreNudges() {
  return (
    <section style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ color: "#fff", fontSize: "1rem", marginBottom: "0.5rem" }}>
        Explore Nudge types
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        Different vibes, same idea — <strong>“For $X, I will…”</strong>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {/* ... keeping the cards the same as before ... */}
        <div
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.03)",
            borderRadius: "1rem",
            padding: "0.75rem 0.8rem",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "0.4rem",
            }}
          >
            Group goals
          </p>
          <p style={{ color: "#fff", fontSize: "0.74rem" }}>
            For <strong>$300</strong>, I will rent the karaoke room.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
            For <strong>$500</strong>, I will throw the afterparty.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
            For <strong>$1,000</strong>, I will book the weekend trip.
          </p>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.03)",
            borderRadius: "1rem",
            padding: "0.75rem 0.8rem",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "0.4rem",
            }}
          >
            Creator unlocks
          </p>
          <p style={{ color: "#fff", fontSize: "0.74rem" }}>
            For <strong>$400</strong>, I will drop the new music video.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
            For <strong>$250</strong>, I will host a class for backers.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
            For <strong>$1,000</strong>, I will host a public meetup.
          </p>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.03)",
            borderRadius: "1rem",
            padding: "0.75rem 0.8rem",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "0.4rem",
            }}
          >
            Social nudges
          </p>
          <p style={{ color: "#fff", fontSize: "0.74rem" }}>
            For <strong>$20</strong>, I will wear my costume to brunch.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
            For <strong>$15</strong>, I will text my ex “hope you’re well.”
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
            For <strong>$50</strong>, I will sing karaoke solo.
          </p>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.03)",
            borderRadius: "1rem",
            padding: "0.75rem 0.8rem",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "0.4rem",
            }}
          >
            Public challenges
          </p>
          <p style={{ color: "#fff", fontSize: "0.74rem" }}>
            For <strong>$200</strong>, I will run a 5K.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
            For <strong>$100</strong>, I will delete TikTok for a week.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
            For <strong>$50</strong>, I will wake up at 6am for 7 days.
          </p>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.03)",
            borderRadius: "1rem",
            padding: "0.75rem 0.8rem",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "0.4rem",
            }}
          >
            Good deeds
          </p>
          <p style={{ color: "#fff", fontSize: "0.74rem" }}>
            For <strong>$100</strong>, I will buy groceries for a neighbor.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
            For <strong>$200</strong>, I will volunteer at the shelter.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
            For <strong>$300</strong>, I will foster a dog for a month.
          </p>
        </div>
      </div>
    </section>
  );
}

// ----------- TYPES -----------
type ActionView = {
  id: number;
  creator: string;
  description: string;
  target: string;
  raised: string;
  expiresAt: string;
  isCompleted: boolean;
  isRefunded: boolean;
};

// --------------- MAIN PAGE ---------------
export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [actions, setActions] = useState<ActionView[]>([]);
  const [desc, setDesc] = useState("Wash the dishes");

  // new: USD target input
  const [targetUsd, setTargetUsd] = useState("20");
  // derived FLOW (string)
  const derivedFlow = targetUsd
    ? (Number(targetUsd) / FLOW_USD).toFixed(8)
    : "0.00000000";

  // new: datetime local expiry
  const [expiry, setExpiry] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  });

  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  // for countdowns
  const [now, setNow] = useState(Date.now());

  // subscribe to wallet
  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  // load actions
  useEffect(() => {
    fetchActions();
  }, []);

  // tick every second
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  async function fetchActions() {
    try {
      const resp: any = await fcl.query({
        cadence: `
          import DareflowEscrow from 0xf8d6e0586b0a20c7

          access(all) fun main(): [DareflowEscrow.ActionView] {
              return DareflowEscrow.getActions()
          }
        `,
        args: (arg, t) => [],
      });
      setActions((resp ?? []).sort((a: any, b: any) => b.id - a.id));
    } catch (e) {
      console.error("fetchActions error", e);
    }
  }

  function makeDurationSeconds(): string {
    // expiry is like "2025-11-10T17:00"
    const exp = new Date(expiry).getTime(); // ms
    const nowMs = Date.now();
    const diff = Math.max(0, (exp - nowMs) / 1000);
    // Cadence wants UFix64, so  "3600.0"
    return diff.toFixed(1);
  }

  async function createAction(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.addr) {
      setBanner("Connect wallet first.");
      return;
    }

    setLoading(true);
    setBanner("creating…");

    try {
      const targetFlowStr = derivedFlow; // already to 8 decimals
      const durationSeconds = makeDurationSeconds();

      const txId = await fcl.mutate({
        cadence: `
          import DareflowEscrow from 0xf8d6e0586b0a20c7

          transaction(description: String, target: UFix64, duration: UFix64) {
              prepare(signer: auth(BorrowValue) &Account) {
                  DareflowEscrow.createAction(
                      description: description,
                      target: target,
                      duration: duration
                  )
              }
          }
        `,
        args: (arg, t) => [
          arg(desc, t.String),
          arg(targetFlowStr, t.UFix64),
          arg(durationSeconds, t.UFix64),
        ],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      fcl.tx(txId).subscribe((s: any) => {
        if (s.status === 4) {
          setBanner("✅ nudge created");
          fetchActions();
          setDesc("");
        }
      });
    } catch (err) {
      console.error(err);
      setBanner("❌ error creating nudge");
    } finally {
      setLoading(false);
    }
  }

  async function fundAction(id: number) {
    const amount = prompt(
      "How much FLOW to add? (example: 5.00000000)",
      "5.00000000"
    );
    if (!amount) return;
    setBanner("funding…");

    try {
      const txId = await fcl.mutate({
        cadence: `
          import DareflowEscrow from 0xf8d6e0586b0a20c7

          transaction(actionId: UInt64, amount: UFix64) {
              prepare(signer: auth(BorrowValue) &Account) {
                  DareflowEscrow.fundAction(
                      id: actionId,
                      from: signer.address,
                      amount: amount
                  )
              }
          }
        `,
        args: (arg, t) => [arg(String(id), t.UInt64), arg(amount, t.UFix64)],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      fcl.tx(txId).subscribe((s: any) => {
        if (s.status === 4) {
          setBanner("✅ funded");
          fetchActions();
        }
      });
    } catch (e) {
      console.error(e);
      setBanner("❌ error funding");
    }
  }

  async function completeAction(id: number) {
    setBanner("marking complete…");

    try {
      const txId = await fcl.mutate({
        cadence: `
          import DareflowEscrow from 0xf8d6e0586b0a20c7

          transaction(actionId: UInt64) {
              prepare(signer: auth(BorrowValue) &Account) {
                  DareflowEscrow.completeAction(
                      id: actionId,
                      caller: signer.address
                  )
              }
          }
        `,
        args: (arg, t) => [arg(String(id), t.UInt64)],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      fcl.tx(txId).subscribe((s: any) => {
        if (s.status === 4) {
          setBanner("✅ marked complete");
          fetchActions();
        }
      });
    } catch (e) {
      console.error(e);
      setBanner("❌ error marking complete");
    }
  }

  function progress(a: ActionView) {
    const t = Number(a.target);
    const r = Number(a.raised);
    if (!t || t <= 0) return 0;
    return Math.min(100, Math.floor((r / t) * 100));
  }

  // helper to show countdown
  function formatCountdown(a: ActionView) {
    // a.expiresAt is a UFix64 string like "173123...."
    const expSec = parseFloat(a.expiresAt); // seconds
    if (!expSec) return "—";
    const expMs = expSec * 1000;
    const diff = expMs - now;
    if (diff <= 0) return "expired";

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s left`;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{ width: "100%", maxWidth: "1080px", padding: "1.5rem 1.25rem 4rem" }}
      >
        {/* top bar */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
  <h1
    style={{
      fontSize: "1.9rem",
      color: "#fff",
      marginBottom: "0.25rem",
    }}
  >
    nudge 👀
  </h1>
  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
      Don’t predict. Incentivize.
    </p>
    <a
      href="/why"
      style={{
        fontSize: "0.68rem",
        color: "rgba(255,255,255,0.7)",
        textDecoration: "none",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "9999px",
        padding: "0.15rem 0.5rem",
      }}
    >
      Why Nudge?
    </a>
  </div>
</div>

          {user && user.addr ? (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>
                Connected
              </p>
              <p style={{ fontSize: "0.8rem", color: "#fff" }}>{user.addr}</p>
              <button
                onClick={() => fcl.unauthenticate()}
                style={{
                  marginTop: "0.4rem",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "9999px",
                  color: "#fff",
                  padding: "0.25rem 0.8rem",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => fcl.authenticate()}
              style={{
                background: "#fff",
                border: "none",
                borderRadius: "9999px",
                padding: "0.45rem 1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Connect Wallet
            </button>
          )}
        </header>

        {/* hero */}
        <Hero />
        <ExploreNudges />

        {/* banner */}
        {banner && (
          <div
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.3)",
              color: "#fff",
              borderRadius: "0.75rem",
              padding: "0.6rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.78rem",
            }}
          >
            {banner}
          </div>
        )}

        {/* 2-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 360px) 1fr",
            gap: "1.5rem",
          }}
        >
          {/* left: create */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.03)",
              borderRadius: "1.2rem",
              padding: "1.25rem",
            }}
          >
            <h2 style={{ color: "#fff", fontSize: "1rem", marginBottom: "1rem" }}>
              Create a nudge
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              “For $X, I will…” Your friends fund it, you do it, chain records it.
            </p>

            <form onSubmit={createAction}>
              <label
                style={{
                  display: "block",
                  color: "#fff",
                  fontSize: "0.7rem",
                  marginBottom: "0.35rem",
                }}
              >
                Description
              </label>
              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
                placeholder="Host the afterparty"
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "0.6rem",
                  padding: "0.5rem 0.65rem",
                  color: "#fff",
                  marginBottom: "0.8rem",
                }}
              />

              {/* USD target */}
              <label
                style={{
                  display: "block",
                  color: "#fff",
                  fontSize: "0.7rem",
                  marginBottom: "0.35rem",
                }}
              >
                Target (USD)
              </label>
              <input
                value={targetUsd}
                onChange={(e) => setTargetUsd(e.target.value)}
                placeholder="50"
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "0.6rem",
                  padding: "0.5rem 0.65rem",
                  color: "#fff",
                  marginBottom: "0.5rem",
                }}
              />
              <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>
                ≈ {derivedFlow} FLOW (using 1 FLOW = ${FLOW_USD})
              </p>

              {/* datetime picker */}
              <label
                style={{
                  display: "block",
                  color: "#fff",
                  fontSize: "0.7rem",
                  marginTop: "0.8rem",
                  marginBottom: "0.35rem",
                }}
              >
                Expires at
              </label>
              <input
                type="datetime-local"
                value={expiry}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => setExpiry(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "0.6rem",
                  padding: "0.5rem 0.65rem",
                  color: "#fff",
                  marginBottom: "0.8rem",
                }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "rgba(255,255,255,0.25)" : "#3b82f6",
                  color: "#000",
                  border: "none",
                  borderRadius: "0.75rem",
                  padding: "0.6rem 0.7rem",
                  fontWeight: 600,
                  cursor: loading ? "wait" : "pointer",
                  marginTop: "0.2rem",
                }}
              >
                {loading ? "Creating..." : "Create Nudge"}
              </button>
            </form>
          </div>

          {/* right: feed */}
          <div>
            <h2 style={{ color: "#fff", fontSize: "1rem", marginBottom: "0.75rem" }}>
              Activity
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.7rem",
                marginBottom: "1rem",
              }}
            >
              Latest nudges on chain.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {actions.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
                  No nudges yet — make the first one 🔥
                </p>
              )}

              {actions.map((a) => (
                <div
                  key={a.id}
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.03)",
                    borderRadius: "1rem",
                    padding: "0.85rem 0.9rem 0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.3rem",
                    }}
                  >
                    <p style={{ color: "#fff", fontWeight: 600 }}>{a.description}</p>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        background: a.isCompleted
                          ? "rgba(59,130,246,0.15)"
                          : "rgba(255,255,255,0.03)",
                        border: a.isCompleted
                          ? "1px solid rgba(59,130,246,0.55)"
                          : "1px solid rgba(255,255,255,0.02)",
                        color: a.isCompleted
                          ? "#fff"
                          : "rgba(255,255,255,0.4)",
                        borderRadius: "9999px",
                        padding: "0.18rem 0.45rem",
                      }}
                    >
                      {a.isCompleted ? "completed" : "open"}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>
                    id {a.id} • creator {a.creator}
                  </p>

                  {/* countdown */}
                  <p
                    style={{
                      fontSize: "0.67rem",
                      color: "rgba(255,255,255,0.6)",
                      marginTop: "0.4rem",
                    }}
                  >
                    {formatCountdown(a)}
                  </p>

                  {/* progress */}
                  <div style={{ marginTop: "0.55rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.65rem",
                        color: "rgba(255,255,255,0.4)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <span>
                        raised {a.raised} / {a.target} FLOW
                      </span>
                      <span>{progress(a)}%</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "9999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${progress(a)}%`,
                          height: "100%",
                          background: "linear-gradient(90deg,#3b82f6,#93c5fd)",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* actions */}
                  <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.7rem" }}>
                    <button
                      onClick={() => fundAction(a.id)}
                      style={{
                        background: "#fff",
                        color: "#000",
                        border: "none",
                        borderRadius: "0.6rem",
                        padding: "0.4rem 0.8rem",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                      }}
                    >
                      Fund
                    </button>
                    <button
                      onClick={() => completeAction(a.id)}
                      style={{
                        background: "#3b82f6",
                        color: "#000",
                        border: "none",
                        borderRadius: "0.6rem",
                        padding: "0.4rem 0.8rem",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                      }}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}