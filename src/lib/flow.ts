"use client";

import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("app.detail.title", "dareflow")
  .put("flow.network", "emulator")
  .put("accessNode.api", "http://localhost:8888")
  .put("discovery.wallet", "http://localhost:8701/fcl/authn")
  .put("0xDareflowEscrow", "0xf8d6e0586b0a20c7");

// 👇 add this
if (typeof window !== "undefined") {
  // @ts-ignore
  window.fcl = fcl;
}

export { fcl };