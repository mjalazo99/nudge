import { neon } from "@neondatabase/serverless";

// Uses Neon (Vercel marketplace) via DATABASE_URL.
// Important: DO NOT initialize the client at module load, or Next.js build can fail
// (env vars aren’t present during build in some contexts).

let client: ReturnType<typeof neon> | null = null;

function getClient() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("Missing DATABASE_URL");
    client = neon(url);
  }
  return client;
}

// Tagged-template wrapper that lazily initializes the Neon client.
export const sql = ((strings: any, ...values: any[]) => {
  return getClient()(strings, ...values);
}) as unknown as ReturnType<typeof neon>;

let schemaReady: Promise<void> | null = null;

export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql/* sql */`
        CREATE TABLE IF NOT EXISTS nudges (
          id UUID PRIMARY KEY,
          title TEXT NOT NULL,
          action TEXT NOT NULL,
          deadline_minutes INT NOT NULL,
          stake_a NUMERIC NOT NULL,
          stake_b NUMERIC NOT NULL,
          winner CHAR(1) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

          accepted_a BOOLEAN NOT NULL DEFAULT FALSE,
          accepted_b BOOLEAN NOT NULL DEFAULT FALSE,

          outcome_a TEXT NULL,
          outcome_b TEXT NULL,

          ended_early_at TIMESTAMPTZ NULL,

          token_a UUID NOT NULL,
          token_b UUID NOT NULL
        );
      `;

      await sql/* sql */`CREATE INDEX IF NOT EXISTS nudges_created_at_idx ON nudges (created_at DESC);`;
    })();
  }
  return schemaReady;
}
