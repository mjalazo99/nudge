// src/app/why/page.tsx
"use client";

import React from "react";

export default function WhyPage() {
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
        style={{
          width: "100%",
          maxWidth: "900px",
          padding: "1.5rem 1.25rem 4rem",
        }}
      >
        {/* top */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.75rem",
          }}
        >
          <div>
            <h1
              style={{
                color: "#fff",
                fontSize: "1.6rem",
                marginBottom: "0.25rem",
              }}
            >
              Why Nudge?
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.75rem",
              }}
            >
              Don’t predict. Incentivize.
            </p>
          </div>
          <a
            href="/"
            style={{
              color: "#fff",
              fontSize: "0.72rem",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "9999px",
              padding: "0.35rem 0.8rem",
              textDecoration: "none",
            }}
          >
            ← back to app
          </a>
        </header>

        {/* intro */}
        <section
          style={{
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.15)",
            borderRadius: "1rem",
            padding: "1rem 1.1rem",
            marginBottom: "1.25rem",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.78rem",
              lineHeight: 1.5,
            }}
          >
            Nudge is a simple onchain layer for follow-through. You post,
            “If you fund this, I will do it.” Friends chip in. Funds stay locked
            until the thing actually happens. It’s not betting — it’s social
            escrow for normal people.
          </p>
        </section>

        {/* 3 verticals */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* 1. Micro kickstarters */}
          <div
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.03)",
              borderRadius: "1rem",
              padding: "1rem 1.1rem",
            }}
          >
            <h2
              style={{
                color: "#fff",
                fontSize: "0.9rem",
                marginBottom: "0.35rem",
              }}
            >
              1. Micro kickstarters for friends
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.72rem",
                marginBottom: "0.4rem",
              }}
            >
              Make small ideas real together. People only pay once the pot is
              full and the thing is done.
            </p>
            <ul
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.7rem",
                lineHeight: 1.4,
                paddingLeft: "1.1rem",
              }}
            >
              <li>“When this hits $500, we host the afterparty.”</li>
              <li>“$200 and I’ll cook for everyone on Saturday.”</li>
              <li>“$80 and I’ll book the karaoke room.”</li>
            </ul>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.68rem",
                marginTop: "0.45rem",
              }}
            >
              Why not Venmo? Because Venmo doesn’t hold funds in escrow —
              someone always fronts or chases. Nudge locks until the condition
              is met.
            </p>
          </div>

          {/* 2. Money where your mouth is */}
          <div
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.03)",
              borderRadius: "1rem",
              padding: "1rem 1.1rem",
            }}
          >
            <h2
              style={{
                color: "#fff",
                fontSize: "0.9rem",
                marginBottom: "0.35rem",
              }}
            >
              2. Money where your mouth is
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.72rem",
                marginBottom: "0.4rem",
              }}
            >
              Light accountability with real stakes. You put up a little money;
              your friends confirm if you actually did it.
            </p>
            <ul
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.7rem",
                lineHeight: 1.4,
                paddingLeft: "1.1rem",
              }}
            >
              <li>“If I send my resume today, release the funds.”</li>
              <li>“If I actually show up to boxing class, release it.”</li>
              <li>“If I don’t do it by 9pm, slash it.”</li>
            </ul>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.68rem",
                marginTop: "0.45rem",
              }}
            >
              Where does slashed money go? For MVP: back to contributors or to
              the protocol pool. Later: charity or yield bucket.
            </p>
          </div>

          {/* 3. Trustless group activities */}
          <div
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.03)",
              borderRadius: "1rem",
              padding: "1rem 1.1rem",
            }}
          >
            <h2
              style={{
                color: "#fff",
                fontSize: "0.9rem",
                marginBottom: "0.35rem",
              }}
            >
              3. Trustless group activities
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.72rem",
                marginBottom: "0.4rem",
              }}
            >
              Everyone chips in, no one gets stuck paying for flakes. Nudge
              releases funds only when the group confirms the thing actually
              happened.
            </p>
            <ul
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.7rem",
                lineHeight: 1.4,
                paddingLeft: "1.1rem",
              }}
            >
              <li>“$25 each for the picnic — unlock when 4/4 confirm.”</li>
              <li>“We’ll all pay $15 for the group Uber — unlock when driver is paid.”</li>
              <li>“$100 each for the cabin trip — unlock when organizer confirms booking.”</li>
            </ul>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.68rem",
                marginTop: "0.45rem",
              }}
            >
              Why not “just Venmo”? Because Venmo assumes trust. Nudge enforces
              it — nobody fronts, nobody chases.
            </p>
          </div>
        </div>

        {/* future ideas */}
        <section style={{ marginTop: "1.5rem" }}>
          <h3
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.78rem",
              marginBottom: "0.35rem",
            }}
          >
            Coming later
          </h3>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.68rem",
              lineHeight: 1.4,
            }}
          >
            • Optional yield on escrowed funds (opt-in pool) <br />
            • Better consensus rules (1 person = 1 vote, 90% for 10+ backers) <br />
            • Arbitration / challenge flow
          </p>
        </section>
      </div>
    </div>
  );
}