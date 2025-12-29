"use client";

import { useState } from "react";
import { getProvider } from "@/lib/provider";

export default function WalletButton() {
  const [address, setAddress] = useState<string | null>(null);

  async function connect() {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    setAddress(await signer.getAddress());
  }

  return (
    <button onClick={connect}>
      {address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
}
