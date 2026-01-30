"use client";

import { useState } from "react";
import { Connect } from "@onflow/react-sdk";

export function WalletConnect() {
  const [dare, setDare] = useState("");
  const [target, setTarget] = useState("10");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Created dare:\n"${dare}"\nGoal: ${target} FLOW`);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* simple wallet connect, straight from Flow React SDK */}
      <div
        style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: "1rem",
          padding: "1rem",
          marginBottom: "2rem",
          maxWidth: "420px",
        }}
      >
        <h2 style={{ marginBottom: "0.5rem" }}>Connect your Flow wallet</h2>
        <p style={{ opacity: 0.7, marginBottom: "1rem" }}>
          You need to be connected to create/fund dares.
        </p>
        <Connect />
      </div>

      <h1 style={{ fontSize: "2.4rem", marginBottom: "0.75rem" }}>
        dareflow 👀
      </h1>
      <p style={{ opacity: 0.8, marginBottom: "2rem", maxWidth: "520px" }}>
        Post a dare, let your friends fund it, then do the thing. We’ll add the
        onchain part next.
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: "420px" }}>
        <label style={{ display: "block", marginBottom: "1.25rem" }}>
          <span style={{ display: "block", marginBottom: "0.5rem" }}>
            Dare Description:
          </span>
          <input
            type="text"
            required
            placeholder="What will you do?"
            value={dare}
            onChange={(e) => setDare(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.7rem",
              borderRadius: "0.5rem",
              border: "1px solid #333",
              background: "#0f0f0f",
              color: "white",
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: "1.25rem" }}>
          <span style={{ display: "block", marginBottom: "0.5rem" }}>
            Funding Goal (FLOW):
          </span>
          <input
            type="number"
            min="1"
            step="1"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.7rem",
              borderRadius: "0.5rem",
              border: "1px solid #333",
              background: "#0f0f0f",
              color: "white",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            background: "#22c55e",
            color: "black",
            fontWeight: 600,
            padding: "0.6rem 1.2rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Create Dare
        </button>
      </form>
    </main>
  );
}

export default WalletConnect;